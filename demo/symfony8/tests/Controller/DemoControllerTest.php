<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use PHPUnit\Framework\Attributes\Test;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class DemoControllerTest extends WebTestCase
{
    #[Test]
    public function theEditorPageRendersWithAStrictPolicy(): void
    {
        $client = self::createClient();
        $crawler = $client->request('GET', '/');
        self::assertResponseIsSuccessful();
        self::assertCount(2, $crawler->filter('[data-nowo-milkdown-options]'));
        $csp = (string) $client->getResponse()->headers->get('Content-Security-Policy');
        self::assertStringContainsString("script-src 'self' 'nonce-", $csp);
        self::assertStringNotContainsString("'unsafe-inline' ", str_replace("style-src-attr 'unsafe-inline'", '', $csp));
    }

    #[Test]
    public function theEndpointsAnswerJson(): void
    {
        $client = self::createClient();
        $client->request('GET', '/api/pages?q=inst');
        self::assertSame('Installation guide', json_decode((string) $client->getResponse()->getContent(), true)[0]['label']);
        $client->request('GET', '/api/pages/titles?ids=0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10,c0ffee00-1234-4abc-8def-001122334455');
        self::assertCount(1, json_decode((string) $client->getResponse()->getContent(), true));
        $client->request('GET', '/api/users?q=gr');
        self::assertSame('grace', json_decode((string) $client->getResponse()->getContent(), true)[0]['id']);
        $client->request('POST', '/api/upload');
        self::assertResponseStatusCodeSame(403);
    }
}
