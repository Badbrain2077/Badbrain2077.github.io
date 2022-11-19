
`mkdocs.yml`

```
site_name: 🔥 Badbrain Personal Wiki 🔥

site_url: https://Badbrain2077.github.io

site_author: Badbrain

site_description: >-

  我的个人 Wiki 积累知识副本, 对抗遗忘🤔

  

repo_name: Badbrain2077/MkDocs-Wiki

repo_url: https://github.com/Badbrain2077/Badbrain2077.github.io

edit_uri: ""

  

theme:

  # logo: assets/edge.png

  favicon: assets/circle.svg

  icon:

    logo: logo

    repo: fontawesome/brands/github

  custom_dir: overrides

  

  name: material

  language: zh

  palette:

    - scheme: default

      primary: indigo

      accent: indigo

      toggle:

        icon: material/toggle-switch-off-outline

        name: Switch to dark mode

    - scheme: slate

      primary: black

      accent: black

      toggle:

        icon: material/toggle-switch

        name: Switch to light mode

  font:

    text: Roboto

    code: Roboto Mono

  include_search_page: false

  search_index_only: true

  features:

    - navigation.tabs

    - navigation.top

    # - toc.integrate

    - content.tabs.link

    # - navigation.instant

    - navigation.sections

    - navigation.tracking

    - search.highlight

    - search.share

    - search.suggest

    ##############

    - content.code.annotate

    # - content.tabs.link

    # - header.autohide

    # - navigation.expand

    - navigation.indexes

    # - navigation.instant

    - navigation.sections

    - navigation.tabs

    # - navigation.tabs.sticky

    - navigation.top

    - navigation.tracking

    - search.highlight

    - search.share

    - search.suggest

    - toc.follow

    # - toc.integrate

markdown_extensions:

  - admonition

  - abbr

  - attr_list

  - def_list

  - footnotes

  - meta

  - md_in_html

  - toc:

      permalink: true

  - pymdownx.arithmatex:

      generic: true

  - pymdownx.betterem:

      smart_enable: all

  - pymdownx.caret

  - pymdownx.critic

  - pymdownx.details

  - pymdownx.emoji:

      emoji_index: !!python/name:materialx.emoji.twemoji

      emoji_generator: !!python/name:materialx.emoji.to_svg

      options:

        custom_icons:

          - overrides/.icons

  - pymdownx.highlight

  - pymdownx.inlinehilite

  - pymdownx.keys

  - pymdownx.magiclink:

      repo_url_shorthand: true

      user: squidfunk

      repo: mkdocs-material

  - pymdownx.mark

  - pymdownx.smartsymbols

  - pymdownx.superfences:

      custom_fences:

        - name: mermaid

          class: mermaid

          format: !!python/name:pymdownx.superfences.fence_code_format

  - pymdownx.tabbed

  - pymdownx.tasklist:

      custom_checkbox: true

  - pymdownx.tilde

  

extra_javascript:

  - 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML'

  

extra_css:

  - stylesheets/extra.css

  

extra:

  # generator: true

  search:

    language: 'zh'

  analytics:

    provider: google

    property: !!python/object/apply:os.getenv ["GOOGLE_ANALYTICS_KEY"]

  social:

  ############ fontawesome: https://fontawesome.com/

    - icon: fontawesome/brands/github

      link: https://github.com/Badbrain2077

    - icon: fontawesome/brands/zhihu

      link: https://www.zhihu.com/people/yang-zheng-jun-59-78

    - icon: fontawesome/brands/weibo

      link: https://weibo.com/6616315268/profile?rightmod=1&wvr=6&mod=personinfo

    - icon: fontawesome/brands/twitter

      link: https://twitter.com/Badbrai67695095?s=09

    - icon: fontawesome/brands/pinterest

      link: https://www.pinterest.com/Badbrain2077/

    - icon: fontawesome/brands/bilibili

      link: https://space.bilibili.com/13450026

    - icon: fontawesome/brands/youtube

      link: https://m.youtube.com/channel/UCqpRnj0AeHXkl3PdSMxCP3g

    - icon: fontawesome/solid/at

      link: mailto:<1522975492@qq.com>

  

copyright: Copyright &copy; 2020-2022 Badbrain

  

plugins:

  - search:

      lang:

        - en

        - ja
```