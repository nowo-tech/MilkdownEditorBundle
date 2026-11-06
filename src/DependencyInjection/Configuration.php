<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\DependencyInjection;

use Nowo\MilkdownEditorBundle\Feature;
use Nowo\MilkdownEditorBundle\Markdown\DocumentProcessor;
use Nowo\MilkdownEditorBundle\Markdown\FileCard;
use Nowo\MilkdownEditorBundle\Markdown\FootnoteGuard;
use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Theme;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\Definition\Exception\InvalidConfigurationException;

use function array_filter;
use function implode;
use function in_array;
use function is_array;
use function is_string;
use function preg_match;
use function sprintf;
use function strlen;

/**
 * Configuration tree of `nowo_milkdown_editor` (REQ-CFG-001 / REQ-SF-006).
 *
 *     nowo_milkdown_editor:
 *         default_profile: default
 *         profiles:
 *             default: { features: [...], theme: auto, min_height: 12rem, icon_sprite_url: ~, icons: [], icon_catalog: false, toolbar_icons: true, menu_icons: true, action_bar_insert: [file, icon], upload_max_size: 10485760, upload_accept: [], upload_accept_images: [], upload_accept_files: [] }
 *         markdown: { html_input: escape, allow_unsafe_links: false, allow_remote_images: false, math: true, ... }
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class Configuration implements ConfigurationInterface
{
    /** Root key of the bundle configuration and name of its asset package. */
    public const ALIAS = 'nowo_milkdown_editor';

    /** Icon names: lower-case words joined by single hyphens (the Tabler naming). */
    public const ICON_PATTERN = '/^[a-z0-9]+(?:-[a-z0-9]+)*$/';

    /** Buttons of the action bar that `action_bar_insert` may keep (1.8, ME-2). */
    public const ACTION_BAR_INSERT = ['file', 'icon'];

    /** CSS length accepted for `min_height`. */
    public const LENGTH_PATTERN = '/^\d+(?:\.\d+)?(?:px|rem|em|vh)$/';

    /**
     * Builds the tree; the default profile must exist and Math / Mermaid need CodeMirror.
     */
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder(self::ALIAS);
        $root        = $treeBuilder->getRootNode();

        $root
            ->children()
                ->scalarNode('default_profile')
                    ->info('Profile used when a form field does not set the `profile` option.')
                    ->defaultValue('default')
                    ->cannotBeEmpty()
                ->end()
                ->append($this->profilesNode())
                ->append($this->markdownNode())
            ->end()
            ->validate()
                ->ifTrue(static fn (array $c): bool => !is_array($c['profiles'] ?? null) || !is_string($c['default_profile'] ?? null) || !isset($c['profiles'][$c['default_profile']]))
                ->then(static function (array $c): array {
                    $profiles = is_array($c['profiles'] ?? null) ? array_keys($c['profiles']) : [];

                    throw new InvalidConfigurationException(sprintf('The default profile "%s" is not defined under "nowo_milkdown_editor.profiles" (defined: %s).', is_string($c['default_profile'] ?? null) ? $c['default_profile'] : '', implode(', ', $profiles)));
                })
            ->end();

        return $treeBuilder;
    }

    private function profilesNode(): ArrayNodeDefinition
    {
        $node = (new TreeBuilder('profiles'))->getRootNode();
        $node
            ->info('Named editor profiles; a form field picks one with the `profile` option.')
            ->useAttributeAsKey('name')
            ->addDefaultChildrenIfNoneSet(['default'])
            ->arrayPrototype()
                ->children()
                    ->arrayNode('features')
                        ->info('Editor features: ' . implode(', ', Feature::values()) . '.')
                        ->scalarPrototype()->end()
                        ->defaultValue(array_map(static fn (Feature $f): string => $f->value, Feature::defaults()))
                        ->validate()
                            ->ifTrue(static fn (array $v): bool => array_filter($v, static fn (mixed $f): bool => !in_array($f, Feature::values(), true)) !== [])
                            ->thenInvalid('Unknown editor feature in %s. Allowed: ' . implode(', ', Feature::values()) . '.')
                        ->end()
                        ->validate()
                            ->ifTrue(static fn (array $v): bool => (in_array('math', $v, true) || in_array('mermaid', $v, true)) && !in_array('code_mirror', $v, true))
                            ->thenInvalid('The "math" and "mermaid" features render in code blocks and need "code_mirror" (%s).')
                        ->end()
                        ->validate()
                            ->ifTrue(static fn (array $v): bool => in_array('block_drag', $v, true) && !in_array('block_actions', $v, true))
                            ->thenInvalid('The "block_drag" feature drags the block handle and needs "block_actions" (%s).')
                        ->end()
                        ->validate()
                            ->ifTrue(static fn (array $v): bool => in_array('insert_menu', $v, true) && !in_array('context_menu', $v, true))
                            ->thenInvalid('The "insert_menu" feature is a group of the context menu and needs "context_menu" (%s).')
                        ->end()
                    ->end()
                    ->enumNode('theme')->values(Theme::values())->defaultValue('auto')->end()
                    ->scalarNode('min_height')
                        ->defaultValue('12rem')
                        ->validate()
                            ->ifTrue(static fn (mixed $v): bool => !is_string($v) || preg_match(self::LENGTH_PATTERN, $v) !== 1)
                            ->thenInvalid('min_height must be a CSS length in px, rem, em or vh (got %s).')
                        ->end()
                    ->end()
                    ->scalarNode('icon_sprite_url')
                        ->info('URL of the SVG sprite with <symbol id="tabler-NAME"> icons (null: icons render as text).')
                        ->defaultNull()
                    ->end()
                    ->append($this->iconsNode('Allowlisted icon names (`:tabler-NAME:`) offered by the `:` trigger.'))
                    ->booleanNode('icon_catalog')->info('1.7: the bundled Tabler outline catalog (5,000+ icons, MIT) in the icon picker and the `:` list; allowlisted icons keep their sprite.')->defaultFalse()->end()
                    ->booleanNode('toolbar_icons')->info('1.7: decorative icons before the labels of the action bar buttons.')->defaultTrue()->end()
                    ->booleanNode('menu_icons')->info('1.7: decorative icons before the labels of the context menu, block menu and `/` menu items.')->defaultTrue()->end()
                    ->integerNode('upload_max_size')->info('Largest upload in bytes (0: no client-side limit).')->min(0)->defaultValue(10485760)->end()
                    ->enumNode('mention_display')->info('Mention chips show the @handle (default) or the person\'s name (1.2.1; names from the `@` suggestions and `user_title_url`).')->values(['handle', 'name'])->defaultValue('handle')->end()
                    ->arrayNode('upload_accept')
                        ->info('Accepted upload types: MIME types, `type/*` or `.ext` (empty: any). 1.8: with upload_accept_images / upload_accept_files set, the types accepted as images when upload_accept_images is empty.')
                        ->scalarPrototype()->cannotBeEmpty()->end()
                        ->defaultValue([])
                    ->end()
                    ->arrayNode('upload_accept_images')
                        ->info('1.8: types uploaded and inserted as images (empty: upload_accept). The upload answer\'s `kind` decides the node; this list filters files before any request.')
                        ->scalarPrototype()->cannotBeEmpty()->end()
                        ->defaultValue([])
                    ->end()
                    ->arrayNode('upload_accept_files')
                        ->info('1.8: other types accepted as attachments (file cards with the file_cards feature, links otherwise); empty: none besides upload_accept.')
                        ->scalarPrototype()->cannotBeEmpty()->end()
                        ->defaultValue([])
                    ->end()
                    ->arrayNode('action_bar_insert')
                        ->info('1.8: buttons of the action bar above the editor: file (Insert file), icon (Insert icon); [] hides both (the `/` menu, the context menu Insert group and drop / paste stay).')
                        ->scalarPrototype()->end()
                        ->defaultValue(self::ACTION_BAR_INSERT)
                        ->validate()
                            ->ifTrue(static fn (array $v): bool => array_filter($v, static fn (mixed $b): bool => !in_array($b, self::ACTION_BAR_INSERT, true)) !== [])
                            ->thenInvalid('action_bar_insert accepts file and icon only (%s).')
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $node;
    }

    private function markdownNode(): ArrayNodeDefinition
    {
        $node = (new TreeBuilder('markdown'))->getRootNode();
        $node
            ->info('The PHP renderer of the dialect (`milkdown_markdown` Twig filter, MilkdownMarkdownRenderer service).')
            ->addDefaultsIfNotSet()
            ->children()
                ->enumNode('html_input')->info('Raw HTML in Markdown: escaped (default) or stripped.')->values(['escape', 'strip'])->defaultValue('escape')->end()
                ->booleanNode('allow_unsafe_links')->info('Keep javascript:, vbscript:, file: and data: links (never recommended).')->defaultFalse()->end()
                ->booleanNode('allow_remote_images')->info('Render images from other hosts; when false they become plain links.')->defaultFalse()->end()
                ->booleanNode('math')->info('Parse $inline$ and $$block$$ math (rendered client-side with KaTeX).')->defaultTrue()->end()
                ->enumNode('mention_display')->info('Rendered mentions show the @handle (default) or the resolved name, the handle kept in data-handle and title (1.2.1).')->values(['handle', 'name'])->defaultValue('handle')->end()
                ->booleanNode('heading_ids')->info('Give headings ids (`nowo-h-<slug>`, the same slugs as the editor feature `heading_ids`) for links, the TOC and comment hints (1.6).')->defaultFalse()->end()
                ->booleanNode('footnotes')->info('Render GFM footnotes ([^1] references and [^1]: definitions), as the editor writes them.')->defaultTrue()->end()
                ->integerNode('max_footnote_refs')->info('More footnote references in one document render as literal [^label] text (each one expands to two links).')->min(1)->defaultValue(FootnoteGuard::DEFAULT_MAX_FOOTNOTE_REFS)->end()
                ->integerNode('max_nesting_level')->min(1)->max(1000)->defaultValue(50)->end()
                ->integerNode('max_input_length')
                    ->info('Longer input (bytes) is rendered as escaped plain text; also the default max length of MilkdownEditorType.')
                    ->min(1)->defaultValue(MilkdownMarkdownRenderer::DEFAULT_MAX_INPUT_LENGTH)
                ->end()
                ->integerNode('max_inline_markers')
                    ->info('Input with more inline delimiter characters ([ ] * _ ` ! < & @ : $ ~ | \\) and line feeds is rendered as escaped plain text.')
                    ->min(1)->defaultValue(MilkdownMarkdownRenderer::DEFAULT_MAX_INLINE_MARKERS)
                ->end()
                ->integerNode('max_references')
                    ->info('Distinct page ids and mention handles sent to each resolver per document; later ones render as not visible / plain text.')
                    ->min(1)->defaultValue(DocumentProcessor::DEFAULT_MAX_REFERENCES)
                ->end()
                ->scalarNode('icon_sprite_url')->info('Sprite URL for :tabler-NAME: icons in rendered HTML.')->defaultNull()->end()
                ->append($this->iconsNode('Icon names the renderer turns into SVG (others stay text).'))
                ->booleanNode('icon_catalog')->info('1.7: also render any icon of the bundled Tabler outline catalog (sprite shards under /bundles/nowomilkdowneditor/icons/).')->defaultFalse()->end()
                ->arrayNode('host_schemes')
                    ->info('1.9 (ME-5): host references the renderer and the editor resolve, e.g. app-file: {image: "/files/{id}/preview", file: "/files/{id}", preview: "/files/{id}/embed"}. Templates are paths starting with "/" or http(s) URLs with {id}; only these schemes are resolved, anything else stays inert. A host HostFileResolverInterface / FilePreviewResolverInterface may check the viewer and replace the templates.')
                    // Scheme names keep their "-" (Symfony would turn it into "_").
                    ->normalizeKeys(false)
                    ->useAttributeAsKey('scheme')
                    ->arrayPrototype()
                        ->children()
                            ->scalarNode('image')->defaultNull()->end()
                            ->scalarNode('file')->defaultNull()->end()
                            ->scalarNode('preview')->defaultNull()->end()
                        ->end()
                    ->end()
                    ->defaultValue([])
                    ->validate()
                        ->ifTrue(static fn (array $v): bool => self::invalidHostSchemes($v) !== null)
                        ->then(static function (array $v): never {
                            throw new InvalidConfigurationException((string) self::invalidHostSchemes($v));
                        })
                    ->end()
                ->end()
                ->arrayNode('host_image_origins')
                    ->info('1.9: origins (https://cdn.example.com) host images may load from while allow_remote_images is off. Any other remote URL from a template or a resolver renders as a link. Author images never use this list.')
                    ->scalarPrototype()->end()
                    ->defaultValue([])
                    ->validate()
                        ->ifTrue(static fn (array $v): bool => array_filter($v, static fn (mixed $o): bool => !is_string($o) || preg_match('~^https?://[a-z0-9.-]+(?::\d{1,5})?$~i', $o) !== 1) !== [])
                        ->thenInvalid('host_image_origins accepts http(s) origins without a path (%s).')
                    ->end()
                ->end()
                ->booleanNode('image_block')->info('1.9: a paragraph holding only an image renders as a figure: caption from the title, {width=… align=…} block (classes and the width attribute, no style). Enable with the editor feature image_block.')->defaultFalse()->end()
                ->arrayNode('file_preview_sandbox')
                    ->info('1.9 (ME-6): tokens added to the sandbox attribute of file preview frames (empty: the strictest sandbox). allow-scripts is never accepted with allow-same-origin or allow-popups-to-escape-sandbox.')
                    ->scalarPrototype()->end()
                    ->defaultValue([])
                    ->validate()
                        ->ifTrue(static fn (array $v): bool => array_filter($v, static fn (mixed $t): bool => !in_array($t, FileCard::SANDBOX_TOKENS, true)) !== [] || (in_array('allow-scripts', $v, true) && (in_array('allow-same-origin', $v, true) || in_array('allow-popups-to-escape-sandbox', $v, true))))
                        ->thenInvalid('file_preview_sandbox accepts ' . implode(', ', FileCard::SANDBOX_TOKENS) . ', never allow-scripts with allow-same-origin or allow-popups-to-escape-sandbox (%s).')
                    ->end()
                ->end()
                ->arrayNode('mark_colors')
                    ->info('Colour names accepted by :mark[text]{bg=… text=…} (legacy color= is bg) and coloured blocks ::: {bg=… text=…}; the first is the default highlight.')
                    ->scalarPrototype()->end()
                    ->defaultValue(['yellow', 'green', 'blue', 'red', 'purple', 'gray', 'brown', 'orange', 'pink'])
                    ->validate()
                        ->ifTrue(static fn (array $v): bool => array_filter($v, static fn (mixed $c): bool => !is_string($c) || preg_match(self::ICON_PATTERN, $c) !== 1) !== [])
                        ->thenInvalid('Mark colours must be lower-case tokens (%s).')
                    ->end()
                ->end()
            ->end();

        return $node;
    }

    /**
     * The error of a `host_schemes` value, or null when it is valid: scheme names (not the browser's own) and templates
     * (a path starting with one "/" or an http(s) URL, with {id} after the first "/" of the path, at most 500 characters).
     *
     * @param array<mixed> $schemes
     */
    public static function invalidHostSchemes(array $schemes): ?string
    {
        foreach ($schemes as $scheme => $templates) {
            $scheme = (string) $scheme;
            if (preg_match(HostSchemes::SCHEME_PATTERN, $scheme) !== 1 || in_array($scheme, HostSchemes::RESERVED, true)) {
                return sprintf('Invalid host scheme "%s": lower-case letters, digits, "+", "." and "-", not a browser scheme.', $scheme);
            }
            foreach (is_array($templates) ? $templates : [] as $kind => $template) {
                if ($template === null) {
                    continue;
                }
                if (!is_string($template) || strlen($template) > 500 || preg_match('~^(?:/(?![/\\\\])|https?://[^/?#{}\\\\]+/).*\{id\}~is', $template) !== 1) {
                    return sprintf('Invalid %s template of the host scheme "%s": a path starting with "/" or an http(s) URL, with {id} after the first "/" of the path.', (string) $kind, $scheme);
                }
            }
        }

        return null;
    }

    private function iconsNode(string $info): ArrayNodeDefinition
    {
        $node = (new TreeBuilder('icons'))->getRootNode();
        $node
            ->info($info)
            ->scalarPrototype()->end()
            ->defaultValue([])
            ->validate()
                ->ifTrue(static fn (mixed $v): bool => !is_array($v) || array_filter($v, static fn (mixed $n): bool => !is_string($n) || preg_match(self::ICON_PATTERN, $n) !== 1) !== [])
                ->thenInvalid('Icon names must be lower-case words joined by hyphens (%s).')
            ->end();

        return $node;
    }
}
