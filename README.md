# 动画音乐 MV 制作 Skill

把一首歌做成有分镜、有节奏的动画 MV。从本地音源和歌词出发，先确定画风并审阅剧本，再用 Remotion 制作动画、抽查关键帧，最后交付带音频的 1080p MP4。整首歌、十几秒的高光片段、每句一景的说唱卡点，都可以用这套流程制作。

**3 种创作模式 · 7 种代码动画画风 · 5 套 Remotion 示例**

## 可以做什么

| 功能 | 你会得到 |
| --- | --- |
| 全曲或高光片段 | 根据实际音频校准时间轴，处理片段裁剪、淡入淡出与歌词同步。 |
| 剧本与分镜 | 角色设定、情绪色板、逐场画面、运镜和字幕安排。确认分镜后再开始制作。 |
| 动画与审片 | 用 React / Remotion 实现角色、场景、转场和动态字幕，抽查 12–16 张关键帧，修正遮挡、字幕溢出和转场问题。 |
| 成片与制作包 | 可交付 1920×1080、30 fps 的带音频 MP4、Remotion 源码和审片拼图，也可只输出剧本、时间轴和制作提示词。 |
| 配套封面（可选） | 按需制作 4:3 横版与 3:4 竖版封面。生成图片需要可用的生图工具。 |

## 三种创作模式

| 模式 | 适合什么 | 分镜怎么做 |
| --- | --- | --- |
| 意象氛围编舞 | 抒情、古风、抽象情绪流 | 选出贯穿全片的意象，随歌词和音乐起伏编排画面。 |
| 原创故事叙事 | 情歌、人物关系、剧情型 MV | 创作一段有起承转合的原创故事，再对齐歌词和音乐情绪。 |
| 说唱一句一景卡点 | 旋律说唱、Emo Rap、都市小剧场 | 用节拍网格安排切镜，把每句歌词转成一个具体的画面或动作。 |

## 七种画风预览

![七种动画画风的代码渲染样张](resources/style-samples/style-catalog-7in1.jpg)

| 画风 | 推荐用于 |
| --- | --- |
| A · 方头 Q 版手绘漫画 | 抒情流行、青春与情感叙事 |
| B · 复古像素颗粒 | 怀旧金曲、深夜都市 |
| C · 层叠纸雕立体绘本 | 民谣、治愈故事、童话 |
| D · 国风写意水墨剪影 | 古风、戏腔、江湖故事 |
| E · 90s City Pop 霓虹剪影电影 | R&B、Lo-Fi、城市夜景 |
| F · 手绘素描涂鸦手书 | 摇滚、情绪表达、手书 PV |
| G · 白边贴纸手账绘本 | 旋律说唱、Emo Rap、一句一景卡点 |

[查看画风细节和单张样图](references/visual-styles.md) · [查看 C–G 的 Remotion 代码示例](examples/code-style-proof/)

## 安装与使用

### 1. 安装到你的项目

在你准备用来做 MV 的项目目录中，按所用工具选择一条命令。

**Codex**

```bash
git clone https://github.com/pphgood/animation-music-video.git .agents/skills/animation-music-video
```

在 Codex 里输入 `$` 并选择 `animation-music-video`，然后描述你的制作需求。[Codex 技能文档](https://learn.chatgpt.com/docs/build-skills)

**Claude Code**

```bash
git clone https://github.com/pphgood/animation-music-video.git .claude/skills/animation-music-video
```

在 Claude Code 里输入 `/animation-music-video`，然后填写制作需求。[Claude Code 技能文档](https://code.claude.com/docs/en/skills)

也可以用 GitHub 的 **Code → Download ZIP** 下载，解压后把整个目录放到对应的技能路径，文件夹名设为 `animation-music-video`。

### 2. 准备音源与工具

| 准备项 | 说明 |
| --- | --- |
| 本地音源 | 将你有权使用的 `.mp3`、`.wav`、`.flac` 或 `.m4a` 放进项目，可附 `.lrc`。给出文件路径、歌名和制作范围。 |
| Node.js、npm | 用于安装项目依赖、运行 Remotion Studio 和渲染视频。 |
| Python 3、FFmpeg | 用于检测和裁剪音频、生成审片拼图及验证成片。确保终端能调用 `python`、`ffmpeg` 和 `ffprobe`。 |

### 3. 发送制作需求

下面的示例可直接复制，把路径和时间段换成自己的素材。

```text
用 animation-music-video 制作一段 20 秒的横屏动画 MV。
音源：./素材/歌曲.mp3，截取 00:42 到 01:02。
歌词：./素材/歌曲.lrc。
用原创故事叙事模式和复古像素风。先给我故事大纲和带时间点的分镜，
等我确认后再渲染，交付 1080p MP4 和关键帧审片拼图。
```

| 想做的事 | 可以这样说 |
| --- | --- |
| 先试风格 | 用我提供的音源做高光片段，先展示画风图谱，推荐两种适合这首歌的画风。 |
| 做说唱卡点 | 用白边贴纸手账风做副歌，一句一景，按实测节拍安排切镜。 |
| 交给其他工具制作 | 先交付剧本、分镜、歌词时间轴、音源说明和完整制作提示词。 |
| 加做封面 | 成片确认后，请再做 4:3 横版和 3:4 竖版封面。 |

### 4. 审分镜并拿到成片

先审阅剧本、角色和逐场分镜。确认后，Agent 实现动画并抽查关键帧，再渲染成片。标准流程会把 MP4 放在 `<歌名>-MV/`，并在 Remotion 工程的 `out/stills/` 中提供审片拼图。

## 仓库内容

| 文件或目录 | 用途 |
| --- | --- |
| [SKILL.md](SKILL.md) | 技能入口，包含从需求到成片的工作流 |
| [references/](references/) | 画风预设、Remotion 工程规范与封面制作规范 |
| [scripts/](scripts/) | 音频探测裁剪与批量关键帧审片脚本 |
| [examples/code-style-proof/](examples/code-style-proof/) | 五套代码动画示例及渲染样图 |
| [resources/style-samples/](resources/style-samples/) | 七种画风样张与总览图 |

## 到抖音看成片

具体使用效果可以查看我的抖音账号 **61分钟**（抖音号 **27815544118**），用抖音扫一扫下方二维码即可找到我。

<img src="assets/douyin-qrcode.jpg" width="300" alt="抖音账号 61分钟（抖音号 27815544118）的二维码">
