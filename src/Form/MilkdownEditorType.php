<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Form;

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\Feature;
use Nowo\MilkdownEditorBundle\Form\DataTransformer\MarkdownNewlineTransformer;
use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
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
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Contracts\Translation\TranslatorInterface;

use function array_filter;
use function array_key_exists;
use function array_keys;
use function array_unique;
use function array_values;
use function class_exists;
use function implode;
use function in_array;
use function is_array;
use function is_bool;
use function is_int;
use function is_string;
use function mb_substr;
use function preg_match;
use function sprintf;
use function strlen;

/**
 * Markdown field edited with Milkdown (FR-072): a textarea holding the Markdown (the form value, and the no-JS
 * fallback) inside a widget root whose `data-nowo-milkdown-options` JSON configures the TypeScript editor.
 *
 * Options: `profile`, `features`, `theme`, `min_height`, `placeholder`, `suggestions` (`@`, `[[`, `:` → candidate
 * URL), `link_title_url`, `icon_sprite_url`, `icons`, `upload_url`, `upload_csrf_token`, `upload_max_size`,
 * `upload_accept`, `upload_accept_images`, `upload_accept_files` (1.8), `action_bar_insert` (1.8), `collaboration`,
 * `csp_nonce`, `max_length` (bytes; with symfony/validator a `Length` constraint is
 * added, by default the renderer's `max_input_length`, so oversized Markdown is rejected when it is written).
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
        'icon.browse', 'picker.label', 'picker.search', 'picker.list', 'picker.tab_icons', 'picker.tab_emoji', 'picker.none',
        'picker.empty', 'picker.count', 'picker.more', 'directive.callout_icon', 'directive.callout_icon_none',
        'upload.button', 'upload.uploading', 'upload.done', 'upload.failed', 'upload.too_large', 'upload.type',
        'upload.off', 'upload.waiting', 'upload.dismiss', 'slash.file',
        'directive.callout', 'directive.callout_type', 'directive.callout.info', 'directive.callout.success',
        'directive.callout.warning', 'directive.callout.danger', 'directive.details', 'directive.summary', 'directive.block',
        'directive.align', 'directive.align.left', 'directive.align.center', 'directive.align.right',
        'task.toggle',
        'slash.text', 'slash.h1', 'slash.h2', 'slash.h3', 'slash.bullet_list', 'slash.ordered_list', 'slash.task_list',
        'slash.quote', 'slash.code', 'slash.table', 'slash.divider', 'slash.callout', 'slash.details', 'slash.mermaid',
        'slash.math', 'slash.page_link', 'slash.mention', 'slash.icon',
        'collab.connecting', 'collab.online', 'collab.offline', 'collab.reset', 'collab.reset_paused', 'collab.reload',
    ];

    /**
     * UI strings of the states of 1.10, sent only to fields with `collaboration`, so other fields keep the same widget
     * JSON as before.
     *
     * @var list<string>
     */
    public const COLLABORATION_MESSAGE_KEYS = ['collab.standalone', 'collab.replaced', 'collab.save_waiting'];

    /**
     * UI strings sent only when their feature is enabled (1.3+), so fields without the feature keep the same widget
     * JSON as before.
     *
     * @var array<string, list<string>>
     */
    public const FEATURE_MESSAGE_KEYS = [
        'context_menu' => [
            'menu.label', 'menu.cut', 'menu.copy', 'menu.paste', 'menu.paste_plain', 'menu.paste_hint',
            'menu.link_open', 'menu.link_copy', 'menu.link_remove',
            'menu.row_above', 'menu.row_below', 'menu.column_left', 'menu.column_right', 'menu.delete_row',
            'menu.delete_column', 'menu.delete_table',
            'menu.turn_into', 'menu.duplicate', 'menu.move_up', 'menu.move_down', 'menu.delete',
        ],
        'block_actions' => [
            'block.actions', 'block.moved_up', 'block.moved_down', 'block.first', 'block.last',
            'menu.turn_into', 'menu.duplicate', 'menu.move_up', 'menu.move_down', 'menu.delete',
        ],
        'colors' => [
            'menu.color', 'color.default_text', 'color.default_background', 'color.text', 'color.background',
            'color.gray', 'color.brown', 'color.orange', 'color.yellow', 'color.green', 'color.blue', 'color.purple',
            'color.pink', 'color.red',
        ],
        'markdown_clipboard' => ['menu.paste_markdown', 'menu.copy_markdown', 'clipboard.copied_markdown', 'clipboard.copy_failed'],
        'insert_menu'        => ['menu.insert', 'menu.insert_file'],
        'image_block'        => [
            'image.alt', 'image.caption', 'image.width', 'image.width_original', 'image.align', 'image.align_left',
            'image.align_center', 'image.align_right', 'image.hidden', 'menu.image_edit',
        ],
        'insert_button' => ['insert.button'],
        'file_cards'    => [
            'file.open', 'file.download', 'file.view.link', 'file.view.icon', 'file.view.card', 'file.view.preview',
            'file.height.s', 'file.height.m', 'file.height.l', 'menu.file_view', 'menu.file_height', 'slash.file_link',
            'slash.file_icon', 'slash.file_preview',
        ],
        'version_view' => [
            'version.region', 'version.viewing', 'version.viewing_old', 'version.restore', 'version.copy',
        ],
        'top_bar' => [
            'topbar.heading', 'topbar.paragraph', 'topbar.h1', 'topbar.h2', 'topbar.h3', 'topbar.h4', 'topbar.h5', 'topbar.h6',
            'topbar.bold', 'topbar.italic', 'topbar.strikethrough', 'topbar.code', 'topbar.bullet_list', 'topbar.ordered_list', 'topbar.task_list', 'topbar.link',
            'topbar.image', 'topbar.table', 'topbar.code_block', 'topbar.math', 'topbar.quote', 'topbar.hr', 'topbar.more',
        ],
        'comments' => [
            'comments.action', 'comments.no_selection', 'comments.position', 'comments.position_label',
            'comments.title', 'comments.show_resolved', 'comments.truncated', 'comments.new_label', 'comments.send',
            'comments.cancel', 'comments.page', 'comments.add_page', 'comments.load_failed', 'comments.failed',
            'comments.sent', 'comments.new_reply', 'comments.open', 'comments.count', 'comments.orphaned',
            'comments.thread', 'comments.resolved_by', 'comments.resolve', 'comments.reopen', 'comments.reply',
            'comments.deleted', 'comments.edited', 'comments.react', 'comments.edit', 'comments.save',
            'comments.delete',
        ],
    ];

    /** Panels of the comment thread component (1.6). */
    public const COMMENT_PANELS = ['margin', 'sidebar', 'container', 'none'];

    /**
     * @param ProfileRegistry $profiles Named profiles
     * @param CspNonceProviderInterface|null $nonceProvider Nonce of the current response (when `csp_nonce` is null)
     * @param TranslatorInterface|null $translator Translates the editor UI strings
     * @param int $maxInputLength Default `max_length` (the renderer's `max_input_length`)
     * @param list<string> $markColors The renderer's `mark_colors`: the colours the editor offers (1.4, audit DB-I7)
     * @param HostSchemes|null $hostSchemes The renderer's `host_schemes`: fields with them get the image placeholder text (1.9)
     */
    public function __construct(
        private readonly ProfileRegistry $profiles,
        private readonly ?CspNonceProviderInterface $nonceProvider = null,
        private readonly ?TranslatorInterface $translator = null,
        private readonly int $maxInputLength = MilkdownMarkdownRenderer::DEFAULT_MAX_INPUT_LENGTH,
        private readonly array $markColors = [],
        private readonly ?HostSchemes $hostSchemes = null,
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
        /** @var list<string> $features */
        $features = $options['features'];

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
            'upload'        => $options['upload_url'] === null ? null : $this->upload($options),
            'collaboration' => $options['collaboration'],
            'messages'      => (object) $this->messages($features, $options['collaboration'] !== null),
        ];
        // 1.2.1: only when set, so fields with the defaults keep the same widget JSON.
        // 1.4: the editor offers the colours the renderer accepts (only with the colors feature: same JSON otherwise).
        if (in_array('colors', $features, true) && $this->markColors !== []) {
            $view->vars['milkdown_options']['colors'] = $this->markColors;
        }
        // 1.6: only with the feature (hooks only when the option is not set), so other fields keep the same JSON.
        if (in_array('comments', $features, true)) {
            /** @var array{url: string|null, csrf_token: string|null, can_create: bool, panel: string, container: string|null, topic: string|null} $comments */
            $comments = $options['comments'] ?? self::normaliseComments([]);

            $view->vars['milkdown_options']['comments'] = [
                'url'       => $comments['url'],
                'csrfToken' => $comments['csrf_token'],
                'canCreate' => $comments['can_create'],
                'panel'     => $comments['panel'],
                'container' => $comments['container'],
                'topic'     => $comments['topic'],
            ];
        }
        // 1.6: a read-only view of an old version with a banner (Restore / Copy emit events; false hides them).
        if (in_array('version_view', $features, true)) {
            /** @var array{label: string, restore: bool, copy: bool} $version */
            $version = $options['version'] ?? self::normaliseVersion([]);

            $view->vars['milkdown_options']['readonly']      = true;
            $view->vars['milkdown_options']['collaboration'] = null;
            $view->vars['milkdown_options']['upload']        = null;
            $view->vars['milkdown_options']['version']       = $version;
        }
        if ($options['mention_display'] === 'name') {
            $view->vars['milkdown_options']['mentionDisplay'] = 'name';
        }
        // 1.7: icons; only when not the default, so fields with the defaults keep the same widget JSON.
        if ($options['icon_catalog'] === true) {
            $view->vars['milkdown_options']['iconCatalog'] = true;
        }
        if ($options['toolbar_icons'] === false) {
            $view->vars['milkdown_options']['toolbarIcons'] = false;
        }
        if ($options['menu_icons'] === false) {
            $view->vars['milkdown_options']['menuIcons'] = false;
        }
        // 1.8 (ME-2): only when not the default, so fields with the defaults keep the same widget JSON.
        if ($options['action_bar_insert'] !== Configuration::ACTION_BAR_INSERT) {
            $view->vars['milkdown_options']['actionBarInsert'] = $options['action_bar_insert'];
        }
        if (is_string($options['user_title_url'])) {
            $view->vars['milkdown_options']['userTitleUrl'] = $options['user_title_url'];
        }
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
            'profile'              => null,
            'required'             => false,
            'empty_data'           => '',
            'placeholder'          => null,
            'suggestions'          => [],
            'link_title_url'       => null,
            'upload_url'           => null,
            'upload_csrf_token'    => null,
            'collaboration'        => null,
            'csp_nonce'            => null,
            'max_length'           => $this->maxInputLength,
            'features'             => static fn (Options $o): array => $profile($o)['features'],
            'theme'                => static fn (Options $o): string => $profile($o)['theme'],
            'min_height'           => static fn (Options $o): string => $profile($o)['min_height'],
            'icon_sprite_url'      => static fn (Options $o): ?string => $profile($o)['icon_sprite_url'],
            'icons'                => static fn (Options $o): array => $profile($o)['icons'],
            'upload_max_size'      => static fn (Options $o): int => $profile($o)['upload_max_size'],
            'upload_accept'        => static fn (Options $o): array => $profile($o)['upload_accept'],
            'mention_display'      => static fn (Options $o): string => $profile($o)['mention_display'] ?? 'handle',
            'icon_catalog'         => static fn (Options $o): bool => $profile($o)['icon_catalog'] ?? false,
            'toolbar_icons'        => static fn (Options $o): bool => $profile($o)['toolbar_icons'] ?? true,
            'menu_icons'           => static fn (Options $o): bool => $profile($o)['menu_icons'] ?? true,
            'action_bar_insert'    => static fn (Options $o): array => $profile($o)['action_bar_insert'] ?? Configuration::ACTION_BAR_INSERT,
            'upload_accept_images' => static fn (Options $o): array => $profile($o)['upload_accept_images'] ?? [],
            'upload_accept_files'  => static fn (Options $o): array => $profile($o)['upload_accept_files'] ?? [],
            'user_title_url'       => null,
            'comments'             => null,
            'version'              => null,
            'attr'                 => ['rows' => 12],
        ]);

        $resolver->setAllowedTypes('profile', ['null', 'string']);
        $resolver->setAllowedTypes('placeholder', ['null', 'string']);
        $resolver->setAllowedTypes('suggestions', 'array');
        $resolver->setAllowedTypes('link_title_url', ['null', 'string']);
        $resolver->setAllowedTypes('upload_url', ['null', 'string']);
        $resolver->setAllowedTypes('upload_csrf_token', ['null', 'string']);
        $resolver->setAllowedTypes('collaboration', ['null', 'array']);
        $resolver->setAllowedTypes('csp_nonce', ['null', 'string']);
        $resolver->setAllowedTypes('max_length', ['null', 'int']);
        $resolver->setAllowedValues('max_length', static fn (?int $value): bool => $value === null || $value >= 1);
        $resolver->setAllowedTypes('features', 'array');
        $resolver->setAllowedValues('theme', Theme::values());
        $resolver->setAllowedTypes('min_height', 'string');
        $resolver->setAllowedTypes('icon_sprite_url', ['null', 'string']);
        $resolver->setAllowedTypes('icons', 'string[]');
        $resolver->setAllowedTypes('upload_max_size', 'int');
        $resolver->setAllowedTypes('upload_accept', 'string[]');
        $resolver->setAllowedValues('mention_display', ['handle', 'name']);
        $resolver->setAllowedTypes('user_title_url', ['null', 'string']);
        $resolver->setAllowedTypes('icon_catalog', 'bool');
        $resolver->setAllowedTypes('toolbar_icons', 'bool');
        $resolver->setAllowedTypes('menu_icons', 'bool');
        $resolver->setAllowedTypes('action_bar_insert', 'string[]');
        $resolver->setAllowedTypes('upload_accept_images', 'string[]');
        $resolver->setAllowedTypes('upload_accept_files', 'string[]');
        $resolver->setNormalizer('action_bar_insert', static function (Options $o, array $value): array {
            foreach ($value as $button) {
                if (!in_array($button, Configuration::ACTION_BAR_INSERT, true)) {
                    throw new InvalidOptionsException(sprintf('Unknown "action_bar_insert" button "%s". Allowed: %s.', is_string($button) ? $button : get_debug_type($button), implode(', ', Configuration::ACTION_BAR_INSERT)));
                }
            }

            return array_values(array_filter(Configuration::ACTION_BAR_INSERT, static fn (string $b): bool => in_array($b, $value, true)));
        });
        $resolver->setAllowedTypes('comments', ['null', 'array']);
        $resolver->setAllowedTypes('version', ['null', 'array']);
        $resolver->setNormalizer('version', static fn (Options $o, ?array $value): ?array => $value === null ? null : self::normaliseVersion($value));

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
        $resolver->setNormalizer('comments', static fn (Options $o, ?array $value): ?array => $value === null ? null : self::normaliseComments($value));
        $resolver->setNormalizer('collaboration', static fn (Options $o, ?array $value): ?array => $value === null ? null : self::normaliseCollaboration($value));
        if ($resolver->isDefined('constraints') && class_exists(Length::class)) {
            $resolver->addNormalizer('constraints', static function (Options $o, mixed $value): mixed {
                $max = $o['max_length'];
                if (!is_int($max) || $max < 1) {
                    return $value;
                }
                $constraints   = $value instanceof Constraint ? [$value] : (is_array($value) ? $value : []);
                $constraints[] = new Length(max: $max, countUnit: Length::COUNT_BYTES);

                return $constraints;
            });
        }
    }

    /**
     * Validates the `comments` option (1.6): `url` (relative or http(s); the editor also requires the page origin),
     * `csrf_token`, `can_create`, `panel` (`margin` / `sidebar` / `container` need `url`; `container` renders into the host's
     * `container`, a CSS selector, or wherever the host calls `comments.mount()`) and `topic` (Mercure, needs `url`).
     *
     * @param array<mixed> $value The option
     *
     * @return array{url: string|null, csrf_token: string|null, can_create: bool, panel: string, container: string|null, topic: string|null}
     */
    public static function normaliseComments(array $value): array
    {
        foreach (array_keys($value) as $key) {
            if (!in_array($key, ['url', 'csrf_token', 'can_create', 'panel', 'container', 'topic'], true)) {
                throw new InvalidOptionsException(sprintf('Unknown "comments" option key "%s". Allowed: url, csrf_token, can_create, panel, container, topic.', (string) $key));
            }
        }
        $url = $value['url'] ?? null;
        if ($url !== null && (!is_string($url) || preg_match('#^(?:/(?![/\\\\])|https?://)#i', $url) !== 1)) {
            throw new InvalidOptionsException('The "comments.url" option must be a path starting with "/" or an http(s) URL on the page origin.');
        }
        $panel = $value['panel'] ?? ($url === null ? 'none' : 'margin');
        if (!in_array($panel, self::COMMENT_PANELS, true)) {
            throw new InvalidOptionsException(sprintf('The "comments.panel" option must be one of: %s.', implode(', ', self::COMMENT_PANELS)));
        }
        if ($url === null && $panel !== 'none') {
            throw new InvalidOptionsException('The "comments.panel" option needs "comments.url" (the thread component calls the host endpoints).');
        }
        $token = $value['csrf_token'] ?? null;
        $topic = $value['topic'] ?? null;
        if (($token !== null && !is_string($token)) || ($topic !== null && (!is_string($topic) || $url === null))) {
            throw new InvalidOptionsException('The "comments.csrf_token" and "comments.topic" options must be strings ("topic" needs "url").');
        }
        $container = $value['container'] ?? null;
        if ($container !== null && ($panel !== 'container' || !is_string($container) || $container === '' || strlen($container) > 200)) {
            throw new InvalidOptionsException('The "comments.container" option is a CSS selector (1–200 characters) for "panel: container".');
        }
        $canCreate = $value['can_create'] ?? true;
        if (!is_bool($canCreate)) {
            throw new InvalidOptionsException('The "comments.can_create" option must be a boolean.');
        }

        return ['url' => $url, 'csrf_token' => $token, 'can_create' => $canCreate, 'panel' => $panel, 'container' => $container, 'topic' => $topic];
    }

    /**
     * Validates the `version` option (1.6 `version_view`): `label` (text shown in the banner), `restore` and `copy`
     * (show the buttons that emit `nowo-milkdown:version-restore` / `version-copy`; false removes them).
     *
     * @param array<mixed> $value The option
     *
     * @return array{label: string, restore: bool, copy: bool}
     */
    public static function normaliseVersion(array $value): array
    {
        foreach (array_keys($value) as $key) {
            if (!in_array($key, ['label', 'restore', 'copy'], true)) {
                throw new InvalidOptionsException(sprintf('Unknown "version" option key "%s". Allowed: label, restore, copy.', (string) $key));
            }
        }
        $label   = $value['label'] ?? '';
        $restore = $value['restore'] ?? true;
        $copy    = $value['copy'] ?? true;
        if (!is_string($label) || !is_bool($restore) || !is_bool($copy)) {
            throw new InvalidOptionsException('The "version" option needs a string "label" and boolean "restore" / "copy".');
        }

        return ['label' => mb_substr($label, 0, 200), 'restore' => $restore, 'copy' => $copy];
    }

    /**
     * The `upload` part of the widget JSON. 1.8 (ME-3): with `upload_accept_images` / `upload_accept_files`, `accept` is
     * their union (images default to `upload_accept`; with neither, no image type) and both lists are sent; without
     * them the JSON is unchanged.
     *
     * @param array<string, mixed> $options The resolved options
     *
     * @return array<string, mixed>
     */
    private function upload(array $options): array
    {
        /** @var list<string> $accept */
        $accept = $options['upload_accept'];
        /** @var list<string> $images */
        $images = $options['upload_accept_images'];
        /** @var list<string> $files */
        $files  = $options['upload_accept_files'];
        $upload = [
            'url'       => $options['upload_url'],
            'csrfToken' => $options['upload_csrf_token'],
            'maxSize'   => $options['upload_max_size'],
            'accept'    => $accept,
        ];
        if ($images === [] && $files === []) {
            return $upload;
        }
        $images = $images !== [] ? $images : $accept;
        // The union of the lists that are set: with upload_accept_files alone, only those files (audit GR-I3; an
        // empty list never widens the filter to "any type").
        $upload['accept']       = array_values(array_unique([...$images, ...$files]));
        $upload['acceptImages'] = $images;
        $upload['acceptFiles']  = $files;

        return $upload;
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
        if (isset($features[Feature::VersionView->value], $features[Feature::Comments->value])) {
            throw new InvalidOptionsException('The "version_view" feature shows an old version: it never carries "comments".');
        }
        if (isset($features[Feature::BlockDrag->value]) && !isset($features[Feature::BlockActions->value])) {
            throw new InvalidOptionsException('The "block_drag" feature drags the block handle and needs "block_actions".');
        }
        if (isset($features[Feature::InsertMenu->value]) && !isset($features[Feature::ContextMenu->value])) {
            throw new InvalidOptionsException('The "insert_menu" feature is a group of the context menu and needs "context_menu".');
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
     * Collaboration needs `url`, `hub_url`, `topic` and a `user` name; the colour defaults to the accent. 1.5.1:
     * optional `update_delay_ms` (0–2000, coalescing window of document updates) and `awareness_delay_ms` (0–5000,
     * presence throttle) and `max_update_bytes` (1024–64 MiB, largest merged update per POST: the host's limit), sent
     * only when set so the widget JSON is unchanged otherwise. 1.10: optional `connect_timeout_ms` (0–60000, longest wait
     * for the shared document before the person edits without it), also only when set.
     *
     * @param array<mixed> $value The option
     *
     * @return array{url: string, hubUrl: string, topic: string, user: array{name: string, color: string}, updateDelay?: int, awarenessDelay?: int, maxUpdateBytes?: int, connectTimeout?: int}
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

        $out = ['url' => $url, 'hubUrl' => $hub, 'topic' => $topic, 'user' => ['name' => $name, 'color' => $color]];
        foreach (['update_delay_ms' => ['updateDelay', 0, 2000], 'awareness_delay_ms' => ['awarenessDelay', 0, 5000], 'max_update_bytes' => ['maxUpdateBytes', 1024, 67108864], 'connect_timeout_ms' => ['connectTimeout', 0, 60000]] as $key => [$json, $min, $max]) {
            if (!array_key_exists($key, $value)) {
                continue;
            }
            if (!is_int($value[$key]) || $value[$key] < $min || $value[$key] > $max) {
                throw new InvalidOptionsException(sprintf('The "collaboration.%s" option must be an integer from %d to %d.', $key, $min, $max));
            }
            $out[$json] = $value[$key];
        }

        return $out;
    }

    /**
     * Every editor UI string, translated (English defaults live in the TypeScript bundle when no translator).
     *
     * @param list<string> $features Enabled features (their extra strings are added)
     * @param bool $collaboration Whether the field has collaboration (the strings of its states are added)
     *
     * @return array<string, string>
     */
    private function messages(array $features, bool $collaboration): array
    {
        if (!$this->translator instanceof TranslatorInterface) {
            return [];
        }
        $keys = self::MESSAGE_KEYS;
        foreach ($features as $feature) {
            $keys = [...$keys, ...(self::FEATURE_MESSAGE_KEYS[$feature] ?? [])];
        }
        if ($collaboration) {
            $keys = [...$keys, ...self::COLLABORATION_MESSAGE_KEYS];
        }
        // 1.9 (ME-5): the placeholder of an image that cannot be shown, only with host references.
        if ($this->hostSchemes instanceof HostSchemes && !$this->hostSchemes->isEmpty()) {
            $keys[] = 'image.hidden';
        }
        $out = [];
        foreach ($keys as $key) {
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
