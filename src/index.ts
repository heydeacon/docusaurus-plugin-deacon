export interface DeaconPluginOptions {
  /** Your Deacon key: the `data-key` value in the snippet on Install. */
  key: string;
  /**
   * Details about the reader that Deacon takes into account when it answers, the same for
   * every page. Up to 12 keys, each value a string, number or boolean. Every value is
   * readable in the page, so never put a secret here.
   */
  context?: Record<string, string | number | boolean>;
  /**
   * Set to false to send Deacon no page views or JavaScript errors from these pages. Chat
   * and goals still work.
   * @default true
   */
  pageViews?: boolean;
}

export interface ScriptTag {
  tagName: 'script';
  attributes: Record<string, string | boolean>;
}

export interface DeaconPlugin {
  name: string;
  injectHtmlTags(): { postBodyTags: ScriptTag[] };
}

const LOADER_SRC = 'https://heydeacon.com/widget/v1/loader.js';

/**
 * Docusaurus calls this with the options from the site's config file, which may be plain
 * JavaScript, so nothing about them is taken on trust.
 */
export default function deaconPlugin(
  _context: unknown,
  options: Partial<DeaconPluginOptions> = {},
): DeaconPlugin {
  const { key } = options;

  if (typeof key !== 'string' || key.trim() === '') {
    throw new Error(
      'docusaurus-plugin-deacon: the "key" option is missing. In Deacon, open Install ' +
        '(the button at the top of the dashboard) and copy the data-key value from the ' +
        'snippet. It starts with pk_.',
    );
  }

  const attributes: Record<string, string | boolean> = {
    src: LOADER_SRC,
    'data-key': key,
  };

  if (options.context !== undefined) {
    attributes['data-context'] = JSON.stringify(options.context);
  }

  if (options.pageViews === false) {
    attributes['data-no-page-views'] = true;
  }

  attributes.async = true;

  return {
    name: 'docusaurus-plugin-deacon',
    injectHtmlTags() {
      return { postBodyTags: [{ tagName: 'script', attributes }] };
    },
  };
}
