# break

基于electron的小应用

用于提醒电脑使用者中断任务，休息五分钟

默认每小时休息一次，一次五分钟，期间软件会用全窗口占据整个桌面

并不会强制禁用电脑，仅为提醒

## todo

- [ ] 插件系统，用于在页面上显示各种类型的信息，如git board issues, todo list
- [ ] 设置，包括时长设置，主题设置（风景、美女、汽车等……）、托盘图标设置
- [x] 启用开机启动
- [ ] 系统日志，可查看当日每次休息的时间戳，并且根据每次是否让程序运行足够的时间来判断是否完成了这次休息
- [ ] 单例启动
- [ ] 托盘第一栏显示下次休息的倒计时，休息页面显示当前休息的倒计时
- [x] Command+Q: 跳过本次，Command+W，推迟本次
- [ ] 引用外部图片，每次休息轮动
- [ ] 添加提前小休选项
- [ ] 工作日闪屏打卡提醒(自定义提醒时间)


### 构建步骤

1. https://iconverticons.com/online/ png转换为icns
2. electron-packager ./ break --out ./OutApp --electron-version 4.2.3 --overwrite --icon=./icon.png

### 说明

1. 注意代码中的default.jpg需要自己找图片

inspired by [stretchly](https://github.com/hovancik/stretchly)
