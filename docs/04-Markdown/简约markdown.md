[TOC]

# Markdown😀

[![Markdown](https://markdown.com.cn/hero.png)](https://markdown.com.cn/)

```c
#include <stdio.h>

int main()
{
   printf("Hello, Markdown! \n");
   
   return 0;
}
```

---

# Markdown是什么?

1. 专注于文字内容；
2. 纯文本，易读易写，可以方便地纳入版本控制；
3. 语法简单，没有什么学习成本，能轻松在码字的同时做出美观大方的排版。

> **专注内容**,~~而非排版~~
>
> *[markdown语法教程](https://markdown.com.cn/)*
>
> [我的bilibili](https://space.bilibili.com/13450026) [^1]

---

# 为什么要使用 Markdown？

- Markdown 无处不在。StackOverflow、CSDN、掘金、简书、GitBook、有道云笔记、V2EX、光谷社区等。主流的代码托管平台，如 GitHub、GitLab、BitBucket、Coding、Gitee 等等，都支持 Markdown 语法，很多开源项目的 README、开发文档、帮助文档、Wiki 等都用 Markdown 写作。
- Markdown 是纯文本可移植的。几乎可以使用任何应用程序打开包含 Markdown 格式的文本文件。如果你不喜欢当前使用的 Markdown 应用程序了，则可以将 Markdown 文件导入另一个 Markdown 应用程序中。这与 Microsoft Word 等文字处理应用程序形成了鲜明的对比，Microsoft Word 将你的内容锁定在专有文件格式中。
- Markdown 是独立于平台的。你可以在运行任何操作系统的任何设备上创建 Markdown 格式的文本。
- Markdown 能适应未来的变化。即使你正在使用的应用程序将来会在某个时候不能使用了，你仍然可以使用文本编辑器读取 Markdown 格式的文本。当涉及需要无限期保存的书籍、大学论文和其他里程碑式的文件时，这是一个重要的考虑因素。

---

# 行内语法

|元素|Markdown文本语法|
|---|---|
|标题（Heading）|` # H1 `<br>`## H2`<br>`### H3`|
|**粗体（Bold）**|`**bold text**`|
|*斜体（Italic）*|`*italicized text*`|
|~~删除线（Strikethrough）~~|`~~The world is flat.~~`|
|分隔线（Horizontal Rule）|`---`,`***`|
|代码|`` `code` ``|
|引用块（Blockquote）|`> blockquote`|
|链接（Link）|`[title](https://www.example.com)`|
|图片（Image）|`![alt text](image.jpg)`|
|脚注（Footnote）|Here's a sentence with a footnote.`[^1]`<br>`[^1]`: This is the footnote.|
|定义列表（Definition List）|`term`<br>`: definition`|
|标题编号（Heading ID）|`### My Great Heading {#custom-id}`|

---

# 块语法

|元素|Markdown块语法|
|---|---|
|有序列表（Ordered List）|`1. First item`<br>`2. Second item`<br>`3. Third item`|
|无序列表（Unordered List）|`- First item`<br>`- Second item`<br>`- Third item`|
|任务列表（Task List）|`- [x] Write the press release`<br>`- [ ] Update the website`<br>`- [ ] Contact the media`|
|表格（Table）|`| Syntax | Description |`<br>`| --------- | --------- |`<br>`| Header      | Title       |`<br>`| Paragraph   | Text        |`|
|代码块（Fenced Code Block）|`` ​​​​​​``` ``<br>`{`<br>`"firstName": "John",`<br>`"lastName": "Smith",`<br>`"age": 25`<br>`}`<br>`` ``` ``<br>|

---

# 其他

## 任务列表（Task List）

- [x] Write the press release

- [x] Update the website

- [ ] Contact the media

> 所有语法差不多都有用上😀

## emoji

🤡🐵

## 公式

$$
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
$$

----

[^1]:Badbrain的bilibili空间
