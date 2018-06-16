module.exports = {
  base: "/", //deploy to serverhub-docs
  dest: "dist",
  locales: {
    "/": {
      lang: "en-US",
      title: "ServerHub Open Source Project",
      description: "Fast and reliable MVC framework for Nodejs"
    },
    "/zh/": {
      lang: "zh-CN",
      title: "ServerHub MVC",
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
      href: "https://fonts.googleapis.com/css?family=Noto+Sans|Roboto|Roboto+Mono"
    }]
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
            text: "Contribution",
            link: "/contribution/"
          }
        ],
        sidebar: {
          "/tutorial/": [{
            title: "Tutorial",
            collapsable: false,
            children: ["", "getting-started", "Instance.Run()", "hello-world"]
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
          "/contribution": [{
            title: "Contribution",
            collapsable: false,
            children: [
              "",
              "CLI & Templating",
              "Documents"
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
            text: "贡献者",
            link: "/zh/contribution/"
          }
        ],
        sidebar: {
          "/zh/tutorial/": [{
            title: "教程",
            collapsable: false,
            children: ["", "getting-started", "Instance.Run()", "hello-world"]
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
          "/contribution": [{
            title: "项目贡献者",
            collapsable: false,
            children: [
              "",
              "CLI & 模板维护",
              "文档"
            ]
          }]
        }
      }
    }
  }
};