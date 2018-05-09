module.exports = {
  dest: "dist",
  locales: {
    "/": {
      lang: "en-US",
      title: "ServerHub MVC",
      description: "Fast and reliable MVC framework for Nodejs"
    },
    "/zh/": {
      lang: "zh-CN",
      title: "ServerHub MVC",
      description: "快速可靠的 Nodejs MVC 框架"
    }
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.png" }],
    ["link", { rel: "manifest", href: "/manifest.json" }]
  ],
  serviceWorker: true,
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
        nav: [
          {
            text: "Tutorial",
            link: "/guide/"
          },
          {
            text: "Documention",
            link: "/api/"
          }
        ],
        sidebar: {
          "/guide/": [
            {
              title: "Guide",
              collapsable: false,
              children: [
                "",
                "getting-started",
                "Instance.Run()",
                "hello-world"
              ]
            }
          ]
        }
      },
      "/zh/": {
        label: "简体中文",
        selectText: "选择语言",
        editLinkText: "在 Github 上编辑此页",
        nav: [
          {
            text: "指南",
            link: "/zh/guide/"
          },
          {
            text: "文档",
            link: "/zh/api/"
          }
        ],
        sidebar: {}
      }
    }
  }
};
