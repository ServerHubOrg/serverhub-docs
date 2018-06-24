# 路由

Route 是 ServerHub 的核心之一。有了路由，所有的 HTTP 请求都可以被过滤并发往正确的处理程式（比如控制器和缓存命中器）。举个例子， `/index.html` 可能是一个静态页面，但 `/home/index` 却可能是一个控制器的 URL。ServerHub 的路由系统提供了两种手段来处理这些 URL 的分辨问题。一个叫做正路由，而另一个叫反路由。

## 正路由规则

正路由看起来就像是 ES6 当中的字符串模板语法，你可以看到成对的花括号。每一对括号之间是路由规则的一个段。而合法的段有如下几种： **controller, action** 和 **id**。举个例子： "`api/{controller}/{action}/{id}`"。

而前缀 `api` 则是一个普通的文本。每个请求要想匹配上述规则，就一定要加上这样一个前缀。

`controller` 是控制器的名称，恰恰就是控制器文件的名字。

`action` 是控制器脚本中定义的函数成员（属性）。

下面举一些例子（假设你已经在项目写好了一个带有 index/info 方法的控制器 home）：

```
能被匹配的请求：
  /api/home/index
  /api/home/info/
  /api/home/index/5
  /api/home/index/5?name=xu_wangzhe
  /api/home/index/?name=xu_wangzhe

不能被匹配的请求：
  /home/index
  /api/home/index.html
  /api/home/5
  /api/index/5?name=xu_wangzhe
  /api/home-foo/index/?name=xu_wangzhe
```

如果请求的路径不能匹配这一路由规则，那么 ServerHub 会将其当作是对静态资源的请求，会触发 Cache 系统来加载、缓存。

如何指定正路由呢？请看下例：

```js
route => {
  route.MapRoute("default", "v1/{controller}/{action}/{id}");
};
```

将这个匿名函数传入 `instance.Run()` 方法的第二参数即可。

## 反路由规则

**反路由规则永远会在正路由被检查之前先被执行！**如果任何请求匹配了反路由，则永远不会再进行正匹配，也就是会立即被作为静态资源请求被处理。

反路由规则 **同时** 支持字符串定义和正则表达式定义。你只需提供一个包含反路由的数组就可以了。

下面给出几个例子：

### 字符串规则的例子

```js
route.IgnoreRoute(["/language/all"]);
```

如你所见， `language` 控制器可能会有 `english` 和 `chinese` 方法，但是却没有定义 `all` 方法。如果 ServerHub 试图根据某一次匹配而触发这个函数，则会产生异常。所以我们需要用这个来屏蔽掉这不科学的 URL 请求（改为指向静态资源）。

有一点需要注意的是，这一类规则必须要用“/”作为开头，否则请使用正则表达式。

### 正则表达式案例

假如你想要完全屏蔽所有以“no-route”开头的请求怎么办？难道要把所有可能都写出来吗？显然是不现实的。所以我们直接将正则表达式传入该方法，进而将所有以“no-route”为前缀（无论大小写）的请求都屏蔽。

```js
route.IgnoreRoute([/^\/no-route.*$/i]);
```

### 混合规则

```js
route.IgnoreRoute(["/language/all", /^\/no-route.*$/i]);
```

## URL 中的查询

根据 [RFC 1738](https://tools.ietf.org/html/rfc1738)，一个合法的 URL 查询是这样定义的：

```rfc
search         = *[ uchar | ";" | ":" | "@" | "&" | "=" ]
uchar          = unreserved | escape
unreserved     = alpha | digit | safe | extra
alpha          = lowalpha | hialpha
lowalpha       = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" |
                 "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" |
                 "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" |
                 "y" | "z"
hialpha        = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" |
                 "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" |
                 "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
digit          = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" |
                 "8" | "9"
safe           = "$" | "-" | "_" | "." | "+"
extra          = "!" | "*" | "'" | "(" | ")" | ","
escape         = "%" hex hex
hex            = digit | "A" | "B" | "C" | "D" | "E" | "F" |
                 "a" | "b" | "c" | "d" | "e" | "f"
```

具体一点，ServerHub 限制了：

* ? 作为查询的开始符。
* = 前面的标识符是查询的键。
* = 后面的标识符是查询的值。
* 所有的查询由 & 作为分隔符。

请一定遵循上述规则，因为后续版本的 ServerHub 很可能会强制忽略掉不符合该规则的查询串导致你的应用程序无法正常工作。
