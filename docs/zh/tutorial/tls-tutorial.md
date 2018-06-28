# TLS 简明教程

::: tip 可用性
自 v1.0.6 起可用
:::

TLS 能够保护你的客户端与服务器之间的机要通信，这背后依托的是 Node.js 的 HTTPS 模块。要用 ServerHub MVC 创建一个 HTTPS 服务器，你只需要比原来多做那么一丢丢工作。

## 与常规配置的唯一不同
下面给出一个最简单的例子：

```js
const sh = require('serverhub-mvc');
const fs = require('fs');
const path = require('path');

sh.Run({
    BaseDir: __dirname,
    Port: [80, 443],
    TLSOptions: {
        Port: 443,
        Key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
        Cert: fs.readFileSync(path.resolve(__dirname, 'certificate.pem'))
    }
});
```

有没有看出区别在哪里？**多了一个叫 `TLSOptions` 的属性**。除此之外，你也可以用 `SSLOptions` 或是 `SSLOption`、`TLSOption`。

你只需要在 `Key` 指定私钥文件，在 `Cert` 指定证书文件，最后在 `Port` 处给出一个数字（或是数组）作为要进行 TLS 加密的端口即可。

Bingo！

## 生成证书
当然啦，你可以用大把工具生成本地证书用于调试。如果你想要一个免费且简单的 TLS 证书用于保护你的公开域名，我推荐去试试 [Let's Encrypt](https://letsencrypt.org/)。

### 重要提醒
永远不要把你的签名和证书放到网站的 Web 根目录，也就是常用的 `www/` 目录。那个目录所有的文件都会被暴露在网络中（除非你使用特定路由来屏蔽访问）。