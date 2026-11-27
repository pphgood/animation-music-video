import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const W = 1920;
const H = 1080;

/**
 * 风格 G · 白边贴纸手账绘本风 / 旋律说唱卡点（100% 纯代码 SVG 渲染验证模板）
 * 核心工艺：无黑描边平涂 + SVG feMorphology 白色模切贴纸外框（~10px）+ 柔和投影
 * + 深靛蓝夜房×高饱和暖点缀 + 拟态 UI 融合（量杯/微信气泡）+ 奶油纸卡字幕条
 */
export const StyleG_StickerRap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bob = Math.sin(frame / 10) * 3.5;
  const waveShift = Math.sin(frame / 9) * 14;
  const cardSpring = spring({frame, fps, config: {damping: 14, stiffness: 160}});
  const cardScale = interpolate(cardSpring, [0, 1], [0.9, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blink = frame % 72 > 68 ? 0.15 : 1;

  return (
    <AbsoluteFill style={{background: '#1C2042'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          {/* 白色模切贴纸滤镜：扩大 150% 区域防裁切 + linear 阶跃抗锯齿 + 柔投影 */}
          <filter id="sgStickerBorder" x="-25%" y="-25%" width="150%" height="150%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="dilated" />
            <feGaussianBlur in="dilated" stdDeviation="0.6" result="smoothed" />
            <feComponentTransfer in="smoothed" result="solidMask">
              <feFuncA type="linear" slope="16" intercept="-6" />
            </feComponentTransfer>
            <feFlood floodColor="#FAF8F4" result="whiteFill" />
            <feComposite in="whiteFill" in2="solidMask" operator="in" result="whiteBorder" />
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#090C1F" floodOpacity="0.45" result="shadowed" />
            <feMerge>
              <feMergeNode in="shadowed" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="sgCardShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#090C1F" floodOpacity="0.42" />
          </filter>

          {/* 固定 seed 手账细布纹/纸肌理 */}
          <filter id="sgPaperWeave" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={3} seed={23} stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.94  0 0 0 0 0.92  0 0 0 0 0.98  0 0 0 0.14 -0.02" />
          </filter>

          <linearGradient id="sgWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B1F42" />
            <stop offset="68%" stopColor="#242954" />
            <stop offset="100%" stopColor="#2E325F" />
          </linearGradient>
          <radialGradient id="sgLampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE89E" stopOpacity={0.38} />
            <stop offset="55%" stopColor="#F5C756" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#F5C756" stopOpacity={0} />
          </radialGradient>
          <clipPath id="sgWindowClip">
            <rect x={92} y={76} width={520} height={470} rx={12} />
          </clipPath>
          <clipPath id="sgGaugeClip">
            <rect x={440} y={322} width={274} height={542} rx={22} />
          </clipPath>
        </defs>

        {/* ===== Layer 0: 深靛紫卧室墙面与木地板 ===== */}
        <rect width={W} height={H} fill="url(#sgWallGrad)" />
        {/* 极淡竖纹壁纸 */}
        {Array.from({length: 32}).map((_, i) => (
          <rect key={i} x={i * 60} y={0} width={28} height={770} fill="#FFFFFF" opacity={0.018} />
        ))}
        {/* 下方灰紫地板 & 圆地毯 */}
        <rect x={0} y={770} width={W} height={310} fill="#343359" />
        <ellipse cx={960} cy={900} rx={680} ry={115} fill="#443F6D" />
        <ellipse cx={960} cy={900} rx={580} ry={88} fill="#4F497A" opacity={0.6} />

        {/* ===== Layer 1: 左侧雨夜高窗 + 星星灯串 + 窗台萌物 ===== */}
        <g>
          <rect x={82} y={66} width={540} height={490} rx={18} fill="#141835" />
          <g clipPath="url(#sgWindowClip)">
            <rect x={92} y={76} width={520} height={470} fill="#253159" />
            {/* 远城高楼与暖窗 */}
            <rect x={110} y={240} width={96} height={310} fill="#18203F" />
            <rect x={218} y={190} width={114} height={360} fill="#1B2547" />
            <rect x={346} y={260} width={104} height={290} fill="#171E3B" />
            <rect x={464} y={210} width={120} height={340} fill="#1C264A" />
            {[
              [136, 275], [168, 275], [136, 320], [244, 230], [282, 230], [244, 280],
              [282, 330], [372, 300], [406, 300], [492, 250], [534, 250], [492, 310],
            ].map(([wx, wy], i) => (
              <rect key={i} x={wx} y={wy} width={16} height={22} rx={2} fill="#FFD972" opacity={0.88} />
            ))}
            {/* 窗外斜落雨丝 */}
            {Array.from({length: 28}).map((_, i) => {
              const rx = 100 + random(`sgrx-${i}`) * 500;
              const ry = ((random(`sgry-${i}`) * 470 + frame * 11) % 490) + 60;
              return (
                <line
                  key={i}
                  x1={rx}
                  y1={ry}
                  x2={rx - 10}
                  y2={ry + 28}
                  stroke="#9AB4E8"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  opacity={0.48}
                />
              );
            })}
            {/* 窗框十字 */}
            <rect x={346} y={76} width={12} height={470} fill="#161A38" />
            <rect x={92} y={310} width={520} height={12} fill="#161A38" />
          </g>
          {/* 顶部暖黄小灯串 */}
          <path d="M 82 105 Q 352 155 622 105" fill="none" stroke="#9AA4C8" strokeWidth={2.5} opacity={0.65} />
          {[140, 210, 280, 352, 424, 494, 564].map((lx, i) => {
            const ly = 108 + Math.sin(((lx - 82) / 540) * Math.PI) * 26;
            return (
              <g key={i}>
                <circle cx={lx} cy={ly} r={14} fill="#FFE282" opacity={0.28} />
                <circle cx={lx} cy={ly} r={6} fill="#FFF2B2" />
              </g>
            );
          })}
          {/* 窗帘与绑带 */}
          <rect x={68} y={62} width={68} height={510} rx={10} fill="#364272" />
          <rect x={568} y={62} width={68} height={510} rx={10} fill="#364272" />
          <rect x={64} y={336} width={76} height={14} rx={7} fill="#E6BC4C" />
          <rect x={564} y={336} width={76} height={14} rx={7} fill="#E6BC4C" />
          {/* 窗台柜与萌物（小鸭、仙人掌、白茉莉花瓶） */}
          <rect x={52} y={554} width={598} height={216} rx={10} fill="#3B3A63" />
          <rect x={44} y={544} width={614} height={24} rx={8} fill="#4D4C7A" />
          {/* 仙人掌 */}
          <g transform="translate(150 544)">
            <path d="M -22 -34 L 22 -34 L 16 0 L -16 0 Z" fill="#E67A68" />
            <rect x={-26} y={-40} width={52} height={10} rx={4} fill="#F29482" />
            <rect x={-10} y={-86} width={20} height={52} rx={10} fill="#66B87A" />
            <rect x={-24} y={-68} width={16} height={12} rx={6} fill="#66B87A" />
            <rect x={8} y={-74} width={16} height={12} rx={6} fill="#66B87A" />
          </g>
          {/* 小黄鸭 */}
          <g transform="translate(260 544)">
            <ellipse cx={0} cy={-16} rx={24} ry={16} fill="#FFD54F" />
            <circle cx={-10} cy={-36} r={14} fill="#FFD54F" />
            <ellipse cx={-22} cy={-35} rx={7} ry={4} fill="#FF8F40" />
            <circle cx={-13} cy={-39} r={2.3} fill="#2A2422" />
          </g>
          {/* 茉莉花瓶 */}
          <g transform="translate(362 544)">
            <rect x={-16} y={-42} width={32} height={42} rx={10} fill="#A7D8DE" />
            <path d="M 0 -42 L -10 -78 M 0 -42 L 10 -82" stroke="#5EA97A" strokeWidth={4} strokeLinecap="round" />
            <circle cx={-12} cy={-82} r={8} fill="#FFFFFF" />
            <circle cx={12} cy={-86} r={8} fill="#FFFFFF" />
            <circle cx={-12} cy={-82} r={2.5} fill="#FFE066" />
            <circle cx={12} cy={-86} r={2.5} fill="#FFE066" />
          </g>
        </g>

        {/* ===== Layer 2: 右侧书桌 + 软木手账墙 + 暖台灯 ===== */}
        <g>
          {/* 软木手账照片墙 */}
          <rect x={1150} y={136} width={660} height={310} rx={16} fill="#7B563E" />
          <rect x={1170} y={156} width={620} height={270} rx={10} fill="#A67856" />
          {/* 照片卡片与红线 */}
          <path d="M 1280 245 L 1460 290 L 1660 235" fill="none" stroke="#E8584F" strokeWidth={3.5} />
          <g transform="translate(1280 245) rotate(-6)">
            <rect x={-46} y={-54} width={92} height={108} rx={6} fill="#FAF6EE" />
            <rect x={-36} y={-44} width={72} height={70} rx={4} fill="#E4EDF5" />
            <circle cx={0} cy={-10} r={20} fill="#FFE6D2" />
            <path d="M -22 -14 Q -22 -36 0 -36 Q 22 -36 22 -14 L 22 6 L 14 6 L 14 -12 L -14 -12 L -14 6 L -22 6 Z" fill="#3A2218" />
            <circle cx={0} cy={-50} r={5} fill="#E8584F" />
          </g>
          <g transform="translate(1465 292) rotate(4)">
            <rect x={-56} y={-36} width={112} height={72} rx={4} fill="#FFE89E" />
            <text x={0} y={7} textAnchor="middle" fill="#3B2B22" fontSize={20} fontWeight={700} fontFamily="'PingFang SC','Microsoft YaHei',sans-serif">
              茉莉花香
            </text>
            <circle cx={0} cy={-30} r={5} fill="#E8584F" />
          </g>
          <g transform="translate(1660 235) rotate(5)">
            <rect x={-46} y={-54} width={92} height={108} rx={6} fill="#FAF6EE" />
            <rect x={-36} y={-44} width={72} height={70} rx={4} fill="#FDE8EE" />
            <circle cx={0} cy={-10} r={18} fill="#F79EB6" />
            <circle cx={0} cy={-50} r={5} fill="#E8584F" />
          </g>

          {/* 右侧书桌 */}
          <rect x={1180} y={536} width={640} height={24} rx={8} fill="#8C6046" />
          <rect x={1220} y={560} width={22} height={210} fill="#6E4A35" />
          <rect x={1756} y={560} width={22} height={210} fill="#6E4A35" />
          {/* 书桌台灯 + 外层柔焦光晕 */}
          <circle cx={1295} cy={438} r={150} fill="url(#sgLampGlow)" />
          <rect x={1268} y={524} width={54} height={12} rx={6} fill="#465282" />
          <path d="M 1295 524 L 1280 442 L 1312 426" fill="none" stroke="#5A669C" strokeWidth={8} strokeLinecap="round" />
          <path d="M 1282 418 L 1344 438 L 1326 462 L 1272 440 Z" fill="#F2C85B" />
          {/* 桌面叠书 & 小猫 */}
          <rect x={1620} y={518} width={96} height={18} rx={4} fill="#5C8BB8" />
          <rect x={1630} y={500} width={86} height={18} rx={4} fill="#E87A70" />
          <g transform="translate(1540 536)">
            <ellipse cx={0} cy={-18} rx={18} ry={18} fill="#B8C2D8" />
            <circle cx={0} cy={-40} r={15} fill="#B8C2D8" />
            <polygon points="-13,-48 -6,-62 -2,-50" fill="#B8C2D8" />
            <polygon points="13,-48 6,-62 2,-50" fill="#B8C2D8" />
            <circle cx={-5} cy={-41} r={2} fill="#231F20" />
            <circle cx={5} cy={-41} r={2} fill="#231F20" />
          </g>
        </g>

        {/* ===== Layer 3: 左侧巨型「心情值 45%」刻度量杯（贴纸外层 + 半透明液面） ===== */}
        <g transform="translate(0 0)">
          {/* 顶部小奶油标题贴纸 */}
          <g filter="url(#sgCardShadow)">
            <rect x={488} y={248} width={178} height={54} rx={12} fill="#FAF6EE" />
            <text x={577} y={284} textAnchor="middle" fill="#231F20" fontSize={28} fontWeight={800} fontFamily="'PingFang SC','Microsoft YaHei',sans-serif">
              心情值
            </text>
          </g>
          {/* 量杯透明底 */}
          <rect x={440} y={322} width={274} height={542} rx={22} fill="#2B315E" fillOpacity={0.62} />
          <g clipPath="url(#sgGaugeClip)">
            {/* 波浪粉色液体 */}
            <path
              d={`M 430 ${620 + Math.sin(frame / 12) * 5}
                  Q 505 ${606 + waveShift * 0.4} 578 ${620 - waveShift * 0.2}
                  T 725 ${618 + waveShift * 0.3}
                  L 725 875 L 430 875 Z`}
              fill="#F79EB6"
            />
            {/* 液体内部飘浮小心心 */}
            {[
              [496, 730], [610, 690], [560, 795], [655, 770],
            ].map(([hx, hy], i) => (
              <path
                key={i}
                d="M 0 10 C -11 2 -14 -9 -6 -11 C -2 -12 0 -7 0 -4 C 0 -7 2 -12 6 -11 C 14 -9 11 2 0 10 Z"
                transform={`translate(${hx} ${hy - ((frame * 0.8 + i * 25) % 45)})`}
                fill="#FFFFFF"
                opacity={0.72}
              />
            ))}
          </g>
          {/* 粗白圆角框与刻度 */}
          <rect x={440} y={322} width={274} height={542} rx={22} fill="none" stroke="#FAF8F4" strokeWidth={9} />
          {Array.from({length: 9}).map((_, i) => (
            <line
              key={i}
              x1={i % 2 === 0 ? 662 : 676}
              y1={372 + i * 54}
              x2={702}
              y2={372 + i * 54}
              stroke="#FAF8F4"
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          ))}
          {/* 红色 45% 胶囊数字 */}
          <rect x={534} y={564} width={96} height={42} rx={21} fill="#E64B4B" />
          <text x={582} y={593} textAnchor="middle" fill="#FFFFFF" fontSize={24} fontWeight={800} fontFamily="'PingFang SC','Microsoft YaHei',sans-serif">
            45%
          </text>
        </g>

        {/* ===== Layer 4: 白色模切贴纸层（泰迪熊 + 短发女孩 + 绿微信气泡） ===== */}
        <g filter="url(#sgStickerBorder)">
          {/* 泰迪熊贴纸 */}
          <g transform="translate(746 846)">
            <ellipse cx={0} cy={-38} rx={34} ry={38} fill="#C68652" />
            <ellipse cx={0} cy={-34} rx={18} ry={22} fill="#E6B284" />
            <circle cx={-32} cy={-16} r={14} fill="#C68652" />
            <circle cx={32} cy={-16} r={14} fill="#C68652" />
            <circle cx={-26} cy={-114} r={14} fill="#C68652" />
            <circle cx={26} cy={-114} r={14} fill="#C68652" />
            <circle cx={0} cy={-90} r={34} fill="#C68652" />
            <ellipse cx={0} cy={-82} rx={15} ry={11} fill="#F2CAA4" />
            <circle cx={0} cy={-86} r={4} fill="#3A2218" />
            <circle cx={-12} cy={-95} r={3.5} fill="#2B1C16" />
            <circle cx={12} cy={-95} r={3.5} fill="#2B1C16" />
          </g>

          {/* 短发女孩贴纸（无黑描边平涂 + 4 道发顶高光 + 白色茉莉发夹） */}
          <g transform={`translate(996 ${864 + bob})`}>
            {/* 双脚与牛仔裤 */}
            <ellipse cx={-24} cy={-4} rx={24} ry={11} fill="#1B203D" />
            <ellipse cx={24} cy={-4} rx={24} ry={11} fill="#1B203D" />
            <rect x={-42} y={-116} width={34} height={110} rx={10} fill="#3D5FA8" />
            <rect x={8} y={-116} width={34} height={110} rx={10} fill="#3D5FA8" />
            {/* 粉杏针织毛衣 + 白色圆领 */}
            <path d="M -56 -246 Q 0 -260 56 -246 L 64 -110 Q 0 -102 -64 -110 Z" fill="#F7A8B8" />
            <rect x={-38} y={-262} width={76} height={26} rx={13} fill="#FFFFFF" />
            {/* 左垂臂 & 右手举手机 */}
            <path d="M -52 -236 L -74 -152 L -50 -146 L -34 -222 Z" fill="#F7A8B8" />
            <circle cx={-60} cy={-144} r={14} fill="#FFE6D2" />
            <path d="M 48 -236 L 94 -202 L 82 -176 L 40 -208 Z" fill="#F7A8B8" />
            <circle cx={88} cy={-188} r={14} fill="#FFE6D2" />
            {/* 手持亮屏手机 */}
            <rect x={78} y={-246} width={48} height={82} rx={9} fill="#3A4773" />
            <rect x={84} y={-236} width={36} height={62} rx={5} fill="#EAF3FC" />
            <rect x={90} y={-226} width={22} height={12} rx={4} fill="#95EC69" />
            <rect x={90} y={-208} width={26} height={12} rx={4} fill="#FFFFFF" />

            {/* 齐耳内扣短发底层（实心饱满轮廓防颈部穿孔） */}
            <path
              d="M -94 -355 Q -102 -466 0 -468 Q 102 -466 94 -355 Q 94 -268 58 -254 Q 0 -244 -58 -254 Q -94 -268 -94 -355 Z"
              fill="#3A2218"
            />
            {/* 柔和颈部衔接 */}
            <rect x={-18} y={-280} width={36} height={32} rx={8} fill="#F2CEB4" />
            {/* 圆润脸庞 */}
            <rect x={-72} y={-416} width={144} height={148} rx={58} fill="#FFE6D2" />
            {/* 顶部碎刘海（高于眉毛，露出完整八字眉） */}
            <path
              d="M -78 -378 Q -74 -448 0 -450 Q 74 -448 78 -378 L 54 -388 L 32 -376 L 6 -388 L -22 -376 L -48 -388 Z"
              fill="#3A2218"
            />
            {/* 标志性 4 道发顶暖棕高光短竖线 */}
            {[-28, -10, 10, 28].map((hx, idx) => (
              <line key={idx} x1={hx} y1={-432} x2={hx + 2} y2={-412} stroke="#6E4530" strokeWidth={4} strokeLinecap="round" />
            ))}
            {/* 右侧白色五瓣茉莉花发夹 */}
            <g transform="translate(58 -384)">
              <ellipse cx={-12} cy={6} rx={10} ry={5} transform="rotate(-25 -12 6)" fill="#7AD19A" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg} cx={0} cy={-9} rx={6} ry={8} transform={`rotate(${deg})`} fill="#FFFFFF" />
              ))}
              <circle cx={0} cy={0} r={4.5} fill="#FFE066" />
            </g>
            {/* 情绪眉 + 深棕豆豆眼 + 粉腮红 + 轻抿小嘴 */}
            <path d="M -46 -356 Q -34 -364 -20 -358" fill="none" stroke="#3A2218" strokeWidth={5} strokeLinecap="round" />
            <path d="M 20 -358 Q 34 -364 46 -356" fill="none" stroke="#3A2218" strokeWidth={5} strokeLinecap="round" />
            <ellipse cx={-32} cy={-330} rx={8} ry={10 * blink} fill="#2A1B14" />
            <ellipse cx={32} cy={-330} rx={8} ry={10 * blink} fill="#2A1B14" />
            <circle cx={-34} cy={-334} r={2.8 * blink} fill="#FFFFFF" />
            <circle cx={30} cy={-334} r={2.8 * blink} fill="#FFFFFF" />
            <ellipse cx={-48} cy={-306} rx={16} ry={9} fill="#F69BA6" opacity={0.72} />
            <ellipse cx={48} cy={-306} rx={16} ry={9} fill="#F69BA6" opacity={0.72} />
            <path d="M -8 -294 Q 0 -289 8 -294" fill="none" stroke="#A65E58" strokeWidth={4} strokeLinecap="round" />
          </g>

          {/* 右侧悬浮微信绿气泡贴纸 */}
          <g transform={`translate(1310 ${560 - bob * 0.6})`}>
            <rect x={0} y={0} width={286} height={74} rx={18} fill="#95EC69" />
            <polygon points="0,30 -18,38 0,48" fill="#95EC69" />
            <text x={143} y={46} textAnchor="middle" fill="#1F2421" fontSize={28} fontWeight={700} fontFamily="'PingFang SC','Microsoft YaHei',sans-serif">
              身上茉莉花的香
            </text>
          </g>
        </g>

        {/* ===== Layer 5: 顶部微倾星星奶油标题卡 & 底部奶油纸卡字幕条（无黑边栏） ===== */}
        <g transform="translate(960 112) rotate(-1.5)" filter="url(#sgCardShadow)">
          <rect x={-268} y={-40} width={536} height={82} rx={10} fill="#D8DFEC" transform="translate(0 7)" />
          <rect x={-268} y={-40} width={536} height={82} rx={10} fill="#FAF6EE" />
          <path
            d="M 0 -20 L 6 -6 L 21 -6 L 9 3 L 13 18 L 0 9 L -13 18 L -9 3 L -21 -6 L -6 -6 Z"
            transform="translate(-214 1)"
            fill="#FFD447"
          />
          <text x={24} y={13} textAnchor="middle" fill="#231F20" fontSize={36} fontWeight={800} fontFamily="'PingFang SC','Microsoft YaHei',sans-serif">
            白边贴纸手账风 · 风格 G
          </text>
        </g>

        <g transform={`translate(960 956) scale(${cardScale})`} filter="url(#sgCardShadow)">
          <rect x={-420} y={-40} width={840} height={80} rx={10} fill="#DDD4C2" transform="translate(0 6)" />
          <rect x={-420} y={-40} width={840} height={80} rx={10} fill="#FAF6EE" />
          <text x={0} y={14} textAnchor="middle" fill="#231F20" fontSize={40} fontWeight={800} fontFamily="'PingFang SC','Microsoft YaHei',sans-serif">
            她留短发淡的妆 身上茉莉花的香
          </text>
        </g>

        {/* 全屏固定 seed 织物纸纹叠层 */}
        <rect width={W} height={H} filter="url(#sgPaperWeave)" opacity={0.48} style={{mixBlendMode: 'overlay'}} />
      </svg>
    </AbsoluteFill>
  );
};
