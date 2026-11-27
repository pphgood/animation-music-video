# Remotion 动画 MV 工程架构与实战避坑规范

本规范总结自 `gentleman-mv`（整曲 8730 帧）、`shun-mv`（91 秒高光片段 2730 帧）与 `mingmingjiu-mv`（整曲 7740 帧原创故事叙事版）的实战经验，确保一次编码通过、并发渲染零闪烁、视觉审片零穿模、局部修改高效拼接。

---

## 一、推荐技术栈与编码配置

- **依赖版本**：`remotion` / `@remotion/cli` / `@remotion/zod-types`（4.0.x）、`react` 19、`typescript` 5.8、`zod`。
- **`remotion.config.ts` 标准配置**：
  ```ts
  import {Config} from '@remotion/cli/config';

  Config.setVideoImageFormat('jpeg');
  Config.setJpegQuality(92);
  Config.setOverwriteOutput(true);
  Config.setCodec('h264');
  Config.setCrf(18);
  Config.setPixelFormat('yuv420p');
  Config.setAudioCodec('aac');
  Config.setConcurrency(8);
  ```

---

## 二、强制工程规范（零闪烁 / 零错位）

1. **100% 确定性帧计算**：
   - Remotion 多进程并发渲染不同帧，任何基于系统时钟或非确定性随机数的逻辑都会导致成片剧烈闪烁。
   - **必须使用**：`useCurrentFrame()`、`interpolate(..., {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})`、`spring()`、`Easing`、`random('固定种子-' + i)`。
   - **严格禁止**：`Math.random()`、`Date.now()`、`requestAnimationFrame`、`setInterval`、CSS `transition` / `@keyframes`。
2. **SVG 渐变与滤镜 ID 隔离**：
   - 若同一画面同时挂载两个同类型背景组件（如昼夜分屏同时渲染两个 `<OceanHorizon />`），必须传入不同 `idPrefix`（如 `s4n` / `s4s`），避免 `<defs>` 中 SVG `id` 冲突导致色彩串台。
   - `feTurbulence` 纸纹滤镜使用固定整型 `seed`，绝不绑定 `frame`。
3. **音频接入规范**：
   - 使用 `<Html5Audio src={staticFile(audioFile)} trimBefore={...} />`，并通过 `defaultProps` 暴露 `enableAudio`、`audioFile`、`audioOffsetSec`，方便 Studio 实时试听微调。
   - 单幕预览合成（`Scenes/Scene01` ～ `SceneNN`）传入 `startFrame={s.from}` 自动截取对应时间段音频。
4. **离线中文字体安全栈**：
   - 无衬线体：`"'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif"`
   - 仪式宋体：`"'Songti SC','STSong','SimSun','Noto Serif SC',serif"`
   - 手写楷体：`"'Kaiti SC','STKaiti','KaiTi',serif"`

---

## 三、角色绘制与构图高频避坑清单（审片必查）

1. **统一底部中心锚点 `(0, 0)`**：
   - 角色组件坐标原点必须定义在**鞋底正中**，方便直接对齐地面线/长椅/站台地砖。
2. **双人互动严禁“长出四只手”**：
   - 给单人组件提供 `hideArms?: boolean` 参数；实现拥抱（`CoupleHug`）、靠肩（`TrainCoupleLean`）等组合动作时，隐藏被遮挡的内侧默认手臂，统一用专用环抱手臂图层绘制，同时拉开两人头部水平间距避免双丸子头遮挡男主双眼。
3. **跪坐 / 坐姿无缝衔接**：
   - 跪坐腿部矩形顶边必须略微插入上衣下摆内（如衣摆底 `y = -30`，腿顶 `y = -36`），消除躯干与腿之间的悬空黑缝。
4. **前景桌面与遮幅安全区**：
   - 底部字幕黑栏占 `y = 976..1080`，所有站立角色鞋底建议控制在 `y <= 920`；
   - 书桌、取景框等前景遮挡物场景，确保角色嘴巴与下巴高出桌沿至少 `40–60px`；
   - 高潮段上方仪式字幕（`marginTop: 148px`）下方预留足够净空，不与角色头顶呆毛碰撞。
5. **无缝转场尾帧延长**：
   - 编排 `<Sequence>` 时，上一幕的 `durationInFrames` 应加上下一幕入场转场长度 `tail = next ? TRANSITIONS[next.id].len : 0`，确保淡入叠化或裂屏转场时底图不露黑底。
6. **刘海高度与悲情微表情规范**：
   - 方头 Q 版碎发刘海下沿需高于眉毛至少 `4–6px`，确保垂眉/皱眉完整可见；
   - 悲情/独处失落镜头禁止使用 `^ ^` 眯眼笑或带喜剧冷汗珠的夸张强颜欢笑；含泪克制微笑应采用「垂眉 + 睁眼下沿泛蓝泪光 + 轻柔嘴角弧度」。
7. **关键道具特写窗与单臂动作防重影**：
   - 连续单臂动作（如抬手吃糖、举伞）必须用 `hideRightArm` / `hideLeftArm` 隐藏默认垂臂，改用带呼吸同步偏移（`breathe * scale`）的双层 `strokeLinecap="round"` 贝塞尔弧线手臂，彻底避免肘部断开或长出第三只手；
   - 情绪转折依赖细节动作时（如勾小指、剥开最后一颗糖），用带 `4–6` 字胶囊标题的圆角插画特写窗清晰演出来，置于中景安全区（避开顶部高潮宋体与人物脸部）。
8. **对话气泡防孤字与柔焦光晕 / 新月规范**：
   - 漫画对话气泡宽度应随中文字符长度自适应（如 `Math.min(540, Math.max(width, text.length * 24 + 54))`），杜绝末尾 1–2 个孤字折行；
   - 路灯、吊灯、桥面暖晕一律使用 SVG `radialGradient`（外缘 `stopOpacity={0}`），禁止半透明纯色 `<circle>` 硬边圆贴片；
   - 新月等镂空天体采用 SVG `<mask>`（白圆叠黑偏心圆裁切）而非手算双弧 sweep flag，避免渲染出细线框。
9. **风格 G 白边模切贴纸滤镜与防白块规范**：
   - 白色模切外框滤镜必须设置足够的滤镜区域 `x="-25%" y="-25%" width="150%" height="150%"`，防止角色举手/道具超出默认 10% 区域被切掉白边；
   - **独立小包盒原则（4× 渲染提速）**：严禁把横跨全屏的多个角色/道具放进同一个巨大 `<g filter="url(#...-sticker)">`（否则 `feMorphology radius=10` 会对全屏像素做膨胀计算），务必为每个角色/道具单独包裹 `<g filter>`；
   - Alpha 二值化必须采用抗锯齿 `feGaussianBlur (stdDeviation=0.6)` + `feComponentTransfer` `linear (slope=16, intercept=-6)`，禁止直接 `discrete` 造成锯齿毛刺；
   - **严禁将半透明元素（柔焦月亮光晕、路灯锥形光束、透明雨伞、低不透明度玻璃雾气）放入 `filter="url(#...-sticker)"` 的 `<g>` 内**，否则半透明像素会被 `feMorphology dilate` 膨胀成巨型实心白块！必须分层渲染在贴纸外层；
   - 矢量小图标（五角星、月亮、禁止符号、水滴、雪花、红心）一律使用纯 SVG 路径绘制，严禁依赖系统彩色 Emoji 字体以免在无头 Chromium 中渲染异常。
10. **说唱 BPM 节拍律动与无黑栏奶油纸卡安全区**：
    - 说唱风格推荐使用 `16:9` 满铺无黑栏构图，底部居中奶油纸卡字幕条占 `y = 905..995`；前景站立贴纸人物鞋底应控制在 `y <= 885` 或左右分置避开正中字幕卡；
    - 节拍弹跳（`spring` 贴片弹出、轻点头律动）必须由确定性 BPM 公式（如 `BEAT_FRAMES = Math.round(fps * 60 / bpm)`）驱动，严禁任何非确定性计时器。
11. **风格 G 无缝转场重叠帧（Overlap Tail）与多边形波浪擦除规范**：
    - 主合成编排 `<Sequence>` 时，除尾幕外上一幕 `durationInFrames` 须延长 `TRANSITION_LEN = 14`（14 帧重叠），交由下一幕外层 `RapTransitionLayer` 在局部前 `0..14f` 完成波浪撕纸、速度线摇镜、雨幕叠化或大光斑闪切，杜绝黑帧闪现；所有幕内 `interpolate` 必须显式配置 `{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}` 防止延长帧越界；
    - `wavyWipeWhite` / `wavyWipePink` 推荐使用 CSS `clipPath: polygon(...)`（24 点平滑正弦波浪）裁切新幕容器，并在顶层叠加同步坐标 `<svg>` 绘制发光波浪切边，避免 SVG `<clipPath>` 与子层 `feMorphology` 滤镜嵌套冲突。

---

## 四、局部片段重渲与 `ffmpeg` 精确帧无损拼接模板

当成片已渲染完成、仅需精修某一幕局部动作时，无需浪费时间重渲整首 7000+ 帧，可按以下标准流精确替换局部视频段并完整保留原 AAC 音轨：

1. **选定安全接缝帧并局部渲染**：
   - 确保 `F_start` 所在帧画面在修改前后代码下像素完全一致（如放在未改动的上一幕/上一段落尾帧），`F_end` 覆盖修改幕及下一幕转场 `tail`。
   ```powershell
   npx remotion render <CompId> "out/patch.mp4" --frames=<F_start>-<F_end>
   ```
2. **核查原片与补丁流的像素格式及精确帧数**：
   - Remotion 以 JPEG 中间帧编码时，x264 默认输出通常为 `pix_fmt=yuvj420p`、`color_range=pc`、`color_space=bt470bg`。拼接前务必用 `ffprobe` 实测两者一致并读取补丁实际帧数 `N`（即 `F_end - F_start + 1`）：
   ```powershell
   ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,pix_fmt,color_range,color_space,r_frame_rate -of default=nw=1 "out/<成片>.mp4"
   ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,pix_fmt,color_range,color_space,r_frame_rate -of default=nw=1 "out/patch.mp4"
   ```
3. **三段精确帧拼接（`[0, F_start) + patch + [F_start + N, end)`）**：
   ```powershell
   ffmpeg -y -v error -i "out/<成片>.mp4" -i "out/patch.mp4" `
     -filter_complex "[0:v]trim=start_frame=0:end_frame=<F_start>,setpts=PTS-STARTPTS[v0];[1:v]setpts=PTS-STARTPTS[v1];[0:v]trim=start_frame=<F_start + N>,setpts=PTS-STARTPTS[v2];[v0][v1][v2]concat=n=3:v=1:a=0,format=yuvj420p[vout]" `
     -map "[vout]" -map 0:a -c:v libx264 -crf 18 -preset fast -pix_fmt yuvj420p -color_range pc -colorspace bt470bg -r 30 -c:a copy -movflags +faststart "out/<成片>.spliced.mp4"
   ```
4. **验收必查**：核对拼接后 `nb_frames` 与原片完全相等、`ffmpeg -v error -i ... -f null -` 退出码 `0`，并分别在 `F_start` 前后、补丁高潮与 `F_start + N` 接缝处抽取 3 张帧用 `read_file` 确认无色彩跳变与跳帧。
