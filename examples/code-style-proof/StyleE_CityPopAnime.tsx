import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

const W = 1920;
const H = 1080;

/**
 * 风格 E · 90s 日系 City Pop / 霓虹逆光剪影电影风（100% 纯代码 SVG 渲染）
 * 工程实证结论：纯代码做 90s City Pop，最惊艳、零违和的范式是
 * 「极致品红紫霞海岸公路 + 柔焦路灯 Halation + 35mm 胶片噪点 + 唯美霓虹逆光轮廓剪影人物（带暖粉/青蓝高光 Rim Light）」！
 */
export const StyleE_CityPopAnime: React.FC = () => {
  const f = useCurrentFrame();
  const wind = Math.sin(f / 12) * 10;

  return (
    <AbsoluteFill style={{background: '#16102E'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="cpSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26215A" />
            <stop offset="40%" stopColor="#7C448F" />
            <stop offset="76%" stopColor="#E67A93" />
            <stop offset="100%" stopColor="#FFC196" />
          </linearGradient>
          <linearGradient id="cpSea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C46E9B" />
            <stop offset="46%" stopColor="#4D4886" />
            <stop offset="100%" stopColor="#1D3359" />
          </linearGradient>
          <radialGradient id="cpSunGlow">
            <stop offset="0%" stopColor="#FFF5D6" stopOpacity={0.92} />
            <stop offset="35%" stopColor="#F472B6" stopOpacity={0.42} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="cpLampHalo">
            <stop offset="0%" stopColor="#FFF7D6" stopOpacity={0.95} />
            <stop offset="32%" stopColor="#FDBA74" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#C084FC" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="cpLampCone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#C084FC" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rimPink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <filter id="film35mm" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={31} stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.70  0 0 0 0 0.96  0 0 0 0.14 -0.02" />
          </filter>
          <filter id="neonBloom" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== 天空 + 落日柔焦晕影 + 东京湾霓虹天际线 ===== */}
        <rect x={0} y={0} width={W} height={365} fill="url(#cpSky)" />
        <circle cx={420} cy={355} r={290} fill="url(#cpSunGlow)" />
        <path d="M 1200 360 Q 1470 278 1740 292 L 1920 258 L 1920 365 L 1200 365 Z" fill="#2D3161" />

        {/* 远处发光都市剪影 */}
        <g>
          {Array.from({length: 38}).map((_, i) => {
            const bx = 70 + i * 44;
            const bw = 24 + (i % 4) * 10;
            const bh = 24 + Math.floor(random(`cpb-${i}`) * 88);
            return (
              <g key={i}>
                <rect x={bx} y={362 - bh} width={bw} height={bh} fill="#231D48" />
                {Array.from({length: 4}).map((_, wi) => (
                  <rect
                    key={wi}
                    x={bx + 4 + (wi % 2) * 10}
                    y={362 - bh + 8 + Math.floor(wi / 2) * 14}
                    width={5}
                    height={6}
                    fill={wi % 3 === 0 ? '#67E8F9' : '#FEF08A'}
                    opacity={random(`cpw-${i}-${wi}`) > 0.34 ? 0.92 : 0.14}
                  />
                ))}
              </g>
            );
          })}
        </g>

        {/* ===== 紫粉闪烁海面 ===== */}
        <rect x={0} y={360} width={W} height={720} fill="url(#cpSea)" />
        {Array.from({length: 36}).map((_, i) => {
          const wy = 376 + i * 15;
          const ww = (260 - i * 4.5) * (0.65 + 0.35 * Math.sin(f / 14 + i));
          const wx = 420 + Math.sin(i * 1.9 + f / 18) * 75 - ww / 2;
          return (
            <rect
              key={i}
              x={wx}
              y={wy}
              width={Math.max(26, ww)}
              height={4.5}
              rx={2.2}
              fill={i % 3 === 0 ? '#FFF1F2' : '#FBCFE8'}
              opacity={0.82 - i * 0.018}
            />
          );
        })}

        {/* 右侧复古山崖与发光路灯排 */}
        <path d="M 1920 150 Q 1785 240 1745 365 Q 1715 445 1920 550 Z" fill="#172745" />
        <g transform="translate(1735 122)">
          <polygon points="-22,12 22,12 185,375 -155,375" fill="url(#cpLampCone)" />
          <path d="M 185 450 L 185 35 Q 185 0 110 0 L -8 6" fill="none" stroke="#1E203D" strokeWidth={11} strokeLinecap="round" />
          <circle cx={-8} cy={12} r={88} fill="url(#cpLampHalo)" />
          <ellipse cx={-8} cy={12} rx={22} ry={8} fill="#FFFBEB" />
        </g>

        {/* 透视公路与钢制海岸护栏 */}
        <polygon points="0,815 1920,475 1920,1080 0,1080" fill="#1F2342" />
        <line x1={0} y1={955} x2={1920} y2={610} stroke="#818CF8" strokeWidth={5} opacity={0.35} />
        <g stroke="#141028" strokeWidth={3}>
          {[140, 420, 720, 1040, 1360, 1660, 1880].map((px, i) => (
            <rect key={i} x={px} y={810 - i * 52} width={22} height={155} fill="#363B63" />
          ))}
          <polygon points="0,790 1920,450 1920,520 0,868" fill="#636B96" />
          <polygon points="0,828 1920,486 1920,520 0,868" fill="#444B73" />
          <line x1={0} y1={792} x2={1920} y2={452} stroke="#FBCFE8" strokeWidth={3} opacity={0.72} />
        </g>

        {/* ===== 唯美 90s 逆光电影剪影恋人（带品红/晚霞轮廓辉光 Rim Light，电影质感拉满） ===== */}
        {/* 男主剪影（斜靠护栏 + 蓬松逆光微风短发 + 挂脖耳机） */}
        <g transform="translate(835 970)">
          {/* 暖粉逆光边缘辉光 */}
          <g fill="none" stroke="url(#rimPink)" strokeWidth={7} opacity={0.78} filter="url(#neonBloom)">
            <path d={`M -48 -565 Q -72 -628 -20 -652 Q 20 -676 58 -644 Q 90 ${-632 + wind * 0.4} 78 -598`} />
            <path d="M -46 -496 L -112 -435 L -134 -275 L -48 -232" />
            <path d="M -48 -232 L -90 115" />
          </g>
          {/* 深紫夜色主体剪影 */}
          <path
            d={`M -48 -565 Q -72 -628 -20 -652 Q 20 -676 58 -644 Q 90 ${-632 + wind * 0.4} 78 -598 Q 52 -606 42 -582 L 52 -558 L 40 -544 Q 38 -518 22 -514 L 38 -496 L 104 -438 L 118 -272 L 46 -232 L 88 115 L 18 115 L -6 -108 L -34 115 L -92 115 L -54 -232 L -134 -275 L -112 -435 L -46 -496 L -18 -516 Q -40 -528 -48 -565 Z`}
            fill="#16132B"
          />
          {/* 挂脖耳机微反光轮廓 */}
          <ellipse cx={-34} cy={-478} rx={16} ry={22} fill="#2A244A" stroke="#F472B6" strokeWidth={2.5} opacity={0.9} />
          <ellipse cx={34} cy={-478} rx={16} ry={22} fill="#2A244A" stroke="#67E8F9" strokeWidth={2.5} opacity={0.9} />
        </g>

        {/* 女主剪影（靠护栏回望 + 随风扬起的长风衣与飘逸短发） */}
        <g transform="translate(1155 965)">
          <g fill="none" stroke="url(#rimPink)" strokeWidth={7} opacity={0.82} filter="url(#neonBloom)">
            <path d={`M -34 -562 Q -10 -614 34 -596 Q 74 -580 ${106 + wind} -508`} />
            <path d="M -44 -465 L -108 -402 L -120 -170" />
            <path d={`M 36 -465 L 102 -395 L ${172 + wind * 1.4} -142`} />
          </g>
          <path
            d={`M -34 -562 Q -10 -614 34 -596 Q 74 -580 ${106 + wind} -508 Q 56 -488 26 -500 L 36 -465 L 102 -395 L ${172 + wind * 1.4} -142 L 62 -134 L 44 -238 L 62 120 L 8 120 L -4 -96 L -28 120 L -74 120 L -46 -152 L -120 -170 L -108 -402 L -44 -465 L -22 -498 Q -42 -512 -48 -532 L -40 -550 Z`}
            fill="#16132B"
          />
          <ellipse cx={-26} cy={-452} rx={14} ry={19} fill="#2A244A" stroke="#FBCFE8" strokeWidth={2.5} />
          <ellipse cx={26} cy={-452} rx={14} ry={19} fill="#2A244A" stroke="#67E8F9" strokeWidth={2.5} />
        </g>

        {/* 2.35:1 电影上下黑边遮幅 */}
        <rect x={0} y={0} width={W} height={94} fill="#07050F" />
        <rect x={0} y={H - 94} width={W} height={94} fill="#07050F" />

        {/* 35mm 胶片噪点覆层 */}
        <rect width={W} height={H} filter="url(#film35mm)" opacity={0.4} style={{mixBlendMode: 'screen'}} />
      </svg>
    </AbsoluteFill>
  );
};
