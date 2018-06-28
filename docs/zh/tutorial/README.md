# 介绍

::: tip 提示  
基于 serverhub-mvc v1.3.1 更新 
:::

**ServerHub** 由一个 Node.js 框架和用于目录管理的辅助 CLI 工具组成。其中 ServerHub MVC [npm/serverhub-mvc](https://www.npmjs.com/package/serverhub-mvc) 是一个运行于 **Node.js** 的高效且简单的 **MVC Web** 服务器框架。

其主要特点是：

* 轻巧敏捷
* 稳定可靠
* 开源并且可拓展

## ServerHub 能做什么？

简单来讲，ServerHub 会根据你的配置（或是一些默认配置）来帮助你处理 HTTP 请求，返回适当的响应，可以根据你的路由规则来匹配控制器和触发相应的操作函数。并且，ServerHub 提供了数据库支持（目前支持 MySQL），让你可以通过非常简单的配置，完成数据库连接、查询等操作.ServerHub 的目标是让动态网站架设更加简单，也更加轻便。根据当前的设计，你使用 serverhub-cli 工具创建的 demo 目录可以进行路由配置，视图和模型绑定，以及控制器的注册操作。

在最新的更新当中，ServerHub 将 Node.js 原生的 ServerResponse 对象进行了一定的封装，这样你在 Action 方法中能够更加轻松处理数据（ServerHub 尽力保持与 Node.js 原生的最大兼容，但是你在使用前仍然需要充分阅读相关文档）。另一方面，ServerHub 为控制器提供了控制器作用域变量，让开发者访问系统参数和调用模块更加轻松了。关于这些更新的详细信息，建议阅读 master 分支的 CHANGELOG.md 说明。