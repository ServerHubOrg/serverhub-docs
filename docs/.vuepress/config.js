module.exports = {
  base: "/", //deploy to serverhub-docs
  dest: "dist",
  title: "ServerHub References",
  locales: {
    "/": {
      lang: "en-US",
      title: "ServerHub References",
      description: "Fast and reliable MVC framework for Nodejs"
    },
    "/zh/": {
      lang: "zh-CN",
      title: "ServerHub 参考",
      description: "快速可靠的 Nodejs MVC 框架"
    }
  },
  head: [
    ["link", {
      rel: "icon",
      href: "/favicon.png"
    }],
    ["link", {
      rel: "manifest",
      href: "/manifest.json"
    }],
    ["link", {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Roboto:500,400,300|Roboto+Mono"
    }],
    ['link', {
      rel: 'stylesheet',
      href: "//fonts.googleapis.com/earlyaccess/notosansscsliced.css"
    }], [
      'link', {
        rel: 'stylesheet',
        href: "https://fonts.googleapis.com/icon?family=Material+Icons"
      }
    ]
  ],
  serviceWorker: false,
  themeConfig: {
    repo: "ServerHubOrg/serverhub-mvc",
    docsRepo: "ServerHubOrg/serverhub-docs",
    editLinks: true,
    docsDir: "docs",
    docsBranch: "dev",
    locales: {
      "/": {
        label: "English",
        selectText: "Languages",
        editLinkText: "Edit this page on Github",
        nav: [{
          text: "Tutorial",
          link: "/tutorial/"
        },
        {
          text: "Document",
          link: "/document/"
        },
        {
          text: "About",
          link: "/about/"
        }
        ],
        sidebar: {
          "/tutorial/": [{
            title: "Tutorial",
            collapsable: false,
            children: ["", "hello-world", "getting-started","tls-tutorial"]
          }],
          "/document/": [{
            title: "Document",
            collapsable: false,
            children: [
              "",
              "run-module-method",
              "controller",
              "route",
              "plugin",
              "database",
              "middleware",
              "archive"
            ]
          }],
          "/about/": [{
            title: "About",
            collapsable: false,
            children: [
              "", 'contributors'
            ]
          }],
          "/archive":[{
            title:'Archive',
            collapsable:false,
            children: ['','serverhub-mvc-1-3-0']
          }]
        }
      },
      "/zh/": {
        label: "简体中文",
        selectText: "选择语言",
        editLinkText: "在 Github 上编辑此页",
        nav: [{
          text: "教程",
          link: "/zh/tutorial/"
        },
        {
          text: "文档",
          link: "/zh/document/"
        },
        {
          text: "关于",
          link: "/zh/about/"
        }
        ],
        sidebar: {
          "/zh/tutorial/": [{
            title: "教程",
            collapsable: false,
            children: ["", "hello-world", "getting-started",'tls-tutorial']
          }],
          "/zh/document/": [{
            title: "文档",
            collapsable: false,
            children: [
              "",
              "run-module-method",
              "controller",
              "route",
              "plugin",
              "middleware",
              "archive"
            ]
          }],
          "/zh/about/": [{
            title: "关于",
            collapsable: false,
            children: [
              "",
              "contributors"
            ]
          }],
          "/zh/archive/":[{
            title:'归档',
            collapsable:false,
            children: ['','serverhub-mvc-1-3-0']
          }]
        }
      }
    }
  }
};