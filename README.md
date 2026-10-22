# docusaurus-plugin-deacon

Adds the [Deacon](https://heydeacon.com) chat widget to every page of a Docusaurus site.

Deacon is an AI support agent for websites and apps. It answers questions from your own docs and content, and says when it doesn't know instead of guessing.

You need a Deacon account. The free plan needs no card.

## Install

```sh
npm install docusaurus-plugin-deacon
```

## Set it up

Add the plugin to `docusaurus.config.js` (or `docusaurus.config.ts`) with your key:

```js
export default {
  // ...the rest of your config
  plugins: [['docusaurus-plugin-deacon', { key: 'pk_your_widget_key' }]],
};
```

To find your key, open Install from the button at the top of the Deacon dashboard. The snippet there has it in `data-key`, and it starts with `pk_`. If the key is missing, the build stops and says so.

Deacon only runs on the sites listed on Install. A listed domain covers its subdomains, so `example.com` covers `docs.example.com`. If your docs live somewhere else, such as `example.github.io`, add that address on Install too.

When you run `npm start`, Install notices the widget on `localhost:3000` and lets you add it in one click. Chats on localhost don't count towards your plan.

## Options

| Option      | Type    | Default  | What it does |
| ----------- | ------- | -------- | ------------ |
| `key`       | string  | required | Your Deacon key. |
| `context`   | object  | none     | Details Deacon takes into account when it answers, the same on every page, such as `{ product: 'api', docsVersion: '3.2' }`. Up to 12 keys, each value a string, number or boolean. Anyone can read them in the page's HTML, so never put a secret here. |
| `pageViews` | boolean | `true`   | The same script counts visits for Deacon's website analytics. Set this to `false` to send no page views or JavaScript errors from your docs. Chat still works. |

```js
plugins: [
  [
    'docusaurus-plugin-deacon',
    {
      key: 'pk_your_widget_key',
      context: { product: 'api', docsVersion: '3.2' },
      pageViews: false,
    },
  ],
],
```

## Opening the chat from your own button

The widget comes with its own button. To use one of yours instead, hide Deacon's in Appearance in the dashboard and call `window.Deacon.open()` from your button or link. `Deacon.close()` and `Deacon.toggle()` work too.

## What it adds

The plugin puts the same tag Install gives you before `</body>` on every page:

```html
<script src="https://heydeacon.com/widget/v1/loader.js" data-key="pk_your_widget_key" async></script>
```

It loads in the background without holding up the page. Works with Docusaurus 3.

## License

MIT
