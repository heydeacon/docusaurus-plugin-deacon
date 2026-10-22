import type { Plugin } from '@docusaurus/types';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isScalar(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function isContext(value: unknown): value is Record<string, string | number | boolean> {
  return isRecord(value) && Object.values(value).every(isScalar);
}

/** The options from the site's config file, which may be plain JavaScript, checked. */
function parseOptions(options: unknown): DeaconPluginOptions {
  const given = isRecord(options) ? options : {};
  const key = typeof given.key === 'string' ? given.key.trim() : '';

  if (key === '') {
    throw new Error(
      '@heydeacon/docusaurus-plugin: the "key" option is missing. In Deacon, open Install ' +
        '(the button at the top of the dashboard) and copy the data-key value from the ' +
        'snippet. It starts with pk_.',
    );
  }

  const { context, pageViews } = given;

  if (pageViews !== undefined && typeof pageViews !== 'boolean') {
    throw new Error('@heydeacon/docusaurus-plugin: the "pageViews" option must be true or false.');
  }

  if (context !== undefined && !isContext(context)) {
    throw new Error(
      '@heydeacon/docusaurus-plugin: the "context" option must be an object whose values are ' +
        'strings, numbers or booleans.',
    );
  }

  return {
    key,
    ...(context === undefined ? {} : { context }),
    ...(pageViews === undefined ? {} : { pageViews }),
  };
}

/**
 * The plugin Docusaurus loads from the site's config. It reads nothing from Docusaurus's
 * load context, only its own options.
 */
export default function deaconPlugin(_loadContext: unknown, options: unknown): DeaconPlugin {
  const { key, context, pageViews } = parseOptions(options);

  const attributes = {
    src: LOADER_SRC,
    'data-key': key,
    ...(context === undefined ? {} : { 'data-context': JSON.stringify(context) }),
    ...(pageViews === false ? { 'data-no-page-views': true } : {}),
    async: true,
  } satisfies ScriptTag['attributes'];

  return {
    name: '@heydeacon/docusaurus-plugin',
    injectHtmlTags() {
      return { postBodyTags: [{ tagName: 'script' as const, attributes }] };
    },
  } satisfies Plugin;
}
