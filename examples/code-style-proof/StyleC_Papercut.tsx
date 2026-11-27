import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

const W = 1920;
const H = 1080;

/**
 * 风格 C · 层叠纸雕 / 立体绘本剪纸风（100% 纯代码 SVG 渲染验证模板）
 * 核心工艺：5 层 Z 轴纸片景深 + SVG feDropShadow 立体落影 + 暖色背光透纸辉光 + 棉纸微纤维肌理 + 15fps 轻定格步进感
 */
export const StyleC_Papercut: React.FC = () => {
  // 15fps 轻定格手作韵律（每 2 帧步进一次）
  const rawFrame = useCurrentFrame();
  const f = Math.floor(rawFrame / 2) * 2;
  const scarfWave = Math.sin(f / 14) * 14;
  const waveShift = Math.sin(f / 20) * 16;

  return (
    <AbsoluteFill style={{background: '#09142B'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          {/* 多层纸片真实立体阴影 */}
          <filter id="pcShadowDeep" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#030712" floodOpacity="0.72" />
          </filter>
          <filter id="pcShadowSoft" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#050C1D" floodOpacity="0.62" />
          </filter>
          <filter id="pcShadowWarm" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1A1120" floodOpacity="0.52" />
          </filter>
          {/* 细腻手工棉纸纤维肌理 */}
          <filter id="cottonPaper" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={19} stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.96  0 0 0 0 0.93  0 0 0 0 0.87  0 0 0 0.24 -0.06" />
          </filter>

          {/* 底层暖逆光夜空 */}
          <linearGradient id="pcSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0C1B3D" />
            <stop offset="58%" stopColor="#1B325F" />
            <stop offset="86%" stopColor="#6E5A68" />
            <stop offset="100%" stopColor="#FCD394" />
          </linearGradient>
          {/* 镂空月亮背光光晕 */}
          <radialGradient id="pcMoonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7D6" stopOpacity={0.95} />
            <stop offset="40%" stopColor="#FDBA74" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#FDBA74" stopOpacity={0} />
          </radialGradient>
          {/* 水平暖逆光 */}
          <radialGradient id="pcHorizonGlow" cx="50%" cy="55%" r="52%">
            <stop offset="0%" stopColor="#FFF4CC" stopOpacity={0.85} />
            <stop offset="42%" stopColor="#FDBA74" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#1B325F" stopOpacity={0} />
          </radialGradient>
          {/* 人物暖纸渐变 */}
          <linearGradient id="paperCoatBoy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F7E5C8" />
            <stop offset="100%" stopColor="#C8A27A" />
          </linearGradient>
          <linearGradient id="paperDressGirl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF0DC" />
            <stop offset="100%" stopColor="#D6AE8E" />
          </linearGradient>
        </defs>

        {/* ===== Layer 0：暖背光夜空 + 星点 + 发光镂空弯月 ===== */}
        <rect width={W} height={H} fill="url(#pcSky)" />
        <rect width={W} height={700} fill="url(#pcHorizonGlow)" />
        {Array.from({length: 56}).map((_, i) => {
          const sx = 120 + random(`pcsx-${i}`) * (W - 240);
          const sy = 70 + random(`pcsy-${i}`) * 410;
          const r = 1.6 + random(`pcsr-${i}`) * 3.2;
          const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f / 14 + i));
          return <circle key={i} cx={sx} cy={sy} r={r} fill="#FFF3C4" opacity={tw} />;
        })}

        {/* 背光大弯月 */}
        <circle cx={1210} cy={255} r={240} fill="url(#pcMoonGlow)" />
        <path
          d="M 1168 135 A 118 118 0 1 1 1142 352 A 92 92 0 1 0 1168 135 Z"
          fill="#FFF6D6"
          filter="url(#pcShadowWarm)"
        />

        {/* ===== Layer 1：纸雕云朵（多片重叠投影） ===== */}
        <g filter="url(#pcShadowSoft)">
          <path
            d="M 140 245 Q 190 190 270 205 Q 320 135 420 165 Q 500 115 585 170 Q 670 155 720 215 Q 785 215 805 248 Z"
            fill="#6E788E"
          />
          <path
            d="M 175 268 Q 250 220 345 232 Q 430 185 525 225 Q 610 215 660 268 Z"
            fill="#8F96A6"
          />
          <path
            d="M 1225 280 Q 1300 220 1395 235 Q 1475 150 1595 190 Q 1680 155 1775 220 L 1820 280 Z"
            fill="#7D8394"
          />
          <path
            d="M 1310 302 Q 1400 250 1505 265 Q 1595 222 1715 270 L 1790 302 Z"
            fill="#A69FA3"
          />
          <path d="M 980 315 Q 1035 275 1095 292 Q 1150 278 1185 315 Z" fill="#8B8D9B" />
        </g>

        {/* ===== Layer 2：远方纸雕群山 ===== */}
        <g filter="url(#pcShadowSoft)">
          <path
            d="M 1080 570 L 1220 492 L 1320 520 L 1475 430 L 1605 486 L 1720 420 L 1860 475 L 1860 590 L 1080 590 Z"
            fill="#475573"
          />
          <path
            d="M 1270 580 L 1430 495 L 1560 535 L 1710 462 L 1860 522 L 1860 600 L 1270 600 Z"
            fill="#2E3D5C"
          />
        </g>

        {/* ===== Layer 3：6 层叠加纸雕海浪（明暗切边 + 立体落影） ===== */}
        {[
          {y: 562, c: '#86B8B6', hi: '#FFF2CC', amp: 14, dir: 1},
          {y: 618, c: '#5B9EA6', hi: '#C2E6E2', amp: 18, dir: -1},
          {y: 682, c: '#3B7D91', hi: '#8FD0D4', amp: 20, dir: 1},
          {y: 752, c: '#265B7A', hi: '#60A8C2', amp: 22, dir: -1},
          {y: 830, c: '#193E60', hi: '#3C7BA3', amp: 24, dir: 1},
          {y: 912, c: '#102847', hi: '#27537A', amp: 20, dir: -1},
        ].map((w, wi) => {
          const sx = waveShift * w.dir * (0.5 + wi * 0.14);
          const d = `M -120 ${w.y}
            Q ${220 + sx} ${w.y - w.amp} ${540 + sx} ${w.y + 6}
            T ${1180 + sx} ${w.y - 4}
            T ${1820 + sx} ${w.y + 8}
            L 2040 ${w.y} L 2040 ${H + 80} L -120 ${H + 80} Z`;
          return (
            <g key={wi} filter="url(#pcShadowSoft)">
              <path d={d} fill={w.c} />
              <path
                d={`M -120 ${w.y + 2} Q ${220 + sx} ${w.y - w.amp + 2} ${540 + sx} ${w.y + 8} T ${1180 + sx} ${w.y - 2} T ${1820 + sx} ${w.y + 10}`}
                fill="none"
                stroke={w.hi}
                strokeWidth={3}
                opacity={0.78}
              />
            </g>
          );
        })}

        {/* ===== Layer 4：左侧纸雕海崖 + 牵手剪纸绘本恋人 ===== */}
        <g filter="url(#pcShadowDeep)">
          {/* 崖面立体厚度 */}
          <path d="M 40 725 Q 480 695 855 795 L 745 1040 L 40 1040 Z" fill="#13223B" />
          {/* 崖顶深蓝草坡 */}
          <path d="M 40 725 Q 470 688 855 795 Q 690 882 410 892 L 40 845 Z" fill="#234369" />
          <path d="M 40 725 Q 470 688 855 795" fill="none" stroke="#8CC2D8" strokeWidth={3} opacity={0.65} />

          {/* 人物投向坡面的暖背光长投影 */}
          <polygon points="448,798 492,798 310,872 245,862" fill="#091326" opacity={0.55} />
          <polygon points="622,808 666,808 480,884 420,874" fill="#091326" opacity={0.55} />

          {/* 男主：修长纸艺绘本剪影 + 飘扬围巾 */}
          <g transform="translate(475 798)" filter="url(#pcShadowWarm)">
            {/* 飘舞纸雕围巾 */}
            <path
              d={`M -6 -246 Q -65 ${-238 + scarfWave * 0.4} -135 ${-215 + scarfWave} L -128 ${-192 + scarfWave} Q -62 ${-216 + scarfWave * 0.4} -2 -224 Z`}
              fill="#E7C9A5"
            />
            {/* 修长双腿 */}
            <path d="M -22 -118 L -18 -6 L -34 2 L -4 2 L -2 -118 Z" fill="#C9A37C" />
            <path d="M 4 -118 L 10 -6 L -2 2 L 28 2 L 24 -118 Z" fill="#DEC09C" />
            {/* 暖白毛绒纸大衣 */}
            <path d="M -32 -232 Q 0 -244 34 -226 L 44 -106 Q 4 -96 -40 -106 Z" fill="url(#paperCoatBoy)" />
            {/* 牵手伸出的手臂 */}
            <path d="M 24 -204 L 78 -140 L 66 -128 L 16 -184 Z" fill="#EBD3B5" />
            {/* 围巾领圈 */}
            <rect x={-26} y={-246} width={54} height={24} rx={11} fill="#F2DEC1" />
            {/* 绘本侧颜头与碎发 */}
            <circle cx={4} cy={-282} r={34} fill="#FBE6CC" />
            <path
              d="M -32 -284 Q -36 -324 8 -324 Q 44 -322 40 -286 Q 28 -302 12 -298 Q -4 -304 -14 -292 L -26 -272 Z"
              fill="#DFB68A"
            />
            <path d="M -32 -296 L -48 -314 L -24 -308 L -34 -332 L -8 -316 L 14 -336 L 14 -314 Z" fill="#E9C69F" />
          </g>

          {/* 女主：纸艺百褶长裙 + 迎风飘逸发丝与围巾 */}
          <g transform="translate(648 806)" filter="url(#pcShadowWarm)">
            {/* 飘扬围巾 */}
            <path
              d={`M 16 -226 Q 82 ${-232 - scarfWave * 0.4} 152 ${-218 - scarfWave} L 146 ${-196 - scarfWave} Q 78 ${-210 - scarfWave * 0.4} 10 -208 Z`}
              fill="#F2D7BA"
            />
            {/* 双腿 */}
            <path d="M -16 -90 L -14 -6 L -28 2 L 0 2 L 0 -90 Z" fill="#C9A27E" />
            <path d="M 8 -90 L 14 -6 L 2 2 L 30 2 L 24 -90 Z" fill="#DFBC9A" />
            {/* 随风扬起的多层纸雕大裙摆 */}
            <path
              d={`M -28 -216 Q 0 -228 28 -214 L ${128 + scarfWave * 0.3} -82 Q 48 -58 -48 -84 Z`}
              fill="#C79E82"
            />
            <path
              d={`M -26 -216 Q 0 -226 24 -212 L ${102 + scarfWave * 0.25} -86 Q 36 -66 -42 -86 Z`}
              fill="url(#paperDressGirl)"
            />
            {/* 伸手相牵 */}
            <path d="M -20 -196 L -102 -136 L -90 -122 L -10 -178 Z" fill="#FBE7CE" />
            {/* 围巾 */}
            <rect x={-22} y={-230} width={48} height={20} rx={9} fill="#FFF2E0" />
            {/* 绘本侧颜头 + 飘逸纸雕长发 */}
            <circle cx={-4} cy={-262} r={32} fill="#FDEBD4" />
            <path
              d={`M -28 -276 Q -10 -308 26 -292 Q 66 ${-276 - scarfWave * 0.25} 102 ${-266 - scarfWave * 0.4} Q 68 ${-244 - scarfWave * 0.2} 34 -244 Q 14 -258 -16 -266 Z`}
              fill="#EAC59F"
            />
          </g>

          {/* 右侧纸雕礁石与草坡 */}
          <path d="M 1120 1040 Q 1460 880 1890 825 L 1890 1040 Z" fill="#1C365A" />
          <path d="M 1120 1040 Q 1460 880 1890 825" fill="none" stroke="#75A9C4" strokeWidth={3} opacity={0.55} />
        </g>

        {/* ===== Layer 5：最前景剧场镂空纸雕画框 + 剪纸枝叶 ===== */}
        <g filter="url(#pcShadowDeep)">
          <path
            d="M 0 0 H 1920 V 1080 H 0 Z
               M 76 62 H 1844 V 1018 H 76 Z"
            fill="#0D1933"
            fillRule="evenodd"
          />
          <rect x={76} y={62} width={1768} height={956} fill="none" stroke="#2D4A73" strokeWidth={3} />
          {/* 左下角剪纸花草剪影 */}
          <path d="M 60 1030 Q 120 820 260 1030 Z" fill="#0B162C" />
          <path d="M 155 960 Q 195 855 240 880 Q 205 935 170 985 Z" fill="#5D7D7E" />
          <path d="M 225 990 Q 268 890 315 920 Q 275 975 240 1015 Z" fill="#47666F" />
          {/* 右下角剪纸蕨叶 */}
          <path d="M 1860 1030 Q 1780 780 1640 1030 Z" fill="#0B162C" />
          <path d="M 1760 950 Q 1715 835 1665 860 Q 1705 920 1745 970 Z" fill="#567577" />
          <circle cx={238} cy={878} r={7} fill="#F4B69C" />
          <circle cx={312} cy={918} r={6} fill="#FDE68A" />
        </g>

        {/* 全屏手工棉纸纹理叠层 */}
        <rect width={W} height={H} filter="url(#cottonPaper)" opacity={0.38} style={{mixBlendMode: 'overlay'}} />
      </svg>
    </AbsoluteFill>
  );
};
