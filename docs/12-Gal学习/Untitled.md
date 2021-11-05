以我个人经历来看，0基础一个月学C#和unity完全足够开发一款Galgame了。

C#本身非常容易入门。Galgame这种游戏类型几乎不需要考虑性能，仅仅用UI就能实现你需要的全部功能。

一张图片做背景，文本用自带的UI Text就可以了，然后找个你喜欢的字体替换上去。

需要交互的地方加个Button，然后写个MonoBehaviour处理逻辑。

如果需要做进度条，加一个Slider。

如果需要滚动文本或图片，加个Scroll view。

如果要做动画或者战斗效果，装一个dotween插件，几行代码就可以将一张图片按照指定轨迹移动，比如transform.DoMove()。当然也可以自己写，GitHub上有一些开源的数学库。

如果要实现一些花里胡哨的效果，比如图片闪光动画，随机渐融等等，需要写shader，现在有了URP，用ShaderGraph跟连连看差不多，这个属于进阶内容。

UI里面的Image、Text、Button已经完全可以支撑起任何内容的Gal Game

作者：梧桐
链接：https://www.zhihu.com/question/60747794/answer/1947743984
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

