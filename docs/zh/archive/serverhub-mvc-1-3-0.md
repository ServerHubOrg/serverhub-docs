---
sidebar: auto
collapsable: true
---
# ServerHub-MVC 1.3.0 文档

## 控制器

Controllers 被用来处理访问服务器程序的大多数通过路由选择的请求。当某个特定的路由规则被匹配了，则 ServerHub 会调用该 controller 中的对应 action 方法来处理这个请求，并将处理结果返回给请求者（往往是浏览器）。

### 创建 controllers 文件

每个 controller 和 JavaScript 文件形成一一对应的关系。请看这个 `home.js` 自定义 controller 的例子（过时的写法，不再推荐；请阅读最后的控制器语法说明）：

```js
"use strict";

return {
  index: function(req, res, method) {
    return this.View();
  },
  primary: function(req, res, method) {
    var context = this.View();
    context.name = "Ziyuan";
    return context;
  }
};
```

下面是 **推荐** 的写法 `v1.0.3+`:

```js
module.exports = {
  index: function(req, res, method) {
    return this.View();
  },
  primary: function(req, res, method) {
    var context = this.View();
    context.name = "Ziyuan";
    return context;
  }
};
```

Controller 文件就是平常却又特殊的 JavaScript 文件。你必须在文件内直接返回一个带有 `action functions` 方法定义的对象。只有这样，当 ServerHub 要派发路由后的请求时，你的自定义 controller 才会被调用到。

也许你会感到奇怪，为什么 ServerHub 的 controller 是这样的语法：将 return 语句写在了函数体的外面（或者根本没有函数体）。尤其是当你使用 lint 工具时它们还会报错。不要担心，暂时不要纠结，这个问题我们在后面就会讲到。

在 controller 方法定义中，有三个参数是 `必须` 的，它们是：request、response 和 method

* request 是对 Node.js IncomingMessage 对象的引用，也就是 HTTPRequest。
* response 则是对 ServerResponse（非完整）对象的引用，即 HTTPResponse。
* method 则是一个表示当前 HTTPMethod 的参数，其值通常是：GET、POST、PATCH、UPDATE、DELETE 和 PUT。

下面两个参数不是必须的，但是也非常有用：

* id 是由匹配到的路由中提取出的 id 值。
* search 是从 URL 解析出的查询内容，是一个 JavaScript Map 对象。

### 活跃于 compile-time 和静态的 Controller

这里说明一下，compile-time 不能理解为字面的编译过程，而应该理解为 ServerHub 对你的配置进行加载、处理和执行的过程，对应 runtime 则是当 HTTP 请求接入 ServerHub 时产生的一系列动作对应的时机。如果你在 compile-time 之后对任何 controller 文件进行了修改，到浏览器刷新看看是否你的修改被应用上了。可以发现，完全没有任何变化。ServerHub 仅仅会在 compile-time 加载和注册 controller，而当注册完毕，所有内容都会被缓存下来，当程序执行的时候，你的修改也就被忽略了。

不像是 view 和 model 等等资源，ServerHub 对它们采用的策略是动态加载，ServerHub 会跟踪文档的修改操作，一旦进行了修改，就会更新内部缓存（关于缓存，请参阅相关章节），从而保证内容最新而且访问速度足够快。

所以永远不要尝试在程序启动之后修改这些程序文件。

### Controller 作用域变量

有这么一些变量，你只能在 controller 的 action 方法执行时才能访问到这些变量。要使用它们，你需要显式使用 this 指针指向当前的 controller 实例。否则，程序将会报错。

建议你在适当的时候多使用 ECMAScript 2015 引入的 **arrow functions（箭头函数）**。或者是使用一些变通的方法，比如闭包或者是其他手段，这样你的 this 指针就不会乱掉了。

如果你在 `v1.0.2` 之前就已经用过 ServerHub，那么你很有可能会误认为新的模块加载函数是控制器作用域变量。其实不然，详细信息会在 [模块]() 相关章节提供描述。

#### 当前所有可以使用的 controller 作用域变量：

在以后的章节中会详细介绍这些变量的使用方法（ 控制器作用域变量），不过一些返回基本值（比如 `string`、 `number` 等等的就不会被包括在内了（还有一些为 Node.js 原生对象的别名也不会赘述）。

* `View()` **_Function_** 返回由 model/ 目录下文件定义的 model 对象。
* `Runtime` **_Object_** 提供许多运行时对象和属性
  1.  `Runtime.DBProvider` **_Object_** 对 database provider 对象的引用（默认使用 MySQL，但可以在配置文件中修改）。
  2.  `Runtime.FileHelper` **_Object_** 对 FileHelper 对象的引用，它提供了一些访问文件系统的便捷方法，区别于 Node.js 的 fs 和 path 模块。
  3.  `Runtime.WAIT` **_boolean_** 控制 ServerHub 等待异步操作完成。
* `System` **_Object_** 提供对 ServerHub 内部一些常量的访问性
  1.  `System.Version` **_string_** ServerHub 版本号
  2.  `System.NodeVersion` **_string_** Node.js 版本号
  3.  `System.Platform` **_string_** 操作系统的平台信息（如 win32, linux 等等）
  4.  `System.Hardware` **_Object_** 操作系统的硬件相关信息
      * `System.Hardware.TotalMemory` **_number_** 已安装内存（单位 byte）
      * `System.Hardware.FreeMemory` **_number_** 空闲内存（单位 byte）
      * `System.Hardware.NetworkInterfaces` **_Object_** 返回本机所有已经注册了 IP 地址的网络接口信息
  5.  `System.Die(exit_code)` **_Function_** 强行终结 ServerHub 实例

### 关于 controller 中的 action 方法

Action 方法是当 HTTP 请求进入时由路由和 controller 共同触发的一些函数。它处理请求和响应，控制返回的内容。这一部分，我们会讨论 controller 中的 action 方法。这一部分内容对于理解 controller 有很大的帮助。

#### 怎么写一个 action 方法？

```js
index: function (request, response, method){
    // do something
    return this.View();
}
```

这就是一个非常简单的叫做 index 的 action 方法。你只需要将它定义为 controller 返回的对象的某一个方法即可。而要注意的就是在其中使用 controller 作用域变量时，一定要记住加上“this”引用。

Action 方法的三个参数都是必须的，如果你想要手动控制返回的 HTTP 响应内容，可以用 `res.write()` 一类的方法来进行，ServerHub 就会忽略掉 model 中的内容以及相关的渲染引擎，然后根据你的要求来操作。

```js
index: function (request, response, method){
    response.write('Hello, XWZ');
    return this.View();
}
```

这段代码会返回“Hello, XWZ”这段字符（通常显示在浏览器界面里），而后面的返回语句是不会生效的。

注意 `request` 参数是原生的 Node.js `IncomingMessage` 对象（在 ServerHub 0.0.7 版本中仍然是）。但 `response` 参数则是一个假的 `ServerResponse` 对象。ServerHub 在其中打包了不少来自原生对象的方法和属性，这样你在使用时就不会感到太困惑。不过具体的调用方法还请阅读相关章节。 `Method` 是表示 HTTP 请求类型的字符串。

#### Action 方法命名规范

Action 方法名必须是小写的字符组成。你可以使用字母“a”到“z”以及数字和下划线。有一些名字是保留词，你不得在 action 方法名中使用这些值：Runtime、System、Console 或是 View。

命名的最佳实践是使用简短的单词，推荐你使用动词来命名。每个 action 方法的名字如果超过了 20 个字符，就显得不太妥当。并且希望你注意，今后的版本中，可能会强行限制其长度，那样子将导致为旧版本编写的应用程序无法启动。

### 关于 controller 特殊的语法

::: warning 警告
自 `v1.0.3` 之后就不再推荐此写法了，并且在将来的某个版本中，将会全面禁止使用此语法。
:::

~~前面我们说过，如果你用了 lint 工具，那么 ServerHub 的 controller 文件将会引起一些语法错误。可能它会提示“ 在函数外使用了 return 语句”。不过其实你所写的是正确的、合法的 部分 JavaScript 文件。~~

~~Controllers 脚本其实都是 函数，它们并不是完全独立的 JavaScript 函数。当你尝试直接运行 controller 文件时，是不会有效果的。~~

~~下面举例说明：（ home.js）：~~

```js
"use strict";

return {
  index: function(req, res, method) {
    return this.View();
  }
};
```

~~如果你把这个 home.js 当作平常的 JavaScript 文件，那么就还需在 return 语句之外加上一个函数的花括号，像这样：~~

```js
"use strict";

function (){
    return {
        index: function(req, res, method) {
            return this.View();
        }
    }
}
```

~~好了，现在它成了标准的 JavaScript 文件了。~~

~~但是，不知道你还记不记得 controllers 全部都是 函数 ？这意味着什么？你的 controller 整个就是一个函数，它的隐形边界（文件）就是函数的花括号。所以，如果我们强行加上了花括号，原来的 controller 文件就成了这个样子：~~

```js
function (){
    "use strict";

    function (){
        return {
            index: function(req, res, method) {
                return this.View();
            }
        };
    }
}
```

~~可见，这里产生了一个多余的函数包围，留它何用？直接去掉就好了。这也就是我们称 ServerHub 的 controller 是“部分 JavaScript 文件”的原因了。~~

不过请不要担心，ServerHub 将会持续支持旧的方式，直到 `v2.0.0` 版本（最早）。你将有充分的时间来迁移到新的模块加载语法。

#### 控制器的模块化写法

石超 曾告诉过我，他的 IDE 在他用“非完全 JavaScript 风格”写控制器时报错了。随着 ServerHub 的开发和完善，原来的那种创作控制器的方法显得难以拓展。所以我使用控制器作用域变量来对一些对象、函数进行引用，从而提供完整的功能支持。说实在的，一开始当所有东西都限制在控制器作用域当中的时候，这种方法其实很有效，也很优美。但是当逐渐拓展到更广的 context 中时，就显得复杂和难以拓展了。我不得不重新思考石超的提醒，于是在经过几次修改之后加入了模块化写法的控制器创作方式。

新的写法其实非常简单。你只需要把 `return` 换成 `module.exports =` 即可。

但是这还不是全部！这还不是全部！这还不是全部！千万不要忘记把文件名的后缀从“.js”改成“.shc.js”：

`home.js => home.shc.js`
`language.js => language.shc.js`

这是 必须进行的，否则 ServerHub 会直接将它作为旧风格加载，并抛出错误。

另外，有一点也是你需要注意的：如果你的控制器目录中包含一个以“.shc.js”结尾的文件，则 ServerHub 不会再加载任何旧语法的控制器。所以一定要保证工作空间干干净净。或者呢，就在指定控制器目录的同时（缺省值“controller/”），再显式指明要注册的文件吧，这样一来 ServerHub 就会帮你搞定了。

### 本章节特别感谢

[石超](https://github.com/ShiChao1996) 他提醒了我 controller 文件中的语法问题，非常感谢！

---

## 插件系统

::: tip 提示  
自 v1.0.0-beta 起可用
:::

由于 ServerHub 自身是一个 Web 服务器的基础，而如果你一切从头开始，那么就需要应付一大堆非常基本的问题。又因为 ServerHub 会自动将请求派发到相对应的处理机制（比如控制器或缓存命中器），所以你难以对每一个请求的处理函数进行单独操作。这样不仅开发难度高，维护和重构的成本也随程序体量而增加。试想，能否在路由开始之前就进行一些操作呢？比如说权限验证或是请求过滤。抑或在路由完成之后做一些事，比如触发一个统计函数来分析对资源的使用情况……

这里，我们将“插件”概念介绍给你。本文所述甚是简单，但是不要错过了打造你的专属插件的好机会！

### Plugin 钩子

首先来看一幅顺序图：（你可以右键单独浏览图片，这样清晰度会更高）

![plugin](/assets/serverhub-module-plugin-sequence.png)

我们称其为钩子，但是它看起来更像是一个必须的过程。不过，由于之前版本并未引入这一概念，插件更像是从原来的流程当中强行中断的一部分，所以也就以钩子来称呼了。当某个 HTTP 请求到达 ServerHub 的时候，它会被 ServerHub 的 core 模块处理。此时第一阶段插件被激活，待它们处理完毕，core 又会把请求交给 route 模块。Route 完毕得到的结果会被用来激活第二阶段的插件，等到它们也处理完了，这些请求会被 core 根据 route 结果派发给对应的处理程式。

两个阶段的插件分别是 **路由前置插件** 和 **路由后置插件**。

前置插件通常并不关心这个请求会被路由到哪里。它们往往做一些比较全局性的工作，比如全局权限验证。而后置插件往往更关注于请求目标的类型，并针对类型的不同采取不同的措施。

### 怎样创建一个插件？

插件其实就是完全的 Node.js 模块。它遵循模块的所有准则。但是有些额外的限制：

* 合法的插件必须包括一些属性：

  * `app_name` 为你的插件取一个独一无二的名字。所有的字母必须小写，并且数字、字母、单独的连词符才是合法的选择。比如 serverhub-plugin-my-filter （注意前缀应该是 **serverhub-plugin-**）。
  * `version` 插件的版本号。建议按照 NPM 的规范来处理。
  * `version_support` 标记当前插件版本支持的最低 ServerHub 版本号，低于此版本则无法注册成功。
  * `phase` 指明这是一个前置插件还是后置插件。
  * `main` 插件的入口调用函数。对于前置插件，此函数有两个必须参数；后置插件则为三个（第三个是路由的结果）。

* 下面举一个例子

```js
module.exports = {
  app_name: "serverhub-plugin-my-plugin",
  version: "0.1.0",
  version_support: "1.0.0-alpha",
  phase: "before-route",
  main: function(req, res) {
    console.log("Hello, this is my first ServerHub plugin!");
  }
};
```

### 重要提示

创建插件时，下面的内容一定要牢记于心
::: warning 注意
**永远不要在插件中试图修改传入 `main` 函数的参数中的 ServerResponse 对象！**
:::

---
## 路由

Route 是 ServerHub 的核心之一。有了路由，所有的 HTTP 请求都可以被过滤并发往正确的处理程式（比如控制器和缓存命中器）。举个例子， `/index.html` 可能是一个静态页面，但 `/home/index` 却可能是一个控制器的 URL。ServerHub 的路由系统提供了两种手段来处理这些 URL 的分辨问题。一个叫做正路由，而另一个叫反路由。

### 正路由规则

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

### 反路由规则

**反路由规则永远会在正路由被检查之前先被执行！**如果任何请求匹配了反路由，则永远不会再进行正匹配，也就是会立即被作为静态资源请求被处理。

反路由规则 **同时** 支持字符串定义和正则表达式定义。你只需提供一个包含反路由的数组就可以了。

下面给出几个例子：

#### 字符串规则的例子

```js
route.IgnoreRoute(["/language/all"]);
```

如你所见， `language` 控制器可能会有 `english` 和 `chinese` 方法，但是却没有定义 `all` 方法。如果 ServerHub 试图根据某一次匹配而触发这个函数，则会产生异常。所以我们需要用这个来屏蔽掉这不科学的 URL 请求（改为指向静态资源）。

有一点需要注意的是，这一类规则必须要用“/”作为开头，否则请使用正则表达式。

#### 正则表达式案例

假如你想要完全屏蔽所有以“no-route”开头的请求怎么办？难道要把所有可能都写出来吗？显然是不现实的。所以我们直接将正则表达式传入该方法，进而将所有以“no-route”为前缀（无论大小写）的请求都屏蔽。

```js
route.IgnoreRoute([/^\/no-route.*$/i]);
```

#### 混合规则

```js
route.IgnoreRoute(["/language/all", /^\/no-route.*$/i]);
```

### URL 中的查询

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

---

## Instance.Run() 方法

### ServerHub.Run()

[本节请查看这里](/zh/tutorial/getting-started.html#使用)

### Instance.Run() 参数配置

前些天，我们了解了 `instance.Run()` 方法。本章我们会继续探讨该方法的第一个配置参数： `instance.Run()` 的配置对象。

#### 越简单越好

与之前我们在 [Instance.Run()](/zh/tutorial/getting-started.html#使用) 一章中看到的不同，那个配置对象太复杂了。事实上，只有一个参数是必要的，那就是： `BaseDir`.

BaseDir 是 服务器的根目录，它会被 ServerHub 应用程序引用于其生命周期的各个阶段。如果你的入口文件，比如 app.js，刚好位于你的服务器根目录，则只需将 `__dirname` 传过去即可。

这就是能够让你的 ServerHub 应用正常工作的最基本配置了。

#### 其他的配置参数

自定义 ServerHub 时需要一些额外的配置。

##### `WebDir`

`WebDir` 就是你网站的根目录。你的页面文件、资源文件、脚本文件和素材都应该被放在这里面。ServerHub 默认使用“www/”作为其值。如果你要设置一个另外的网站根目录，请先创建一个目录，并将其名字传给 `WebDir` 属性。

##### `ControllerDir`

我们都知道，ServerHub 会把 HTTP 请求分发到 controller 上，如果要注册 controller，就应当指定 controller 所在的目录。所使用的 controller 目录应该是一个相对于服务器根目录的相对路径，ServerHub 中默认用“controller/”。

##### `Controllers`

有些情况下，我们不希望 controller 目录下的所有文件都被注册进去（比如你放置了非控制器的文件）。那么此时，可以将所需的文件名通过数组传给此属性。比如： `['home.js', 'data.js']`。但如果你想把所有的文件都一并注册了，很简单，不要加入此属性即可。ServerHub 会自动扫描并注册 `ControllerDir` 中所有文件。

##### `ViewDir` 和 `ModelDir`

与 `ControllerDir` 类似，它们用于存放视图和模型。

##### `DBProvider`

通过此属性执行你所需的数据库支持包。当前版本你只可以使用 MySQL，也就是把“mysql”赋值给 DBProvider。

##### `DBConnectionString`

如果你只有一个数据库实例要使用，那么我建议你将一个全局数据库连接字符串传入 ServerHub。因为如果你不这样，你就必须要在每次调用 `GetConnection()` 方法时传入数据库连接字符串。

##### `MaxCacheSize`

此属性与 ServerHub 的缓存分配机制有关。如果文件大小超过了此配额，那么 ServerHub 就会通过 WCS 机制来主动卸载一些缓存，这个机制会在后面的章节详谈。

##### `DefaultPages`

ServerHub 在处理默认页时引入了一个优先匹配和回滚策略。你的默认页必须放在 WebDir 目录。默认情况下，ServerHub 会首先寻找“index.html”，然后再找“default.html”，如果还是没有，就去寻找“page.html”。当然，你可以用一个形如 `['hello.html', 'first.html']` 的数组来强制覆盖此回滚策略。

##### `PageNotFound` `v0.0.93+`

一旦收到的请求不能找到对应的资源，或是没有相应的路由规则可以匹配，则 ServerHub 会渲染出 404 NOT Found 的页面返回。而从 v0.0.93 开始，你可以自己来指定这个错误页了。

##### `AsyncOperationTimeout` `v0.0.97+`

自从 `v0.0.96` 引入 `this.Runtime.WAIT` 信号量之后，我们已经可以在控制器中实现一些耗时的异步操作逻辑，比如数据库查询操作。但是你应该知道，这个信号量其实是非常危险的，因为如果你忘记将其置为 `false` 或是因为操作太耗时而在中间过程中断开连接，则可能会出现严重的问题（得不到相应，甚至服务器程序崩溃）。所以 ServerHub 内置了倒数计时，如果操作时间超过这个阈值，则会停止等待，立即返回响应（可能是空响应）。在返回响应的同时，还会在服务器端的控制台输出错误信息（此输出特性可能在将来的版本中移除或迁移到日志中）。默认阈值为 10 秒钟，你可以通过将此变量传入来缩短或延长该值。（单位为 **毫秒**）

感谢阅读本章节，更多属性会在以后的更新中补充。

##### `TLSOption` `v1.0.6+`

自 `v1.0.6` 开始，ServerHub 大大增强了连接安全性。你可以通过此属性来配置 TLS 证书。此属性由 4 个子属性构成： `Key: string、 Cert: string、 CA: string` 和 `Port: Array<string>|Array<number>|number|string`。你需要把私钥与证书载入并赋值给上述属性，然后把需要 TLS 连接的端口号指定给 Port 属性。

这里有一则[教程](/zh/tutorial/tls-tutorial.html)帮助你使用 TLS。
