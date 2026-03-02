# koishi-plugin-phigros-redo

[![downloads](https://img.shields.io/npm/dm/koishi-plugin-phigros-redo?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-phigros-redo)
[![npm](https://img.shields.io/npm/v/koishi-plugin-phigros-redo?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-phigros-redo)

Koishi plugin for everything Phigros!

开箱即用的 Koishi Phigros 查分 b27 / b19 插件！

## 声明
1. 本项目仅供学习交流使用，严禁用于侵犯 `PHIGROS®`、`Phigros 玩家` 以及 `南京鸽游网络有限公司` 等主体的权益用途！

## 感谢
本项目fork自[koishi-plugin-phigros](https://github.com/koishijs/koishi-plugin-phigros/)，在npm发布的时候重命名了

特别感谢 [PhigrosLibrary](https://github.com/7aGiven/PhigrosLibrary/) 提供的存档解析思路。

特别感谢 [Phigros_Resource](https://github.com/7aGiven/Phigros_Resource) 提供的谱面信息

特别感谢 [phi-plugin-next](https://www.phib19.top/pages/api-docs) 提供的聚合数据分析

v2.1.3 版本以前， 本项目使用了[Phigros](https://github.com/ssmzhn/Phigros)存储的歌曲仓库

## 更新记录
v2.0.11: `月詠に鳴る.Freyquitousfeat蓝月なくる` 修改为 `月詠に鳴る.Feryquitousfeat藍月なくる`

v2.0.12: `祈我ら神祖と共に歩む者なり` 修改为 `祈-我ら神祖と共に歩む者なり-`

v2.0.13: 新增b40，微调`score`指令返回的图样式

v2.0.14: 增加github代理配置项，允许自行选用github代理

v2.0.15: 修复mysql数据库 alias id null 自增 错误

v2.1.0: 增加b27功能

v2.1.1: b27 图片底部成绩显示修复

v2.1.2: css样式不生效导致标题图片渲染错位

v2.1.3: mysql8.2 使用别名功能报错 没有这个问题可以不更新 关联issue[#13](https://github.com/mqnu00/koishi-plugin-phigros/issues/13)

v2.2.0: 考虑到 萌娘百科 信息经常出现 单词错拼，谱面信息获取方式迁移到 [Phigros_Resource](https://github.com/7aGiven/Phigros_Resource)

v2.3.0: 接入 [phi-plugin-next](https://www.phib19.top/pages/api-docs) API 获取 谱面临近 rks 的平均 acc

v2.3.1: b27 显示不全，只显示到第24首，修改显示为每行3首，加上ap3应该显示30首
