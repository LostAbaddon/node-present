更新日志
====

----

-	Module: Present
-	Version: 0.1.0
-	Author: LostAbaddon
-	Date: 2017.08.23

简易HTTP服务器。\\
文档化路径化管理与加载静态资源、下载与上传请求、可热更新的单线程/多线程/多进程模式WebAPI接口，Router插件，资源单包化。

----

依赖库：

-	NodeJS 8.3
-	Express 4.15
-	Mime 1.3.4
-	Multer 1.3
-	Body-Parser 1.17
-	Cookie-Parser 1.4.3

----

v0.1.0（开发中）
----

1.	内存级缓存
	所有资源会检查是否已读取过，如果已读取过则使用内存中的缓存。
	-	可限制总缓存大小与单个缓存大小
	-	限制可缓存文件类型
	-	监控文件夹如有变动自动更新缓存
	-	根据使用情况自动分配缓存权重（开发中）
	-	配置示例：

```json
{
	"prefix": "Resource::",
	"mem": {
		"totalLimit": "10M",
		"singleLimit": "100K",
		"accept": ["text", "javascript", "json"]
	}
}
```

2.	热更新插件（开发中）
3.	WebAPI的多Mode运行：主线程、子线程、子进程（开发中）
4.	插件系统（开发中）
5.	优化session（开发中）
6.	过滤器（开发中）
7.	单包化资源（开发中）
8.	模板系统（开发中）
9.	WebSocket用的WebAPI（开发中）
10.	辅助工具
	-	优化的事件管理系统：Utils.EventManager
11.	下一步
	-	Redis级缓存
	-	更好的类型判别工具
	-	Config文件的动态热更新
	-	七牛云与阿里OSS的自动上传组件

----

v0.0.2
----
Date: 2017.08.20

1.	WebAPI由同步改为异步，增加可拓展性
2.	当配置了upload时，默认将upload目录添加为forbid目录

----

v0.0.1
----
Date: 2017.08.19

1.	静态资源
	>	指定目录组下的文件可以直接读取，以目录组中顺序为优先级。
2.	资源下载
	>	指定目录组下的文件可以直接下载
3.	资源上传
	>	上传文件到指定目录，可根据配置选择是否按日期分目录，或在文件名上加日期后缀，或者根据自建的文件类型筛选器分目录，以及可以使用32位随机字符串作为文件名。
		destination: 保存的根路径；
		url: 请求上传的根路径；
		keepname: 是否保存原文件名；
		timely: 是否追加时间信息，false不加，'folder'在分类路径下以时间为次目录，'postfix'在文件名后加时间为标记；
		classify: 分类器，key是文件类型，value是分类目录。
4.	禁用路劲
	>	指定位置的URL请求会返回404错误
5.	错误页
	>	指定错误页
6.	WebAPI接口
	>	“_.js”代表当前目录为路径的URL；
	“{xxx}”代替Router通配URL中的“:xxx”。
7.	重定向
	>	访问指定路径会自动重定向到指定网址，带上所有参数
8.	访问优先级： Api > Forbid > Redirect > Download > Static > 404
9.	示例：

```json
{
	"loglev": 1,
	"port": 80,
	"api": [ "./api" ],
	"forbid": [ "./upload" ],
	"redirect": {
		"search": "http://www.google.com/search"
	},
	"download": [ "./download", "./dl" ],
	"root": [ "./", "./web" ],
	"error": {},
	"upload": {
		"destination": "./upload",
		"keepname": true,
		"timely": "postfix",
		"classify": {
			"image": "img/",
			"text": "text/"
		}
	}
};

```

----

License
----
MIT