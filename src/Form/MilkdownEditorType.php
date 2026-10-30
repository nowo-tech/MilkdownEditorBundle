<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Form;

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\Feature;
use Nowo\MilkdownEditorBundle\Form\DataTransformer\MarkdownNewlineTransformer;
use Nowo\MilkdownEditorBundle\ProfileRegistry;
use Nowo\MilkdownEditorBundle\Theme;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

use function in_array;
use function is_array;
use function is_string;
use function sprintf;

/**
 * Markdown field edited with Milkdown (FR-072): a textarea holding the Markdown (the form value, and the no-JS
 * fallback) inside a widget root whose `data-nowo-milkdown-options` JSON configures the TypeScript editor.
 *
 * Options: `profile`, `features`, `theme`, `min_height`, `placeholder`, `suggestions` (`@`, `[[`, `:` → candidate
 * URL), `link_title_url`, `icon_sprite_url`, `icons`, `upload_url`, `upload_csrf_token`, `upload_max_size`,
 * `upload_accept`, `collaboration`, `csp_nonce`.
 *
 * @extends AbstractType<string>
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class MilkdownEditorType extends AbstractType
{
    /** Translation domain of the widget strings (REQ-I18N-003). */
    public const DOMAIN = 'NowoMilkdownEditorBundle';

    /** Suggestion triggers of the dialect. */
    public const TRIGGERS = ['@', '[[', ':'];

    /** Keys of the editor UI strings (the same keys as the TypeScript defaults). */
    public const MESSAGE_KEYS = [
        'editor.label', 'editor.placeholder', 'editor.button',
        'table.add_row', 'table.add_column', 'table.drag_row', 'table.drag_column', 'table.delete_row', 'table.delete_column',
        'table.align_left', 'table.align_center', 'table.align_right',
        'code.content', 'code.language', 'code.copy', 'code.preview',
        'suggest.label.mention', 'suggest.label.page', 'suggest.label.icon', 'suggest.label.slash',
        'suggest.empty', 'suggest.count', 'suggest.failed',
        'ref.hidden', 'ref.loading', 'icon.unknown', 'icon.button',
        'upload.button', 'upload.uploading', 'upload.done', 'upload.failed', 'upload.too_large', 'upload.type',
        'directive.callout', 'directive.callout_type', 'directive.callout.info', 'directive.callout.success',
        'directive.callout.warning', 'directive.callout.danger', 'directive.details', 'directive.summary', 'directive.block',
        'directive.align', 'directive.align.left', 'directive.align.center', 'directive.align.right',
        'task.toggle',
        'slash.text', 'slash.h1', 'slash.h2', 'slash.h3', 'slash.bullet_list', 'slash.ordered_list', 'slash.task_list',
        'slash.quote', 'slash.code', 'slash.table', 'slash.divider', 'slash.callout', 'slash.details', 'slash.mermaid',
        'slash.math', 'slash.page_link', 'slash.mention', 'slash.icon',
        'collab.connecting', 'collab.online', 'collab.offline',
    ];

    /**
     * @param ProfileRegistry $profiles Named profiles
     * @param CspNonceProviderInterface|null $nonceProvider Nonce of the current response (when `csp_nonce` is null)
     * @param TranslatorInterface|null $translator Translates the editor UI strings
     */
    public function __construct(
        private readonly ProfileRegistry $profiles,
        private readonly ?CspNonceProviderInterface $nonceProvider = null,
        private readonly ?TranslatorInterface $translator = null,
    ) {
    }

    /**
     * Normalises line endings of the submitted Markdown.
     *
     * @param FormBuilderInterface<string|null> $builder The field builder
     * @param array<string, mixed> $options The resolved options
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->addModelTransformer(new MarkdownNewlineTransformer());
    }

    /**
     * Exposes `milkdown_options` (the widget JSON) and `milkdown_nonce` to the form theme.
     *
     * @param FormView $view The field view
     * @param FormInterface<mixed> $form The field
     * @param array<string, mixed> $options The resolved options
     */
    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        /** @var string|null $nonce */
        $nonce  = $options['csp_nonce'] ?? $this->nonceProvider?->getNonce();
        $label  = is_string($view->vars['label'] ?? null) ? $view->vars['label'] : null;
        $locale = null;

        $view->vars['milkdown_nonce']   = $nonce;
        $view->vars['milkdown_theme']   = $options['theme'];
        $view->vars['milkdown_options'] = [
            'features'      => $options['features'],
            'theme'         => $options['theme'],
            'minHeight'     => $options['min_height'],
            'placeholder'   => $this->text(is_string($options['placeholder']) ? $options['placeholder'] : null, $options['translation_domain'], $locale),
            'label'         => $label !== null ? $this->text($label, $options['translation_domain'], $locale) : '',
            'readonly'      => $options['disabled'] === true,
            'suggestions'   => (object) $options['suggestions'],
            'linkTitleUrl'  => $options['link_title_url'],
            'iconSpriteUrl' => $options['icon_sprite_url'],
            'icons'         => $options['icons'],
            'upload'        => $options['upload_url'] === null ? null : [
                'url'       => $options['upload_url'],
                'csrfToken' => $options['upload_csrf_token'],
                'maxSize'   => $options['upload_max_size'],
                'accept'    => $options['upload_accept'],
            ],
            'collaboration' => $options['collaboration'],
            'nonce'         => $nonce ?? '',
            'messages'      => (object) $this->messages(),
        ];
    }

    /**
     * Declares the options; profile values are the defaults.
     *
     * @param OptionsResolver $resolver The options resolver
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $profile = fn (Options $o): array => $this->profiles->get(is_string($o['profile']) ? $o['profile'] : null);

        $resolver->setDefaults([
            'profile'           => null,
            'required'          => false,
            'empty_data'        => '',
            'placeholder'       => null,
            'suggestions'       => [],
            'link_title_url'    => null,
            'upload_url'        => null,
            'upload_csrf_token' => null,
            'collaboration'     => null,
            'csp_nonce'         => null,
            'features'          => static fn (Options $o): array => $profile($o)['features'],
            'theme'             => static fn (Options $o): string => $profile($o)['theme'],
            'min_height'        => static fn (Options $o): string => $profile($o)['min_height'],
            'icon_sprite_url'   => static fn (Options $o): ?string => $profile($o)['icon_sprite_url'],
            'icons'             => static fn (Options $o): array => $profile($o)['icons'],
            'upload_max_size'   => static fn (Options $o): int => $profile($o)['upload_max_size'],
            'upload_accept'     => static fn (Options $o): array => $profile($o)['upload_accept'],
            'attr'              => ['rows' => 12],
        ]);

        $resolver->setAllowedTypes('profile', ['null', 'string']);
        $resolver->setAllowedTypes('placeholder', ['null', 'string']);
        $resolver->setAllowedTypes('suggestions', 'array');
        $resolver->setAllowedTypes('link_title_url', ['null', 'string']);
        $resolver->setAllowedTypes('upload_url', ['null', 'string']);
        $resolver->setAllowedTypes('upload_csrf_token', ['null', 'string']);
        $resolver->setAllowedTypes('collaboration', ['null', 'array']);
        $resolver->setAllowedTypes('csp_nonce', ['null', 'string']);
        $resolver->setAllowedTypes('features', 'array');
        $resolver->setAllowedValues('theme', Theme::values());
        $resolver->setAllowedTypes('min_height', 'string');
        $resolver->setAllowedTypes('icon_sprite_url', ['null', 'string']);
        $resolver->setAllowedTypes('icons', 'string[]');
        $resolver->setAllowedTypes('upload_max_size', 'int');
        $resolver->setAllowedTypes('upload_accept', 'string[]');

        $resolver->setNormalizer('profile', function (Options $o, ?string $value): ?string {
            if ($value !== null && !$this->profiles->has($value)) {
                throw new InvalidOptionsException(sprintf('Unknown Milkdown editor profile "%s". Available profiles: %s.', $value, implode(', ', $this->profiles->names())));
            }

            return $value;
        });
        $resolver->setNormalizer('features', static fn (Options $o, array $value): array => self::normaliseFeatures($value));
        $resolver->setNormalizer('min_height', static function (Options $o, string $value): string {
            if (preg_match(Configuration::LENGTH_PATTERN, $value) !== 1) {
                throw new InvalidOptionsException(sprintf('The "min_height" option must be a CSS length in px, rem, em or vh, "%s" given.', $value));
            }

            return $value;
        });
        $resolver->setNormalizer('icons', static function (Options $o, array $value): array {
            $icons = [];
            foreach ($value as $name) {
                if (!is_string($name) || preg_match(Configuration::ICON_PATTERN, $name) !== 1) {
                    throw new InvalidOptionsException(sprintf('Invalid icon name "%s": lower-case words joined by hyphens.', is_string($name) ? $name : get_debug_type($name)));
                }
                $icons[$name] = $name;
            }

            return array_values($icons);
        });
        $resolver->setNormalizer('suggestions', static fn (Options $o, array $value): array => self::normaliseSuggestions($value));
        $resolver->setNormalizer('collaboration', static fn (Options $o, ?array $value): ?array => $value === null ? null : self::normaliseCollaboration($value));
    }

    /**
     * Uses `<textarea>` underneath (the value and the no-JS fallback).
     */
    public function getParent(): string
    {
        return TextareaType::class;
    }

    /**
     * Block prefix of the widget (`milkdown_editor_widget` in the form theme).
     */
    public function getBlockPrefix(): string
    {
        return 'milkdown_editor';
    }

    /**
     * Validates feature names; Math and Mermaid need CodeMirror.
     *
     * @param array<mixed> $value Feature names or {@see Feature} cases
     *
     * @return list<string>
     */
    public static function normaliseFeatures(array $value): array
    {
        $features = [];
        foreach ($value as $item) {
            $feature = $item instanceof Feature ? $item : (is_string($item) ? Feature::tryFrom($item) : null);
            if ($feature === null) {
                throw new InvalidOptionsException(sprintf('Unknown Milkdown editor feature "%s". Allowed: %s.', is_string($item) ? $item : get_debug_type($item), implode(', ', Feature::values())));
            }
            $features[$feature->value] = $feature;
        }
        foreach ($features as $feature) {
            if ($feature->needsCodeMirror() && !isset($features[Feature::CodeMirror->value])) {
                throw new InvalidOptionsException(sprintf('The "%s" feature renders in code blocks and needs "code_mirror".', $feature->value));
            }
        }

        return array_keys($features);
    }

    /**
     * Keeps `@`, `[[` and `:` triggers with a non-empty URL.
     *
     * @param array<mixed> $value Trigger → candidate URL
     *
     * @return array<string, string>
     */
    public static function normaliseSuggestions(array $value): array
    {
        $out = [];
        foreach ($value as $trigger => $url) {
            if (!in_array($trigger, self::TRIGGERS, true)) {
                throw new InvalidOptionsException(sprintf('Unknown suggestion trigger "%s". Allowed: %s.', (string) $trigger, implode(', ', self::TRIGGERS)));
            }
            if (!is_string($url) || $url === '') {
                throw new InvalidOptionsException(sprintf('The suggestion trigger "%s" needs a candidate URL.', $trigger));
            }
            $out[(string) $trigger] = $url;
        }

        return $out;
    }

    /**
     * Collaboration needs `url`, `hub_url`, `topic` and a `user` name; the colour defaults to the accent.
     *
     * @param array<mixed> $value The option
     *
     * @return array{url: string, hubUrl: string, topic: string, user: array{name: string, color: string}}
     */
    public static function normaliseCollaboration(array $value): array
    {
        foreach (['url', 'hub_url', 'topic'] as $key) {
            if (!is_string($value[$key] ?? null) || $value[$key] === '') {
                throw new InvalidOptionsException(sprintf('The "collaboration" option needs a non-empty "%s".', $key));
            }
        }
        $user  = is_array($value['user'] ?? null) ? $value['user'] : [];
        $name  = is_string($user['name'] ?? null) && $user['name'] !== '' ? $user['name'] : 'Anonymous';
        $color = is_string($user['color'] ?? null) && preg_match('/^#[0-9a-fA-F]{6}$/', $user['color']) === 1 ? $user['color'] : '#1f6f54';

        /** @var string $url */
        $url = $value['url'];
        /** @var string $hub */
        $hub = $value['hub_url'];
        /** @var string $topic */
        $topic = $value['topic'];

        return ['url' => $url, 'hubUrl' => $hub, 'topic' => $topic, 'user' => ['name' => $name, 'color' => $color]];
    }

    /**
     * Every editor UI string, translated (English defaults live in the TypeScript bundle when no translator).
     *
     * @return array<string, string>
     */
    private function messages(): array
    {
        if (!$this->translator instanceof TranslatorInterface) {
            return [];
        }
        $out = [];
        foreach (self::MESSAGE_KEYS as $key) {
            $text = $this->translator->trans($key, [], self::DOMAIN);
            if ($text !== $key) {
                $out[$key] = $text;
            }
        }

        return $out;
    }

    private function text(?string $value, mixed $domain, ?string $locale): string
    {
        if ($value === null || $value === '') {
            return '';
        }
        if (!$this->translator instanceof TranslatorInterface || $domain === false) {
            return $value;
        }

        return $this->translator->trans($value, [], is_string($domain) ? $domain : null, $locale);
    }
}
