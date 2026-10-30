<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle;

use InvalidArgumentException;

use function sprintf;

/**
 * Named editor profiles from `nowo_milkdown_editor.profiles` (REQ-CFG-001).
 *
 * @phpstan-type Profile array{features: list<string>, theme: string, min_height: string, icon_sprite_url: ?string, icons: list<string>, upload_max_size: int, upload_accept: list<string>}
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class ProfileRegistry
{
    /**
     * @param array<string, Profile> $profiles Profiles by name
     * @param string $defaultProfile Name of the profile used when none is given
     */
    public function __construct(
        private array $profiles,
        private string $defaultProfile,
    ) {
    }

    /**
     * Returns the profile `$name` (null: the default profile).
     *
     * @throws InvalidArgumentException When the profile does not exist
     *
     * @return Profile
     */
    public function get(?string $name = null): array
    {
        $name ??= $this->defaultProfile;
        if (!isset($this->profiles[$name])) {
            throw new InvalidArgumentException(sprintf('Unknown Milkdown editor profile "%s". Available profiles: %s.', $name, implode(', ', $this->names())));
        }

        return $this->profiles[$name];
    }

    /**
     * Whether a profile named `$name` exists.
     */
    public function has(string $name): bool
    {
        return isset($this->profiles[$name]);
    }

    /**
     * Profile names, in configuration order.
     *
     * @return list<string>
     */
    public function names(): array
    {
        return array_keys($this->profiles);
    }

    /**
     * Name of the default profile.
     */
    public function defaultName(): string
    {
        return $this->defaultProfile;
    }
}
