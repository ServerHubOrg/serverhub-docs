# Route

Route is one of ServerHub's core features. With route, all HTTP request can be filtered and send to correct handlers. For example, `/index.html` might be a static webpage, but `/home/index` could be a controller URL. ServerHub's route system provide two ways to deal with it. One is called positive rules and the other one is called negative rules.

## Positive rules

Positive rules looks like JavaScript string formatting. There are several '{' and '}' symbols in the rule content. Between each pair of parenthess lies the segment name of rule syntax. Valid segment names are: controller, action and id. For example: `"api/{controller}/{action}/{id}"`.

Prefix `api` is a normal string. Every request that matches the rule should start with this prefix.

`controller` is the name of controller, which is right the name of the controller file.

`action` is the function property defined in controller scripts.

Here we have some examples (assuming that you have home controller with index/info actions in your project):

```
Valid request path:
  /api/home/index
  /api/home/info/
  /api/home/index/5
  /api/home/index/5?name=xu_wangzhe
  /api/home/index/?name=xu_wangzhe

Invalid request path:
  /home/index
  /api/home/index.html
  /api/home/5
  /api/index/5?name=xu_wangzhe
  /api/home-foo/index/?name=xu_wangzhe
```

Request paths that does not match the route rule will be treated as requests to static resources.

But how to set positive rule? Look at this:

```js
route => {
  route.MapRoute("default", "v1/{controller}/{action}/{id}");
};
```

Pass this annoymous function as the second parameter of `instance.Run()` method.

## Negative rules

**Negative rules are checked ahead of any positive rules**. If any request path matched any negative rule, it will immediately be treated as static resources.

Negative rules support **both** string rule definition and regular expressions. An array is used to contain all the rules needed.

Here are three examples:

### String rule example

```js
route.IgnoreRoute(["/language/all"]);
```

As you can see. The `language` controller may have `english` and `chinese` actions, but `all` is not an action. If we don't ignore this route, ServerHub will try to seek for action named `all`, which will fire an exception. So, we use this string rule to ignore specific request path.

One thing that you should know about string negative route rule is: your rules should always start with '/'.

### Regular expression example
What if want to ignore all routes that start with "no-route"? Should we write every possibilities? Of course, that is not possible. So we use the regular expression above to ignore all request with prefix "no-route" (upper-case or lower-case)

```js
route.IgnoreRoute([/^\/no-route.*$/i]);
```


### Multiple negative rules

```js
route.IgnoreRoute(["/language/all", /^\/no-route.*$/i]);
```

## Search/Query in URL

According to [RFC 1738](https://tools.ietf.org/html/rfc1738), a valid search in URL is defined as follows:

```rfc
search         = *[ uchar | ";" | ":" | "@" | "&" | "=" ]
uchar          = unreserved | escape
unreserved     = alpha | digit | safe | extra
alpha          = lowalpha | hialpha
lowalpha       = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" |
                 "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" |
                 "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" |
                 "y" | "z"
hialpha        = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" |
                 "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" |
                 "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
digit          = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" |
                 "8" | "9"
safe           = "$" | "-" | "_" | "." | "+"
extra          = "!" | "*" | "'" | "(" | ")" | ","
escape         = "%" hex hex
hex            = digit | "A" | "B" | "C" | "D" | "E" | "F" |
                 "a" | "b" | "c" | "d" | "e" | "f"
```

More specificly, ServerHub allows:

* `?` as the start of a search/query.
* Identifier before `=` is used as search key.
* Identifier after `=` is used as search value.
* Search items use `&` as delimiter.

Please always obey the above rules, later versions of ServerHub might eable "strict mode" to force ignore search/query with invalid characters.
