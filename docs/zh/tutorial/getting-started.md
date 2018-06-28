# 入门

通过这篇指南，希望你能了解基本的 ServerHub 用法。

## 安装

安装过程非常简单，你只需要在你的项目目录执行

```bash
npm i --save serverhub-mvc
```

即可。此操作会将 ServerHub 安装到你的 node_modules 当中，你只需要在后端程序的入口函数处引入并使用 ServerHub。

## 使用

这里将给出一个简单的目录，包含了 ServerHub 正常启动所需要的各个基本路径：（你可以通过 NPM 上的 serverhub-cli 工具来生成此目录）

```js
demo_directory/
├─ controller/
│  ├─ home.js
├─ model/
│  ├─ home.json
├─ view/
│  ├─ home.html
└─ www/    // web 目录
│   ├─ global.js
│   ├─ global.css
│─ app.js    // serverhub 入口函数
```

现在，我们对 `app.js` 做一些修改。

### 配置启动参数

在你的 `app.js` 中，可以看到类似于下面例子的代码：

```js
const serverhub = require("serverhub-mvc");
const fs = require("fs");
const path = require("path");

serverhub.Run(
  {
    BaseDir: __dirname,
    WebDir: "www/",
    Controllers: ["home.js"],
    MaxCacheSize: 256 // unit: MB
  },
  route => {
    route.MapRoute("default", "{controller}/{action}/{id}", {
      Controller: "home",
      Action: "index",
      id: ""
    });
  }
);
```

`Run` 方法需要两个参数：

* `config`

  此参数定义了服务器的根目录，也就是 `app.js` 所在的目录。该参数中有一个 `Controller` 属性指定了你要注册的控制器（也就是 controller 目录下的文件）。

  ServerHub 在启动时（称作 Compile-time，以后会提到这个词）会尝试找到并解析、注册这些文件。当你写 config 参数时，可以参阅 `node_modules/serverhub-mvc/index.d.ts` 中的类型定义。我使用 TypeScript 来开发，所以在一些现代编辑器中，你可以得到详细的类型推断、提示。此时，你不需要知道太多参数属性的含义，因为它们会在后续的文档中得到解释说明。

* `route`（回调函数形式）

  此函数用于注册路由，你可以通过它来注册或是添加路由例外。具体使用方法，我们会在以后的文档中详细说明。

现在，尝试运行 `node app.js`，ServerHub 会启动并监听 926 端口（是一个生日）。

### 更多

请点击 [这个链接](/zh/document/run-module-method.html)来查看关于 `instance.Run()` 方法配置参数的详细介绍。

