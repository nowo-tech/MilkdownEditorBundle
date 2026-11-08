import { afterEach, describe, expect, it } from 'vitest';
import { hostUrl, isHostUrlPattern, literalPrefix, matchHostUrl, normalizeAuthority, removeDotSegments, targetUrl, urlCandidate, withUrlPatterns } from '../src/host';
import { fileCard } from '../src/dialect/file-card';
import { imageSource } from '../src/nodes/image';
import { pageHostConfig } from '../src/options';
import { editor } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';

const UUID = '0f8fad5b-d9cb-469f-a165-70867728950e';
const FILES = '^/files/(?<id>[0-9a-f-]{36})/(?:original|preview)$';
const schemes = { 'app-file': { image: '/f/{id}/view', file: '/f/{id}', preview: '/f/{id}/embed' } };

describe('host URL patterns (1.13)', () => {
  it('accepts only the subset PCRE and RegExp read alike (the PHP configuration rules)', () => {
    expect(isHostUrlPattern(FILES)).toBe(true);
    expect(isHostUrlPattern('^https://cdn\\.example\\.com/(?<id>\\w+)\\$$')).toBe(true);
    for (const bad of [
      null,
      42,
      '/files/(?<id>[a-z]+)$', // not anchored at the start
      '^/files/(?<id>[a-z]+)', // not anchored at the end
      '^/files/(?<id>[a-z]+)\\$', // an escaped dollar is no anchor
      '^/files/([a-z]+)$', // no id group
      '^/(?<id>a)/(?<id>b)$', // two
      '^/(?=x)(?<id>a)$', // lookahead
      '^/(?i)(?<id>a)$', // inline flag
      '^/(?<other>x)(?<id>a)$', // another named group
      '^/\\p{L}(?<id>a)$', // escape outside the subset
      '^/(?<id>a)\\', // dangling escape
      '^/#(?<id>a)$', // "#"
      '^/é(?<id>a)$', // not ASCII
      `^/${'a'.repeat(300)}(?<id>a)$`, // too long
      '^/(?<id>[a)$', // not a regular expression
      '^/a$|^(?<id>.*)$', // top-level alternation (audit IJ-I1)
      '^/f/(?<id>\\w+)(*ACCEPT)/x$', // verb
      '^/f/(?<id>[[:alnum:]]+)$', // POSIX class
      '^/f/(?<id>[]a]+)$', // `[]` is an empty class in RegExp
      '^/f/(?<id>[^]a]+)$',
    ]) {
      expect(isHostUrlPattern(bad), String(bad)).toBe(false);
    }
  });

  it('keeps only valid patterns of known schemes; without any, the same object', () => {
    expect(withUrlPatterns(schemes, undefined)).toBe(schemes);
    expect(withUrlPatterns(schemes, [null, { pattern: FILES, scheme: 'other' }, { pattern: '^x$', scheme: 'app-file' }])).toBe(schemes);
    const withPatterns = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'APP-FILE' }]);
    expect(withPatterns).not.toBe(schemes);
    expect(withPatterns).toEqual(schemes);
    expect(matchHostUrl(`/files/${UUID}/original`, withPatterns)).toEqual({ reference: `app-file:${UUID}`, url: 'written' });
  });

  it('matches whole, trimmed URLs up to the length bound; an invalid id is a reference no one sees', () => {
    const s = withUrlPatterns(schemes, [{ pattern: '^/files/(?<id>[^/]+)/original$', scheme: 'app-file', url: 'resolved' }]);
    expect(matchHostUrl(` /files/${UUID}/original `, s)).toEqual({ reference: `app-file:${UUID}`, url: 'resolved' });
    expect(matchHostUrl('/files/.hidden/original', s)).toEqual({ reference: null, url: 'resolved' });
    expect(matchHostUrl(`/x/files/${UUID}/original`, s)).toBeNull();
    expect(matchHostUrl(`/files/${'a'.repeat(2048)}/original`, s)).toEqual({ reference: null, url: 'resolved' });
    expect(matchHostUrl('', s)).toBeNull();
    expect(matchHostUrl(42, s)).toBeNull();
    expect(matchHostUrl(`/files/${UUID}/original`, schemes)).toBeNull();
    expect(hostUrl('/files/.hidden/original', 'file', s)).toBeNull();
    // A group that did not take part: no id.
    const optional = withUrlPatterns(schemes, [{ pattern: '^/x(?:/(?<id>\\w+))?$', scheme: 'app-file' }]);
    expect(matchHostUrl('/x', optional)).toEqual({ reference: null, url: 'written' });
    expect(matchHostUrl('/x/abc', optional)).toEqual({ reference: 'app-file:abc', url: 'written' });
  });

  it('written: the author URL as before; resolved: the scheme templates', () => {
    const written = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file' }]);
    const resolved = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file', url: 'resolved' }]);
    const url = `/files/${UUID}/preview`;
    expect(hostUrl(url, 'image', written)).toBeUndefined();
    expect(targetUrl(url, 'file', written)).toBe(url);
    expect(imageSource(url, written)).toBe(url);
    expect(hostUrl(url, 'image', resolved)).toBe(`/f/${UUID}/view`);
    expect(targetUrl(url, 'file', resolved)).toBe(`/f/${UUID}`);
    expect(imageSource(url, resolved)).toBe(`/f/${UUID}/view`);
    // Scheme values are unchanged by patterns.
    expect(targetUrl('app-file:abc', 'file', resolved)).toBe('/f/abc');
  });

  it('file cards: a preview only for resolved patterns', () => {
    const href = `/files/${UUID}/original`;
    const written = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file' }]);
    const resolved = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file', url: 'resolved' }]);
    expect(fileCard('a.pdf', { href, view: 'preview' }, { hostSchemes: written, previewSandbox: '' }).querySelector('iframe')).toBeNull();
    const card = fileCard('a.pdf', { href, view: 'preview' }, { hostSchemes: resolved, previewSandbox: '' });
    expect(card.querySelector('a')?.getAttribute('href')).toBe(`/f/${UUID}`);
    // The frame loads near the viewport only (audit GX-L1); the open link is the resolved file.
    expect(card.querySelector('iframe')).not.toBeNull();
    expect(card.querySelector('.nowo-milkdown-file__open')?.getAttribute('href')).toBe(`/f/${UUID}`);
  });

  it('alternation inside a group is fine', () => {
    expect(isHostUrlPattern('^/f/(?<id>[^|/]+)/(?:a|b|[|])$')).toBe(true);
  });

  it('fails closed on long URLs that start like a pattern (audit IJ-L1)', () => {
    const s = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file' }]);
    expect(matchHostUrl(`/files/${UUID}/${'x'.repeat(2100)}`, s)).toEqual({ reference: null, url: 'written' });
    expect(matchHostUrl(`/elsewhere/${'x'.repeat(2100)}`, s)).toBeNull();
    expect(literalPrefix(FILES)).toBe('/files/');
    expect(literalPrefix('^https://cdn\\.example/f(?<id>\\w+)$')).toBe('https://cdn.example/f');
    expect(literalPrefix('^/files?/(?<id>\\w+)$')).toBe('/file');
    expect(literalPrefix('^/a+b(?<id>\\w+)$')).toBe('/a');
  });

  it('normalises query, fragment, encoding, case and own absolute URLs (audit IJ-I3)', () => {
    const s = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file' }], ['Beacon.Example', 3]);
    const ref = { reference: `app-file:${UUID}`, url: 'written' };
    for (const url of [
      `/files/${UUID}/original?download=1`,
      `/files/${UUID}/original#p`,
      `/files/%30${UUID.slice(1)}/original`,
      `/files/${UUID.toUpperCase()}/preview`,
      `https://beacon.example/files/${UUID}/original`,
      `//beacon.example/files/${UUID}/original`,
      `${location.protocol}//${location.host}/files/${UUID}/original`,
    ]) {
      expect(matchHostUrl(url, s), url).toEqual(ref);
    }
    expect(matchHostUrl(`https://evil.example/files/${UUID}/original`, s)).toBeNull();
    expect(urlCandidate('https://beacon.example', ['beacon.example'])).toBe('/');
    expect(urlCandidate('/files/%E0%A4%A/x')).toBe('/files/%E0%A4%A/x');
  });

  it('reads encoded hosts, zero-padded ports and a trailing slash as the own URL (audit IK-I7, IK-I8)', () => {
    const s = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file' }], ['beacon.example', 'port.example:8080']);
    const ref = { reference: `app-file:${UUID}`, url: 'written' };
    const file = `/files/${UUID}/original`;
    for (const url of [
      `https://beacon%2Eexample${file}`,
      `https://BEACON%2eEXAMPLE${file}`,
      `https://%62eacon.example${file}`,
      `https://beacon.example:0443${file}`,
      `http://beacon.example:080${file}`,
      `//beacon.example:00443${file}`,
      `https://port.example:08080${file}`,
      `https://beacon.example%3A443${file}`,
      `https://evil%40beacon.example${file}`,
      `https://evil.example%2Fx${file}`,
      `${file}/`,
      `${file}/.`,
      `https://beacon.example${file}/?download=1`,
    ]) {
      expect(matchHostUrl(url, s), url).toEqual(ref);
    }
    for (const url of [
      `https://beacon.example:0${file}`,
      `https://beacon.example:000${file}`,
      `https://beacon.example:08443${file}`,
      `https://other%2Eexample${file}`,
      `https://beacon.example%E2%80%8B${file}`,
      `${file}//x/`,
      '/',
    ]) {
      expect(matchHostUrl(url, s), url).toBeNull();
    }
    expect(normalizeAuthority('beacon%2eexample:0443', 'https')).toBe('beacon.example');
    expect(normalizeAuthority('beacon.example:00')).toBe('beacon.example:0');
    const slash = withUrlPatterns(schemes, [{ pattern: '^/dir/(?<id>\\w+)/$', scheme: 'app-file' }]);
    expect(matchHostUrl('/dir/abc/', slash)).toEqual({ reference: 'app-file:abc', url: 'written' });
  });

  it('reads forms a browser normalises as the own URL (audit IJ-I10)', () => {
    const s = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file' }], ['beacon.example', 'alt.example:443', 'port.example:8080']);
    const ref = { reference: `app-file:${UUID}`, url: 'written' };
    const file = `/files/${UUID}/original`;
    for (const url of [
      `https://beacon.example:443${file}`,
      `http://beacon.example:80${file}`,
      `//beacon.example:443${file}`,
      `//beacon.example:80${file}`,
      `https://beacon.example.${file}`,
      `https://beacon.example.:443${file}`,
      `https://u@beacon.example${file}`,
      `https://user:pass@evil.example@beacon.example${file}`,
      `https://alt.example${file}`,
      `https://port.example:8080${file}`,
      `${location.protocol}//${location.hostname}.${location.port ? ':' + location.port : ''}${file}`,
      `/./files/${UUID}/original`,
      `/x/../files/${UUID}/original`,
      `/files/x/../${UUID}/./original`,
      `/%2e/files/${UUID}/%2E%2E/${UUID}/original`,
      `//beacon.example//files//${UUID}//original`,
      `/files//${UUID}/original`,
      `https://beacon.example/../files/${UUID}/original`,
    ]) {
      expect(matchHostUrl(url, s), url).toEqual(ref);
    }
    for (const url of [
      `https://beacon.example:8443${file}`,
      `http://beacon.example:443${file}`,
      `https://beacon.example@evil.example${file}`,
      `https://port.example${file}`,
      `//:443${file}`,
      `//a:b:c${file}`,
      `https://evil.example/../files/${UUID}/original`,
    ]) {
      expect(matchHostUrl(url, s), url).toBeNull();
    }
    expect(removeDotSegments('/..')).toBe('/');
    expect(removeDotSegments('/a/..')).toBe('/');
    expect(removeDotSegments('/a/b/.')).toBe('/a/b/');
    expect(removeDotSegments('/a/b/../c')).toBe('/a/c');
    expect(normalizeAuthority('u@[::1]:443')).toBe('[::1]');
    expect(normalizeAuthority('[::1]:8443', 'https')).toBe('[::1]:8443');
    expect(normalizeAuthority('a:b:c')).toBe('a:b:c');
  });

  describe('editor', () => {
    let handle: MilkdownEditorHandle | null = null;
    afterEach(async () => {
      await handle?.destroy();
      handle = null;
      document.head.querySelectorAll('script[data-nowo-milkdown-config]').forEach((el) => el.remove());
    });

    it('reads the patterns from the page block only', () => {
      const el = document.createElement('script');
      el.type = 'application/json';
      el.setAttribute('data-nowo-milkdown-config', '');
      el.textContent = JSON.stringify({ hostSchemes: schemes, hostUrlPatterns: [{ pattern: FILES, scheme: 'app-file' }] });
      document.head.append(el);
      expect(pageHostConfig().hostUrlPatterns).toEqual([{ pattern: FILES, scheme: 'app-file' }]);
      el.textContent = JSON.stringify({ hostSchemes: schemes, hostUrlPatterns: [{ pattern: FILES, scheme: 'app-file' }], hostUrlHosts: ['beacon.example'] });
      expect(pageHostConfig().hostUrlHosts).toEqual(['beacon.example']);
      el.textContent = JSON.stringify({ hostSchemes: schemes, hostUrlPatterns: 'x', hostUrlHosts: 'x' });
      expect(pageHostConfig().hostUrlPatterns).toEqual([]);
      expect(pageHostConfig().hostUrlHosts).toEqual([]);
    });

    it('a resolved pattern image shows the template URL and keeps the written Markdown', async () => {
      const md = `![plan](/files/${UUID}/preview)`;
      handle = await editor(md, { hostUrlPatterns: [{ pattern: FILES, scheme: 'app-file', url: 'resolved' }] }, { hostSchemes: schemes, hostUrlPatterns: [{ pattern: FILES, scheme: 'app-file', url: 'resolved' }] });
      expect(handle.root.querySelector('.nowo-milkdown-image img')?.getAttribute('src')).toBe(`/f/${UUID}/view`);
      expect(handle.getMarkdown()).toContain(md);
    });

    it('patterns in the widget JSON are ignored (audit GX-L2)', async () => {
      handle = await editor(`![plan](/files/${UUID}/preview)`, { hostSchemes: schemes, hostUrlPatterns: [{ pattern: FILES, scheme: 'app-file', url: 'resolved' }] });
      expect(handle.root.querySelector('.nowo-milkdown-image')).toBeNull();
      expect(handle.root.querySelector('img[src]')?.getAttribute('src')).toBe(`/files/${UUID}/preview`);
    });
  });
});
