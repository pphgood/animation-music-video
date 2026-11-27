import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

const W = 1920;
const H = 1080;

/**
 * 风格 D · 国风写意水墨 / 东方剪影留白风（100% 纯代码 SVG 渲染）
 * 纯代码最佳范式：宣纸底纹 + 50% 留白 + 湿墨滤镜远山 + 优雅写意水墨人物剪影 + 朱砂红油纸伞/梅瓣/落款红印
 */
export const StyleD_InkWash: React.FC = () => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 26) * 10;

  return (
    <AbsoluteFill style={{background: '#F3EEE2'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="xuanPaper" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} seed={7} stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 0.17 -0.02" />
          </filter>
          <filter id="inkBleed" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={3} seed={3} result="turb" />
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={24} xChannelSelector="R" yChannelSelector="G" result="disp" />
            <feGaussianBlur in="disp" stdDeviation="4.5" />
          </filter>
          <filter id="inkSoft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <linearGradient id="inkSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5F0E3" />
            <stop offset="68%" stopColor="#ECE6D6" />
            <stop offset="100%" stopColor="#E3DCC8" />
          </linearGradient>
          <linearGradient id="inkMtnFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6D7686" stopOpacity={0.52} />
            <stop offset="100%" stopColor="#EAE4D5" stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="inkMtnMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#262F3F" stopOpacity={0.84} />
            <stop offset="72%" stopColor="#525D6F" stopOpacity={0.34} />
            <stop offset="100%" stopColor="#E8E2D2" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="waterMist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#353E4F" stopOpacity={0.38} />
            <stop offset="48%" stopColor="#858E9D" stopOpacity={0.14} />
            <stop offset="100%" stopColor="#F3EEE2" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="lanternWarm">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.95} />
            <stop offset="42%" stopColor="#F59E0B" stopOpacity={0.38} />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#inkSky)" />

        {/* 淡墨朦胧远月 */}
        <circle cx={680} cy={220} r={66} fill="#FFFDF7" opacity={0.85} filter="url(#inkSoft)" />

        {/* 远山淡墨晕染 */}
        <g filter="url(#inkBleed)">
          <path
            d="M -40 620 Q 180 400 430 475 Q 670 538 940 430 Q 1120 370 1300 468 Q 1580 508 1830 405 L 1960 440 L 1960 660 L -40 660 Z"
            fill="url(#inkMtnFar)"
          />
          <path
            d="M -40 640 Q 140 482 360 538 Q 590 595 820 512 Q 980 558 1160 612 L -40 660 Z"
            fill="url(#inkMtnMid)"
          />
          <path d="M 1520 630 Q 1710 468 1960 512 L 1960 650 Z" fill="url(#inkMtnMid)" opacity={0.74} />
        </g>

        {/* 湖面柔雾与倒影 */}
        <g transform="translate(0 1245) scale(1 -0.64)" filter="url(#inkSoft)" opacity={0.46}>
          <path d="M -40 640 Q 140 482 360 538 Q 590 595 820 512 Q 980 558 1160 612 L -40 660 Z" fill="#283040" />
        </g>
        <rect x={0} y={620} width={W} height={360} fill="url(#waterMist)" />
        {/* 一叶极简远舟水墨剪影 */}
        <g transform="translate(460 725)" opacity={0.72}>
          <path d="M -68 0 Q 0 18 76 -4 Q 44 10 -68 0 Z" fill="#2A3240" />
          <path d="M -22 -1 Q 0 -22 24 -1 Z" fill="#3B4454" />
        </g>

        {/* 水墨石拱桥 + 倒影 + 暖光纸灯笼 */}
        <g transform="translate(1060 725)">
          <g transform="translate(0 155) scale(1 -0.78)" opacity={0.32} filter="url(#inkSoft)">
            <path d="M 0 115 L 250 115 Q 340 42 465 42 Q 590 42 680 115 L 880 115 L 880 165 L 580 165 A 120 115 0 0 0 350 165 L 0 165 Z" fill="#323846" />
          </g>
          <path
            d="M -40 115 L 245 106 Q 345 28 465 28 Q 585 28 690 106 L 900 115 L 900 162 L 582 162 A 120 116 0 0 0 348 162 L -40 162 Z"
            fill="#5E6470"
            stroke="#22252E"
            strokeWidth={2.5}
          />
          <path d="M 245 106 Q 345 28 465 28 Q 585 28 690 106" fill="none" stroke="#1E2028" strokeWidth={5.5} />
          <g transform="translate(215 72)">
            <circle cx={0} cy={14} r={110} fill="url(#lanternWarm)" />
            <rect x={-15} y={-2} width={30} height={38} rx={4} fill="#FDE68A" stroke="#5B3A18" strokeWidth={2.2} />
            <path d="M -22 -2 L 0 -17 L 22 -2 Z" fill="#3B2B22" />
            <rect x={-17} y={36} width={34} height={5} fill="#3B2B22" />
          </g>
        </g>

        {/* ===== 桥上写意水墨双人剪影（无生硬细节，靠衣袂曲线与朱砂红伞封神） ===== */}
        <g transform="translate(1525 752)">
          {/* 男主：飘逸墨韵书生剪影 */}
          <g transform="translate(68 0)">
            <path
              d={`M -34 -226 Q 0 -240 36 -224 L ${68 + sway * 0.5} 6 Q 10 14 -48 4 Z`}
              fill="#222733"
            />
            {/* 迎风衣带 */}
            <path d={`M 32 -168 Q 84 ${-130 + sway} 118 ${-92 + sway * 1.2}`} fill="none" stroke="#2A303E" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
            <path d="M -32 -218 Q -58 -155 -44 -96 L -12 -118 Z" fill="#181C26" />
            {/* 头部与束发高冠剪影 */}
            <circle cx={-4} cy={-264} r={21} fill="#222733" />
            <path d="M -6 -284 L 4 -312 L 20 -306 L 14 -280 Z" fill="#181C26" />
            <path d={`M 16 -292 Q 46 ${-286 + sway * 0.4} 72 ${-268 + sway * 0.8}`} fill="none" stroke="#222733" strokeWidth={4} strokeLinecap="round" />
          </g>

          {/* 女主：淡青墨韵广袖仕女剪影 + 唯一亮色朱砂红油纸伞 */}
          <g transform="translate(-28 4)">
            <line x1={8} y1={-196} x2={-52} y2={-344} stroke="#3B2318" strokeWidth={4} />
            <g transform="translate(-52 -340) rotate(-22)">
              <path
                d="M -138 22 Q 0 -64 138 22 Q 70 8 0 12 Q -70 8 -138 22 Z"
                fill="#C93B32"
                stroke="#7A1D18"
                strokeWidth={2.5}
              />
              {[-106, -70, -34, 0, 34, 70, 106].map((ux, ui) => (
                <line key={ui} x1={0} y1={-24} x2={ux} y2={16} stroke="#8C241E" strokeWidth={1.6} opacity={0.75} />
              ))}
              <circle cx={0} cy={-25} r={4.5} fill="#5C1814" />
            </g>
            {/* 淡青墨染汉服裙摆 */}
            <path
              d={`M -30 -216 Q 0 -226 30 -214 L ${58 + sway * 0.4} 4 Q 0 12 -58 4 Z`}
              fill="#97B59F"
            />
            <path d="M -30 -212 Q -62 -148 -48 -88 L -14 -106 Z" fill="#AFC9B5" />
            {/* 暖杏色披帛 */}
            <path d={`M -28 -206 Q -62 ${-128 + sway} -52 -36`} fill="none" stroke="#CFA97A" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
            {/* 古典云鬓剪影 + 朱红发簪 */}
            <circle cx={2} cy={-252} r={19} fill="#252935" />
            <circle cx={6} cy={-276} r={9.5} fill="#252935" />
            <line x1={-10} y1={-280} x2={24} y2={-272} stroke="#C93B32" strokeWidth={2.8} strokeLinecap="round" />
          </g>
        </g>

        {/* ===== 前景自然舒展的水墨垂柳（带细密柳叶）与墨竹 ===== */}
        <g>
          <path d="M -30 220 Q 120 125 320 -30" fill="none" stroke="#1E232D" strokeWidth={12} strokeLinecap="round" />
          <path d="M 80 140 Q 230 98 410 38" fill="none" stroke="#282E3A" strokeWidth={5.5} strokeLinecap="round" />
          {[90, 165, 245, 325, 395].map((lx, bi) => {
            const topY = 128 - bi * 22;
            const len = 260 + (bi % 3) * 75;
            return (
              <g key={bi}>
                <path
                  d={`M ${lx} ${topY} Q ${lx + 24 + sway * 0.6} ${topY + len * 0.5} ${lx - 12 + sway} ${topY + len}`}
                  fill="none"
                  stroke="#2C3340"
                  strokeWidth={2}
                  opacity={0.72}
                />
                {/* 柳条上的细长柳叶 */}
                {Array.from({length: 7}).map((_, li) => {
                  const t = 0.16 + li * 0.12;
                  const ly = topY + len * t;
                  const cx = lx + Math.sin(t * Math.PI) * (16 + sway * 0.5) - t * 8;
                  const side = li % 2 === 0 ? 1 : -1;
                  return (
                    <path
                      key={li}
                      d="M 0 0 Q 10 -4 26 2 Q 10 5 0 0 Z"
                      fill="#2B3340"
                      opacity={0.72}
                      transform={`translate(${cx} ${ly}) rotate(${side * 38 + 55})`}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>
        {/* 右上墨竹枝叶 */}
        <g fill="#212630" opacity={0.85}>
          <path d="M 1930 240 Q 1810 150 1720 -10" fill="none" stroke="#212630" strokeWidth={5} />
          {[
            [1740, 58, 155],
            [1765, 98, 138],
            [1795, 132, 162],
            [1835, 162, 128],
            [1865, 210, 148],
            [1685, 32, 170],
          ].map(([bx, by, rot], i) => (
            <path key={i} d="M 0 0 Q 32 -9 88 0 Q 32 9 0 0 Z" transform={`translate(${bx} ${by}) rotate(${rot + sway * 0.2})`} />
          ))}
        </g>

        {/* 朱砂红飘舞梅瓣 */}
        {Array.from({length: 18}).map((_, i) => {
          const px = 380 + random(`ppx-${i}`) * 1400 + Math.sin(f / 20 + i) * 26;
          const py = 240 + random(`ppy-${i}`) * 700 + (f * 0.8) % 80;
          const rot = random(`ppr-${i}`) * 360 + f * 1.4;
          return <ellipse key={i} cx={px} cy={py} rx={8} ry={4} fill="#C93B32" opacity={0.85} transform={`rotate(${rot} ${px} ${py})`} />;
        })}

        {/* 右上角传统朱砂小红印（国风点睛符号） */}
        <g transform="translate(178 420)" opacity={0.82}>
          <rect x={-22} y={-22} width={44} height={44} rx={4} fill="#C83B32" />
          <rect x={-17} y={-17} width={34} height={34} rx={2} fill="none" stroke="#F5F0E3" strokeWidth={2.2} />
          <text x={0} y={10} textAnchor="middle" fill="#F5F0E3" fontSize={24} fontWeight={700} fontFamily="'Kaiti SC','KaiTi',serif">
            墨
          </text>
        </g>

        <rect width={W} height={H} filter="url(#xuanPaper)" opacity={0.58} style={{mixBlendMode: 'multiply'}} />
      </svg>
    </AbsoluteFill>
  );
};
