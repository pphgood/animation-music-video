import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

const W = 1920;
const H = 1080;

/**
 * 风格 F · 手绘素描 / 极简线条涂鸦手书风（100% 纯代码 SVG 渲染）
 * 纯代码最佳范式：米白粗纹素描纸 + 12fps 颤动煮沸线（Boiling Lines）+ 灵动大头涂鸦手书 Q 版角色 + 唯独炽红/荧光黄双色点缀
 */
export const StyleF_SketchDoodle: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const boilSeed = Math.floor(rawFrame / 3) + 1;
  const heartBeat = 1 + Math.sin(rawFrame / 8) * 0.06;

  return (
    <AbsoluteFill style={{background: '#F7F3E9'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="sketchPaper" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} seed={14} stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0 0.28  0 0 0 0.14 -0.02" />
          </filter>
          <filter id="boilLine" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves={2} seed={boilSeed} result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale={3.6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="redGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="pencilHatch" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
            <line x1="0" y1="0" x2="0" y2="13" stroke="#222026" strokeWidth="2.2" opacity="0.46" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="#F7F3E9" />

        <g filter="url(#boilLine)" strokeLinecap="round" strokeLinejoin="round">
          {/* 手绘双道地平线 */}
          <path d="M 0 715 Q 640 704 1280 718 T 1920 708" fill="none" stroke="#1E1C22" strokeWidth={4} />
          <path d="M 0 726 Q 760 714 1920 722" fill="none" stroke="#1E1C22" strokeWidth={2} opacity={0.5} />

          {/* 背景自由涂鸦：小雨云、斜排线、情绪放射线 */}
          <g fill="none" stroke="#1E1C22" strokeWidth={3.2}>
            <path d="M 80 120 L 145 45 M 102 145 L 185 40 M 128 165 L 222 50 M 162 175 L 250 72" opacity={0.68} />
            <path d="M 590 155 Q 580 105 640 102 Q 675 60 750 78 Q 820 72 832 122 Q 862 152 810 168 L 615 168 Q 580 166 590 155 Z" fill="url(#pencilHatch)" />
            {[620, 658, 698, 740, 782].map((rx, i) => (
              <g key={i}>
                <line x1={rx} y1={188 + (i % 2) * 18} x2={rx - 14} y2={228 + (i % 2) * 18} strokeWidth={2.8} />
                <line x1={rx - 18} y1={250 + (i % 3) * 16} x2={rx - 30} y2={288 + (i % 3) * 16} strokeWidth={2.4} opacity={0.75} />
              </g>
            ))}
            <line x1={600} y1={415} x2={658} y2={395} strokeWidth={4.5} />
            <line x1={614} y1={452} x2={678} y2={454} strokeWidth={4.5} />
            <line x1={600} y1={492} x2={654} y2={508} strokeWidth={4.5} />

            <line x1={1320} y1={415} x2={1262} y2={395} strokeWidth={4.5} />
            <line x1={1306} y1={452} x2={1242} y2={454} strokeWidth={4.5} />
            <line x1={1320} y1={492} x2={1266} y2={508} strokeWidth={4.5} />
          </g>

          {/* 荧光黄高饱和手绘星星与情绪光边 */}
          <g>
            {[
              [215, 175, 1.05],
              [140, 315, 0.55],
              [960, 145, 0.72],
              [1330, 138, 1.0],
              [1315, 245, 0.58],
              [1745, 165, 1.08],
            ].map(([sx, sy, sc], i) => (
              <g key={i} transform={`translate(${sx} ${sy}) scale(${sc}) rotate(${i * 14})`}>
                <path
                  d="M 0 -46 L 13 -14 L 46 -12 L 20 10 L 29 44 L 0 24 L -29 44 L -20 10 L -46 -12 L -13 -14 Z"
                  fill="#FDE047"
                  stroke="#1E1C22"
                  strokeWidth={3.6}
                />
              </g>
            ))}
            {/* 荧光黄手绘能量外框（紧贴人物造型） */}
            <path d="M 215 390 Q 175 560 225 760 M 545 410 Q 585 570 540 760" fill="none" stroke="#FDE047" strokeWidth={18} opacity={0.72} />
            <path d="M 1385 410 Q 1345 570 1390 760 M 1715 390 Q 1755 560 1705 760" fill="none" stroke="#FDE047" strokeWidth={18} opacity={0.72} />
          </g>

          {/* ===== 左侧灵动大头涂鸦手书女孩（2.2 头身比例，极具 B 站手书 PV 灵魂） ===== */}
          <g transform="translate(380 860)" stroke="#1D1B22" strokeWidth={4.8}>
            {/* 短小简笔双腿 */}
            <path d="M -38 -110 L -38 0 M 36 -110 L 36 0" strokeWidth={6} />
            <ellipse cx={-32} cy={4} rx={20} ry={9} fill="#1D1B22" />
            <ellipse cx={42} cy={4} rx={20} ry={9} fill="#1D1B22" />
            {/* 宽松炭笔排线高领毛衣 */}
            <path d="M -78 -282 Q 0 -302 78 -282 L 106 -108 Q 0 -92 -104 -108 Z" fill="#FAF6EE" />
            <path d="M -78 -282 L -132 -140 L -90 -130 L -56 -225 Z" fill="#EFE9DC" />
            <path d="M 78 -282 L 136 -148 L 94 -135 L 58 -225 Z" fill="url(#pencilHatch)" />
            <path d="M -78 -275 Q -15 -195 -40 -102 L -104 -108 Z" fill="url(#pencilHatch)" stroke="none" />
            {/* 高领 */}
            <rect x={-36} y={-324} width={72} height={42} rx={10} fill="#FAF6EE" />
            {[-18, 0, 18].map((tx) => (
              <line key={tx} x1={tx} y1={-322} x2={tx} y2={-284} strokeWidth={2.8} />
            ))}
            {/* 灵动大圆脸 + 炭笔蓬松短发 */}
            <circle cx={0} cy={-428} r={106} fill="#FAF6EE" />
            {/* 凌乱蓬松发丝（炭笔外翘感） */}
            <path
              d="M -108 -410 Q -138 -455 -102 -512 Q -52 -570 36 -548 Q 112 -528 112 -450 Q 134 -420 100 -395 Q 72 -452 28 -446 Q -2 -478 -36 -444 Q -78 -448 -98 -388 Q -122 -384 -108 -410 Z"
              fill="#242129"
            />
            <path d="M -68 -502 Q 0 -536 66 -496" fill="none" stroke="#F7F3E9" strokeWidth={4} opacity={0.5} />
            {/* 手书感大眼睛 + 害羞斜线腮红 */}
            <ellipse cx={26} cy={-416} rx={9} ry={13} fill="#1D1B22" />
            <circle cx={29} cy={-421} r={3.5} fill="#FFF" stroke="none" />
            <ellipse cx={74} cy={-416} rx={8} ry={12} fill="#1D1B22" />
            <circle cx={76} cy={-421} r={3} fill="#FFF" stroke="none" />
            <path d="M 4 -390 L 12 -400 M 15 -390 L 23 -400" stroke="#EF233C" strokeWidth={3} opacity={0.7} />
            <path d="M 48 -386 Q 55 -378 62 -386" fill="none" strokeWidth={3.6} />
          </g>

          {/* ===== 右侧灵动大头涂鸦手书男孩（牵住发光红线） ===== */}
          <g transform="translate(1540 860)" stroke="#1D1B22" strokeWidth={4.8}>
            <path d="M -38 -110 L -38 0 M 36 -110 L 36 0" strokeWidth={6} />
            <ellipse cx={-42} cy={4} rx={20} ry={9} fill="#1D1B22" />
            <ellipse cx={32} cy={4} rx={20} ry={9} fill="#1D1B22" />
            {/* 宽松排线毛衣 */}
            <path d="M -76 -282 Q 0 -302 76 -282 L 96 -108 Q 0 -94 -94 -108 Z" fill="#FAF6EE" />
            <path d="M 14 -282 L 76 -282 L 96 -108 L 28 -102 Z" fill="url(#pencilHatch)" stroke="none" />
            {/* 伸出牵住红线的手 */}
            <path d="M -72 -255 L -152 -225 L -144 -188 L -64 -212 Z" fill="#F4EFE4" />
            <circle cx={-155} cy={-208} r={20} fill="#FAF6EE" />
            <rect x={-36} y={-324} width={72} height={42} rx={10} fill="#FAF6EE" />
            {[-18, 0, 18].map((tx) => (
              <line key={tx} x1={tx} y1={-322} x2={tx} y2={-284} strokeWidth={2.8} />
            ))}
            {/* 灵动大头 + 炸毛碎发 */}
            <circle cx={0} cy={-428} r={106} fill="#FAF6EE" />
            <path
              d="M 108 -414 Q 138 -460 100 -516 Q 50 -574 -38 -550 Q -114 -528 -110 -448 Q -132 -422 -96 -400 Q -62 -454 -18 -444 Q 14 -476 46 -444 Q 82 -446 98 -390 Q 124 -388 108 -414 Z"
              fill="#242129"
            />
            <ellipse cx={-26} cy={-416} rx={9} ry={13} fill="#1D1B22" />
            <circle cx={-29} cy={-421} r={3.5} fill="#FFF" stroke="none" />
            <ellipse cx={-74} cy={-416} rx={8} ry={12} fill="#1D1B22" />
            <circle cx={-76} cy={-421} r={3} fill="#FFF" stroke="none" />
            <path d="M -60 -382 L -44 -384" strokeWidth={3.8} />
          </g>

          {/* ===== 贯穿画面的发光炽红命运线 + 中心跳动红心 ===== */}
          <g filter="url(#redGlow)">
            <path
              d="M 0 618 Q 220 658 430 688 Q 560 704 645 612 Q 795 596 960 606 Q 1155 602 1385 650"
              fill="none"
              stroke="#EF233C"
              strokeWidth={6}
            />
            <g transform={`translate(960 562) scale(${heartBeat})`}>
              <path
                d="M 0 48 C -56 8 -70 -46 -29 -54 C -8 -58 0 -38 0 -24 C 0 -38 8 -58 29 -54 C 70 -46 56 8 0 48 Z"
                fill="#EF233C"
                stroke="#9B1126"
                strokeWidth={3.8}
              />
              <path d="M -28 -32 L -14 -14 M -18 -38 L -2 -18" stroke="#FFF1F2" strokeWidth={3.2} opacity={0.8} />
            </g>
          </g>
        </g>

        <rect width={W} height={H} filter="url(#sketchPaper)" opacity={0.48} style={{mixBlendMode: 'multiply'}} />
      </svg>
    </AbsoluteFill>
  );
};
