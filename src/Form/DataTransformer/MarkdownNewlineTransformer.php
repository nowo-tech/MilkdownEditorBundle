<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;

use function is_string;

/**
 * Normalises the submitted Markdown: `\r\n` and `\r` become `\n` (the editor and the renderer use LF only).
 *
 * @implements DataTransformerInterface<string|null, string>
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class MarkdownNewlineTransformer implements DataTransformerInterface
{
    /**
     * Model → view: the stored Markdown, as is (null becomes an empty string).
     *
     * @param mixed $value The model value
     */
    public function transform(mixed $value): string
    {
        return is_string($value) ? $value : '';
    }

    /**
     * View → model: the submitted Markdown with LF line endings.
     *
     * @param mixed $value The submitted value
     */
    public function reverseTransform(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        return str_replace(["\r\n", "\r"], "\n", $value);
    }
}
