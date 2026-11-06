<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use PHPUnit\Framework\Attributes\Test;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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

    #[Test]
    public function theLayersPageHasThreeEditorsWithoutActionBarButtons(): void
    {
        $client  = self::createClient();
        $crawler = $client->request('GET', '/layers');
        self::assertResponseIsSuccessful();
        $roots = $crawler->filter('[data-nowo-milkdown-options]');
        self::assertCount(3, $roots);
        foreach ($roots as $root) {
            $options = json_decode((string) $root->getAttribute('data-nowo-milkdown-options'), true);
            self::assertSame([], $options['actionBarInsert']);
            self::assertContains('file_cards', $options['features']);
        }
        self::assertCount(1, $crawler->filter('dialog.demo-dialog [data-nowo-milkdown-options]'));
    }

    /**
     * 1.8 upload contract: `{url, name, size, type, kind}`, the kind from the sniffed bytes (never the client's type).
     */
    #[Test]
    public function theUploadEndpointDecidesTheKindFromTheBytes(): void
    {
        $client  = self::createClient();
        $crawler = $client->request('GET', '/');
        $options = json_decode((string) $crawler->filter('[data-nowo-milkdown-options]')->first()->attr('data-nowo-milkdown-options'), true);
        $token   = $options['upload']['csrfToken'];
        $post    = static function (string $bytes, string $name, string $clientType) use ($client, $token): array {
            $path = tempnam(sys_get_temp_dir(), 'up');
            file_put_contents($path, $bytes);
            $client->request('POST', '/api/upload', [], ['file' => new UploadedFile($path, $name, $clientType, null, true)], ['HTTP_X_CSRF_TOKEN' => $token]);

            return [$client->getResponse()->getStatusCode(), json_decode((string) $client->getResponse()->getContent(), true)];
        };
        $png = (string) base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', true);
        [$status, $image] = $post($png, 'pixel.png', 'application/pdf');
        self::assertSame(200, $status, (string) $client->getResponse()->getContent());
        self::assertSame('image', $image['kind']);
        self::assertSame('image/png', $image['type']);
        self::assertSame('pixel.png', $image['name']);
        self::assertMatchesRegularExpression('#^/uploads/[0-9a-f]{16}\.png$#', $image['url']);
        [$status, $pdf] = $post("%PDF-1.4\n%%EOF\n", 'Q3.pdf', 'image/png');
        self::assertSame(200, $status);
        self::assertSame('file', $pdf['kind']);
        self::assertStringEndsWith('.pdf', $pdf['url']);
        [$status] = $post('<!doctype html><html><script>alert(1)</script></html>', 'page.txt', 'text/plain');
        self::assertSame(415, $status);

        // Served with the headers of SECURITY.md › Uploads (audit GR-L1): images inline, documents as attachments.
        $client->request('GET', $image['url']);
        self::assertResponseIsSuccessful();
        $headers = $client->getResponse()->headers;
        self::assertSame('nosniff', $headers->get('X-Content-Type-Options'));
        self::assertSame('sandbox', $headers->get('Content-Security-Policy'));
        self::assertSame('image/png', $headers->get('Content-Type'));
        self::assertStringStartsWith('inline', (string) $headers->get('Content-Disposition'));
        $client->request('GET', $pdf['url']);
        $headers = $client->getResponse()->headers;
        self::assertStringStartsWith('attachment', (string) $headers->get('Content-Disposition'));
        self::assertSame('application/pdf', $headers->get('Content-Type'));
        self::assertSame('sandbox', $headers->get('Content-Security-Policy'));
        $client->request('GET', '/uploads/0000000000000000.png');
        self::assertResponseStatusCodeSame(404);
        $client->request('GET', '/uploads/..%2F..%2Fcomposer.json');
        self::assertResponseStatusCodeSame(404);
    }
}
