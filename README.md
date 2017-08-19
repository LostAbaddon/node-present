更新日志
====

----

-	Module: Present
-	Version: 0.0.1
-	Author: LostAbaddon

简易HTTP服务器。
基于 NodeJS 8.3 、 Express 4.15 、 Multer 1.3 、 body-parser 1.17 。
文档化路径化管理与加载静态资源、下载与上传请求、WebAPI接口。

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
	>	访问指定路径会自动重定向到指定网址，带上所有参数（get请求）
8.	访问优先级： Api > Forbid > Redirect > Download > Static > 404

----

v0.0.2（规划中）
----
1.	内存级缓存
2.	资源包化
3.	优化session
4.	单包化资源
5.	模板系统
6.	过滤器
7.	插件系统
8.	热更新插件
9.	WebAPI的多Mode运行：主线程、子线程、子进程

License
----
MIT