(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{175:function(t,a,s){"use strict";s.r(a);var n=s(0),e=Object(n.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"content"},[s("h1",{attrs:{id:"database"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#database","aria-hidden":"true"}},[t._v("#")]),t._v(" Database")]),s("p",[t._v("Database is probably the next thing you really want to handle with after you set up the basic of the website. And ServerHub supports some of the most popular databases.")]),s("p",[t._v("In this very first beta version of ServerHub, you can interact with MySQL (default) extremely easily with the controller scope variable: "),s("code",[t._v("this.Runtime.DBProvider")]),t._v(".")]),s("h2",{attrs:{id:"an-easy-to-use-example"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#an-easy-to-use-example","aria-hidden":"true"}},[t._v("#")]),t._v(" An Easy-to-use Example")]),s("p",[t._v("Let's begin with an example (MySQL):")]),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{attrs:{class:"token string"}},[t._v('"use strict"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nmodule"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    index"),s("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("req"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" method"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" db "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("this")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Runtime"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("DBProvider"),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" conn "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" db"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("GetConnection")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            Host"),s("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"localhost"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            Username"),s("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"devchache"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            Password"),s("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"ziyuan"')]),t._v("\n        "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        conn"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("connect")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("err "),s("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("err"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("throw")]),t._v(" err"),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),s("span",{attrs:{class:"token keyword"}},[t._v("this")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Console"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("log")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('"Connected!"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("this")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("View")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("This is a classic controller script file with 'index' action. Inside the action method, you can see how easily you can interact with MySQL database.")]),s("h2",{attrs:{id:"two-steps-of-connecting-to-mysql"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#two-steps-of-connecting-to-mysql","aria-hidden":"true"}},[t._v("#")]),t._v(" Two Steps of Connecting to MySQL")]),s("p",[t._v("Basically, there are two steps:")]),s("ol",[s("li",[t._v("Get database provider object from "),s("code",[t._v("this.Runtime.DBProvider")]),t._v(". Don't forget to use "),s("code",[t._v("this")]),t._v(" reference.")]),s("li",[t._v("Get database connection with "),s("code",[t._v("db.GetConnection()")]),t._v(" method. If you have already set up the configuration for database connection strings (in your entry file, like "),s("code",[t._v("app.js")]),t._v("), there are no required parameters. But if not, you must provide three parameters: "),s("code",[t._v("Host")]),t._v(", "),s("code",[t._v("Username")]),t._v(" and "),s("code",[t._v("Password")]),t._v(" (No need to explain more, hah?).")])]),s("p",[t._v("Now, you can handle with MySQL database.")]),s("h2",{attrs:{id:"a-more-common-way"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#a-more-common-way","aria-hidden":"true"}},[t._v("#")]),t._v(" A More Common Way")]),s("p",[t._v("Since ServerHub MVC v1.0.3 imported module syntax, you now have the ability to import/require your favorite packages/modules to build a stronger application. You may not need ServerHub's way of accessing databases, but you are always suggested to controller scope variables due to a better integration.")])])}],!1,null,null,null);a.default=e.exports}}]);