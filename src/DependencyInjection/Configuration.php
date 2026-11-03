<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\DependencyInjection;

use Nowo\MilkdownEditorBundle\Feature;
use Nowo\MilkdownEditorBundle\Markdown\DocumentProcessor;
use Nowo\MilkdownEditorBundle\Markdown\FootnoteGuard;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Theme;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\Definition\Exception\InvalidConfigurationException;

use function in_array;
use function is_array;
use function is_string;
use function sprintf;

/**
 * Configuration tree of `nowo_milkdown_editor` (REQ-CFG-001 / REQ-SF-006).
 *
 *     nowo_milkdown_editor:
 *         default_profile: default
 *         profiles:
 *             default: { features: [...], theme: auto, min_height: 12rem, icon_sprite_url: ~, icons: [], upload_max_size: 10485760, upload_accept: [] }
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
                    ->integerNode('upload_max_size')->info('Largest upload in bytes (0: no client-side limit).')->min(0)->defaultValue(10485760)->end()
                    ->enumNode('mention_display')->info('Mention chips show the @handle (default) or the person\'s name (1.2.1; names from the `@` suggestions and `user_title_url`).')->values(['handle', 'name'])->defaultValue('handle')->end()
                    ->arrayNode('upload_accept')
                        ->info('Accepted upload types: MIME types, `type/*` or `.ext` (empty: any).')
                        ->scalarPrototype()->cannotBeEmpty()->end()
                        ->defaultValue([])
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
