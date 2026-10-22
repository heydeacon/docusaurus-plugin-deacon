import { describe, expect, it } from 'vitest';
import deaconPlugin from './index.js';

describe('docusaurus-plugin-deacon', () => {
  it('adds the snippet from Install before </body>', () => {
    const plugin = deaconPlugin({}, { key: 'pk_test123' });

    expect(plugin.injectHtmlTags()).toEqual({
      postBodyTags: [
        {
          tagName: 'script',
          attributes: {
            src: 'https://heydeacon.com/widget/v1/loader.js',
            'data-key': 'pk_test123',
            async: true,
          },
        },
      ],
    });
  });

  it('trims spaces pasted around the key', () => {
    const plugin = deaconPlugin({}, { key: '  pk_test123\n' });

    expect(plugin.injectHtmlTags().postBodyTags[0]?.attributes['data-key']).toBe('pk_test123');
  });

  it('passes context to Deacon as the data-context attribute', () => {
    const plugin = deaconPlugin(
      {},
      { key: 'pk_test123', context: { site: 'docs', version: '3.2', beta: true } },
    );

    expect(plugin.injectHtmlTags().postBodyTags[0]?.attributes).toEqual({
      src: 'https://heydeacon.com/widget/v1/loader.js',
      'data-key': 'pk_test123',
      'data-context': '{"site":"docs","version":"3.2","beta":true}',
      async: true,
    });
  });

  it.each([
    ['a string', 'plan=pro'],
    ['an array', ['docs']],
    ['an object with a nested value', { plan: { tier: 'pro' } }],
    ['an object with a null value', { plan: null }],
  ])('refuses a context that is %s', (_case, context) => {
    expect(() => deaconPlugin({}, { key: 'pk_test123', context })).toThrow(
      new Error(
        'docusaurus-plugin-deacon: the "context" option must be an object whose values are ' +
          'strings, numbers or booleans.',
      ),
    );
  });

  it('holds back page views with the data-no-page-views attribute', () => {
    const plugin = deaconPlugin({}, { key: 'pk_test123', pageViews: false });

    expect(plugin.injectHtmlTags().postBodyTags[0]?.attributes).toEqual({
      src: 'https://heydeacon.com/widget/v1/loader.js',
      'data-key': 'pk_test123',
      'data-no-page-views': true,
      async: true,
    });
  });

  it('refuses a pageViews that is not true or false', () => {
    expect(() => deaconPlugin({}, { key: 'pk_test123', pageViews: 'false' })).toThrow(
      new Error('docusaurus-plugin-deacon: the "pageViews" option must be true or false.'),
    );
  });

  it.each([
    ['missing', {}],
    ['empty, as from an unset environment variable', { key: '' }],
    ['blank', { key: '   ' }],
  ])('refuses a key that is %s', (_case, options) => {
    expect(() => deaconPlugin({}, options)).toThrow(
      new Error(
        'docusaurus-plugin-deacon: the "key" option is missing. In Deacon, open Install ' +
          '(the button at the top of the dashboard) and copy the data-key value from the ' +
          'snippet. It starts with pk_.',
      ),
    );
  });
});
