<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit;

use InvalidArgumentException;
use Nowo\MilkdownEditorBundle\Csp\RequestAttributeCspNonceProvider;
use Nowo\MilkdownEditorBundle\ProfileRegistry;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

final class ProfileAndCspTest extends TestCase
{
    #[Test]
    public function registryResolvesProfiles(): void
    {
        $p        = ['features' => [], 'theme' => 'auto', 'min_height' => '1px', 'icon_sprite_url' => null, 'icons' => [], 'upload_max_size' => 0, 'upload_accept' => []];
        $registry = new ProfileRegistry(['a' => $p, 'b' => ['theme' => 'dark'] + $p], 'a');
        self::assertSame('auto', $registry->get()['theme']);
        self::assertSame('dark', $registry->get('b')['theme']);
        self::assertSame(['a', 'b'], $registry->names());
        self::assertSame('a', $registry->defaultName());
        self::assertTrue($registry->has('b'));
        $this->expectException(InvalidArgumentException::class);
        $registry->get('c');
    }

    #[Test]
    public function nonceComesFromTheMainRequest(): void
    {
        self::assertNull((new RequestAttributeCspNonceProvider())->getNonce());
        self::assertNull((new RequestAttributeCspNonceProvider(new RequestStack()))->getNonce());
        $request = new Request();
        $stack   = new RequestStack([$request]);
        self::assertNull((new RequestAttributeCspNonceProvider($stack))->getNonce());
        $request->attributes->set('csp_nonce', '');
        self::assertNull((new RequestAttributeCspNonceProvider($stack))->getNonce());
        $request->attributes->set('csp_nonce', 'n');
        self::assertSame('n', (new RequestAttributeCspNonceProvider($stack))->getNonce());
    }
}
