# Release Notes

## v1.0.5 (2024-03-xx)

### 新增功能
- 为名字卡片添加淡入上升动画效果
- 卡片依次显示，每个卡片间隔0.1秒
- 动画使用ease-out缓动函数，提供更自然的视觉效果

### 技术细节
- 在 tailwind.config.js 中添加自定义动画配置
- 使用 animate-fadeInUp 类实现动画效果
- 通过 style.animationDelay 控制卡片的依次出现

### 优化
- 改善用户体验，使名字展示更加生动
- 保持原有的卡片样式和布局不变