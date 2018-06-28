# TLS Tutorial

::: tip Status
Available since v1.0.6
:::

TLS can secure you connection between your clients and browsers, with the power of Node.js' power HTTPS module. To create an HTTPS server with ServerHub MVC, you have a few things to do compared with HTTP ones.

## Only Difference in Configuration
Here we have a minimal HTTPS ServerHub server application:

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

Have you noticed the only difference? **There is another property called `TLSOptions`**. Except that, you can also use `SSLOptions` or `SSLOption`/`TLSOption`.

You only need to provide `Key` for private key file, `Cert` for certificate file and specify TLS ports with `Port` (a number or an array of numbers).

Done.

## Generate Your TLS Certificate
You certainly can generate your local certificate without any third party authorities. And you can use [Let's Encrypt](https://letsencrypt.org/) for simple and free certificate for your own domains.

### One thing essential
Never put your key and cert files to "Web Root" folder, usually `www/`. Content within that folder will be exposed to public with route path `/{content path}`.