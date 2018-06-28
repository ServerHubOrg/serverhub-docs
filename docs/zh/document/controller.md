# 控制器

Controllers 被用来处理访问服务器程序的大多数通过路由选择的请求。当某个特定的路由规则被匹配了，则 ServerHub 会调用该 controller 中的对应 action 方法来处理这个请求，并将处理结果返回给请求者（往往是浏览器）。

## 创建 controllers 文件

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

## 活跃于 compile-time 和静态的 Controller

这里说明一下，compile-time 不能理解为字面的编译过程，而应该理解为 ServerHub 对你的配置进行加载、处理和执行的过程，对应 runtime 则是当 HTTP 请求接入 ServerHub 时产生的一系列动作对应的时机。如果你在 compile-time 之后对任何 controller 文件进行了修改，到浏览器刷新看看是否你的修改被应用上了。可以发现，完全没有任何变化。ServerHub 仅仅会在 compile-time 加载和注册 controller，而当注册完毕，所有内容都会被缓存下来，当程序执行的时候，你的修改也就被忽略了。

不像是 view 和 model 等等资源，ServerHub 对它们采用的策略是动态加载，ServerHub 会跟踪文档的修改操作，一旦进行了修改，就会更新内部缓存（关于缓存，请参阅相关章节），从而保证内容最新而且访问速度足够快。

所以永远不要尝试在程序启动之后修改这些程序文件。

## Controller 作用域变量

有这么一些变量，你只能在 controller 的 action 方法执行时才能访问到这些变量。要使用它们，你需要显式使用 this 指针指向当前的 controller 实例。否则，程序将会报错。

建议你在适当的时候多使用 ECMAScript 2015 引入的 **arrow functions（箭头函数）**。或者是使用一些变通的方法，比如闭包或者是其他手段，这样你的 this 指针就不会乱掉了。

如果你在 `v1.0.2` 之前就已经用过 ServerHub，那么你很有可能会误认为新的模块加载函数是控制器作用域变量。其实不然，详细信息会在 [模块]() 相关章节提供描述。

### 当前所有可以使用的 controller 作用域变量：

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

## 关于 controller 中的 action 方法

Action 方法是当 HTTP 请求进入时由路由和 controller 共同触发的一些函数。它处理请求和响应，控制返回的内容。这一部分，我们会讨论 controller 中的 action 方法。这一部分内容对于理解 controller 有很大的帮助。

### 怎么写一个 action 方法？

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

### Action 方法命名规范

Action 方法名必须是小写的字符组成。你可以使用字母“a”到“z”以及数字和下划线。有一些名字是保留词，你不得在 action 方法名中使用这些值：Runtime、System、Console 或是 View。

命名的最佳实践是使用简短的单词，推荐你使用动词来命名。每个 action 方法的名字如果超过了 20 个字符，就显得不太妥当。并且希望你注意，今后的版本中，可能会强行限制其长度，那样子将导致为旧版本编写的应用程序无法启动。

## 关于 controller 特殊的语法

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

### 控制器的模块化写法

石超 曾告诉过我，他的 IDE 在他用“非完全 JavaScript 风格”写控制器时报错了。随着 ServerHub 的开发和完善，原来的那种创作控制器的方法显得难以拓展。所以我使用控制器作用域变量来对一些对象、函数进行引用，从而提供完整的功能支持。说实在的，一开始当所有东西都限制在控制器作用域当中的时候，这种方法其实很有效，也很优美。但是当逐渐拓展到更广的 context 中时，就显得复杂和难以拓展了。我不得不重新思考石超的提醒，于是在经过几次修改之后加入了模块化写法的控制器创作方式。

新的写法其实非常简单。你只需要把 `return` 换成 `module.exports =` 即可。

但是这还不是全部！这还不是全部！这还不是全部！千万不要忘记把文件名的后缀从“.js”改成“.shc.js”：

`home.js => home.shc.js`
`language.js => language.shc.js`

这是 必须进行的，否则 ServerHub 会直接将它作为旧风格加载，并抛出错误。

另外，有一点也是你需要注意的：如果你的控制器目录中包含一个以“.shc.js”结尾的文件，则 ServerHub 不会再加载任何旧语法的控制器。所以一定要保证工作空间干干净净。或者呢，就在指定控制器目录的同时（缺省值“controller/”），再显式指明要注册的文件吧，这样一来 ServerHub 就会帮你搞定了。

## 本章节特别感谢

[石超](https://github.com/ShiChao1996) 他提醒了我 controller 文件中的语法问题，非常感谢！
