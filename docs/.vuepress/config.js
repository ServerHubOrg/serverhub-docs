module.exports = {
  base: "/", //deploy to serverhub-docs
  dest: "dist",
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
          text: "Documention",
          link: "/documention/"
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
            children: ["", "hello-world", "getting-started", "Instance.Run()"]
          }],
          "/documention/": [{
            title: "Documention",
            collapsable: false,
            children: [
              "",
              "run-module-method",
              "controller",
              "route",
              "plugin"
            ]
          }],
          "/about/": [{
            title: "About",
            collapsable: false,
            children: [
              "", 'contributors'
            ]
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
          link: "/zh/documention/"
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
            children: ["", "hello-world", "getting-started", "Instance.Run()"]
          }],
          "/zh/documention/": [{
            title: "文档",
            collapsable: false,
            children: [
              "",
              "run-module-method",
              "controller",
              "route",
              "plugin"
            ]
          }],
          "/zh/about/": [{
            title: "关于",
            collapsable: false,
            children: [
              "",
              "contributors"
            ]
          }]
        }
      }
    }
  }
};