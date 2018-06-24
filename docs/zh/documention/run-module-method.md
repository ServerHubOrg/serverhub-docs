---
sidebarDepth: 3
---

# Instance.Run() 方法

## ServerHub.Run()

[本节请查看这里](</zh/tutorial/Instance.Run().html>)

## Instance.Run() 参数配置

前些天，我们了解了 `instance.Run()` 方法。本章我们会继续探讨该方法的第一个配置参数： `instance.Run()` 的配置对象。

### 越简单越好

与之前我们在 [Instance.Run()](</zh/tutorial/Instance.Run().html>) 一章中看到的不同，那个配置对象太复杂了。事实上，只有一个参数是必要的，那就是： `BaseDir`.

BaseDir 是 服务器的根目录，它会被 ServerHub 应用程序引用于其生命周期的各个阶段。如果你的入口文件，比如 app.js，刚好位于你的服务器根目录，则只需将 `__dirname` 传过去即可。

这就是能够让你的 ServerHub 应用正常工作的最基本配置了。

### 其他的配置参数

自定义 ServerHub 时需要一些额外的配置。

#### `WebDir`

`WebDir` 就是你网站的根目录。你的页面文件、资源文件、脚本文件和素材都应该被放在这里面。ServerHub 默认使用“www/”作为其值。如果你要设置一个另外的网站根目录，请先创建一个目录，并将其名字传给 `WebDir` 属性。

#### `ControllerDir`

我们都知道，ServerHub 会把 HTTP 请求分发到 controller 上，如果要注册 controller，就应当指定 controller 所在的目录。所使用的 controller 目录应该是一个相对于服务器根目录的相对路径，ServerHub 中默认用“controller/”。

#### `Controllers`

有些情况下，我们不希望 controller 目录下的所有文件都被注册进去（比如你放置了非控制器的文件）。那么此时，可以将所需的文件名通过数组传给此属性。比如： `['home.js', 'data.js']`。但如果你想把所有的文件都一并注册了，很简单，不要加入此属性即可。ServerHub 会自动扫描并注册 `ControllerDir` 中所有文件。

#### `ViewDir` 和 `ModelDir`

与 `ControllerDir` 类似，它们用于存放视图和模型。

#### `DBProvider`

通过此属性执行你所需的数据库支持包。当前版本你只可以使用 MySQL，也就是把“mysql”赋值给 DBProvider。

#### `DBConnectionString`

如果你只有一个数据库实例要使用，那么我建议你将一个全局数据库连接字符串传入 ServerHub。因为如果你不这样，你就必须要在每次调用 `GetConnection()` 方法时传入数据库连接字符串。

#### `MaxCacheSize`

此属性与 ServerHub 的缓存分配机制有关。如果文件大小超过了此配额，那么 ServerHub 就会通过 WCS 机制来主动卸载一些缓存，这个机制会在后面的章节详谈。

#### `DefaultPages`

ServerHub 在处理默认页时引入了一个优先匹配和回滚策略。你的默认页必须放在 WebDir 目录。默认情况下，ServerHub 会首先寻找“index.html”，然后再找“default.html”，如果还是没有，就去寻找“page.html”。当然，你可以用一个形如 `['hello.html', 'first.html']` 的数组来强制覆盖此回滚策略。

#### `PageNotFound` `v0.0.93+`

一旦收到的请求不能找到对应的资源，或是没有相应的路由规则可以匹配，则 ServerHub 会渲染出 404 NOT Found 的页面返回。而从 v0.0.93 开始，你可以自己来指定这个错误页了。

#### `AsyncOperationTimeout` `v0.0.97+`

自从 `v0.0.96` 引入 `this.Runtime.WAIT` 信号量之后，我们已经可以在控制器中实现一些耗时的异步操作逻辑，比如数据库查询操作。但是你应该知道，这个信号量其实是非常危险的，因为如果你忘记将其置为 `false` 或是因为操作太耗时而在中间过程中断开连接，则可能会出现严重的问题（得不到相应，甚至服务器程序崩溃）。所以 ServerHub 内置了倒数计时，如果操作时间超过这个阈值，则会停止等待，立即返回响应（可能是空响应）。在返回响应的同时，还会在服务器端的控制台输出错误信息（此输出特性可能在将来的版本中移除或迁移到日志中）。默认阈值为 10 秒钟，你可以通过将此变量传入来缩短或延长该值。（单位为 **毫秒**）

感谢阅读本章节，更多属性会在以后的更新中补充。

#### `TLSOption` `v1.0.6+`

自 `v1.0.6` 开始，ServerHub 大大增强了连接安全性。你可以通过此属性来配置 TLS 证书。此属性由 4 个子属性构成： `Key: string、 Cert: string、 CA: string` 和 `Port: Array<string>|Array<number>|number|string`。你需要把私钥与证书载入并赋值给上述属性，然后把需要 TLS 连接的端口号指定给 Port 属性。
