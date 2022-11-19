# Docusaurus博客配置文件

	已弃用

一部分有修改的地方🤔

## docusaurus.config.js

```js
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Badbrain🧠',
  tagline: '星星应该哈哈大笑，反正宇宙是个偏僻的地方.',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',
  favicon: 'img/favicon.ico',
  organizationName: 'Badbrain', // Usually your GitHub org/user name.
  projectName: 'Badbrain', // Usually your repo name.
  // titleDelimiter: '🧠', // Defaults to `|`
  themeConfig: {
    navbar: {
      title: 'Badbrain',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
        type: 'doc',
        docId: 'intro',
        position: 'right',
        label: '文档',
        },
        { to: '/blog', label: '博客', position: 'right' },
        {
            // href: 'https://space.bilibili.com/13450026',
            label: '绘画',
            position: 'right',
        },
        {
            href: 'https://space.bilibili.com/13450026',
            label: 'Bilibili',
            position: 'right',
        },
        {
            href: 'https://github.com/Badbrain2077',
            label: 'GitHub',
            position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.png',
      },
      links: [
        {
          title: '文档',
          items: [{
              label: '教程',
              to: '/docs/intro',
          }, ],
        },
        {
          title: '社区',
          items: [{
                  label: 'Stack Overflow',
                  href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                  label: 'Discord',
                  href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                  label: 'Twitter',
                  href: 'https://twitter.com/docusaurus',
              },
          ],
        },
        {
          title: '更多',
          items: [{
                  label: '博客',
                  to: '/blog',
              },
              {
                  label: 'GitHub',
                  href: 'https://github.com/Badbrain2077',
              },
              {
                  label: 'Bilibili',
                  href: 'https://space.bilibili.com/13450026',
              },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Badbrain-blog, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    // ... Your other plugins.
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
        // When applying `zh` in language, please install `nodejieba` in your project.
      },
    ],
  ],
};

```

## index.js

```js
<Link
  className="button button--secondary button--lg"
  to="/docs/intro"
>
  从这里开始!😀
</Link>
```

## custom.css

```css
:root {
    --ifm-color-primary: #1992f5;
    --ifm-color-primary-dark: #0a85e9;
    --ifm-color-primary-darker: #0a7ddc;
    --ifm-color-primary-darkest: #0867b5;
    --ifm-color-primary-light: #339ef6;
    --ifm-color-primary-lighter: #40a4f7;
    --ifm-color-primary-lightest: #67b7f8;
    --ifm-code-font-size: 95%;
}

blockquote {
  padding: 15px;
  border-radius: 8px;
  border-color: #339ef6;
}

img {
  border-radius: 5px;
}

hr {
  border-color: #ececec;
  border-radius: 8px;
  border-style: solid;
}
```

## HomepageFeatures.js

```js
const FeatureList = [
  {
    title: '太阳',
    Svg: require('../../static/img/sun.svg').default,
    description: (
      <>
        太阳是太阳系的中心天体，占有太阳系总体质量的99.86%。
        太阳系中的八大行星、小行星、流星、彗星、外海王星天体以及星际尘埃等，
        都围绕着太阳公转，而太阳则围绕着银河系的中心公转。
      </>
    ),
  },
  {
    title: '地球',
    Svg: require('../../static/img/earth.svg').default,
    description: (
      <>
        据估计，地球上只有八分之一的地方适合人类居住。
        其中有四分之三覆盖着海水，四分之一则是陆地。
        沙漠14%、高山27%以及其他不适合人类居住的地形占陆地总面积的二分之一。
        可是人类还在无止境的内斗。
      </>
    ),
  },
  {
    title: '火星',
    Svg: require('../../static/img/mars.svg').default,
    description: (
      <>
        2014年，由中国科学家参与的一个科研团队得出一个最新发现，
        让“火星迷”们振奋了一把。这个刊发在国际学术期刊《陨石学与行星科学》上的科研结果称，
        “从一块火星陨石样本中发现了火星曾经存在生命的证据”。
      </>
    ),
  },
];
```

> 把img换了
