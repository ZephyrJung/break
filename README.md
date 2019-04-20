# break

基于electron的小应用

用于提醒电脑使用者中断任务，休息五分钟

默认每小时休息一次，一次五分钟，期间软件会用全窗口占据整个桌面

并不会强制禁用电脑，仅为提醒

## todo

- [ ] 插件系统，用于在页面上显示各种类型的信息，如git board issues
- [ ] 设置，包括时长设置，主题设置（风景、美女、汽车等……）


### 构建步骤

1. https://iconverticons.com/online/ png转换为icns
2. electron-packager ./ break --out ./OutApp --electron-version 4.1.4 --overwrite --icon=./icon.png
