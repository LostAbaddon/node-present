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

v0.0.1（开发中）
----
Date: 2017.08.16
1.	静态资源
2.	资源下载
3.	资源上传（开发中）
4.	禁用路劲
5.	错误页
6.	WebAPI接口
	“_”代表当前目录为路径的URL
	“{xxx}”代替Router通配URL中的“:xxx”
7.	重定向
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