import { HEADPIECE_WIDTH, HEADPIECE_HEIGHT, HEADPIECE_BOTTOM_Y } from './svgGenerator';

interface HeadpieceSVGOptions {
  mainColor: string;
  accentColor: string;
  goldColor: string;
}

function headpieceSVGWrapper(content: string, filterId: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${HEADPIECE_WIDTH} ${HEADPIECE_HEIGHT}" width="${HEADPIECE_WIDTH}" height="${HEADPIECE_HEIGHT}">
  <defs>
    <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.4"/>
    </filter>
  </defs>
  ${content}
</svg>`;
}

export function generateWangmaoSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h1)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="130" ry="20" fill="${goldColor}" opacity="0.8"/>
      <rect x="70" y="100" width="160" height="100" rx="10" fill="${goldColor}" stroke="${accentColor}" stroke-width="3"/>
      ${Array.from({length: 4}).map((_, i) => `
        <rect x="${80 + i * 35}" y="110" width="25" height="80" rx="3" 
              fill="${mainColor}" stroke="${goldColor}" stroke-width="2"/>
        <circle cx="${92 + i * 35}" cy="125" r="5" fill="${accentColor}"/>
        <circle cx="${92 + i * 35}" cy="150" r="5" fill="${accentColor}"/>
        <circle cx="${92 + i * 35}" cy="175" r="5" fill="${accentColor}"/>
      `).join('')}
      <rect x="60" y="70" width="180" height="35" rx="8" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
      ${Array.from({length: 5}).map((_, i) => `
        <circle cx="${75 + i * 35}" cy="87" r="8" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      `).join('')}
      <g transform="translate(150, 40)">
        ${Array.from({length: 5}).map((_, i) => `
          <g transform="rotate(${i * 72 - 90})">
            <ellipse cx="0" cy="-25" rx="8" ry="20" fill="${goldColor}" stroke="${accentColor}" stroke-width="1.5"/>
          </g>
        `).join('')}
        <circle cx="0" cy="0" r="12" fill="${accentColor}" stroke="${goldColor}" stroke-width="3"/>
      </g>
    </g>
  `, 'h1');
}

export function generateXiangdiaoSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h2)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="125" ry="18" fill="${goldColor}" opacity="0.8"/>
      <rect x="80" y="110" width="140" height="90" rx="8" fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <rect x="90" y="120" width="120" height="70" rx="5" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      <path d="M100 130 L140 130 L150 155 L160 130 L200 130 L200 180 L100 180 Z" fill="${goldColor}" opacity="0.8"/>
      <rect x="70" y="90" width="160" height="25" rx="5" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
      ${Array.from({length: 7}).map((_, i) => `
        <circle cx="${85 + i * 20}" cy="102" r="5" fill="${i % 2 === 0 ? accentColor : goldColor}"/>
      `).join('')}
      <g transform="translate(150, 70)">
        <rect x="-40" y="-15" width="80" height="30" rx="8" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        ${Array.from({length: 3}).map((_, i) => `
          <circle cx="${-20 + i * 20}" cy="0" r="6" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
        `).join('')}
      </g>
    </g>
  `, 'h2');
}

export function generateSamaoSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h3)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="115" ry="16" fill="${mainColor}" opacity="0.9"/>
      <path d="M60 ${HEADPIECE_BOTTOM_Y} Q60 130 90 110 L210 110 Q240 130 240 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <rect x="110" y="125" width="80" height="65" rx="5" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      <rect x="120" y="135" width="60" height="45" rx="3" fill="${goldColor}" opacity="0.8"/>
      <path d="M95 115 L105 85 L120 80 Q150 70 180 80 L195 85 L205 115" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="2"/>
      <rect x="90" y="80" width="120" height="15" rx="5" fill="${goldColor}" stroke="${accentColor}" stroke-width="1.5"/>
      <g transform="translate(150, 60)">
        <ellipse cx="0" cy="-15" rx="35" ry="15" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="-15" cy="-15" r="6" fill="${accentColor}"/>
        <circle cx="0" cy="-15" r="6" fill="${accentColor}"/>
        <circle cx="15" cy="-15" r="6" fill="${accentColor}"/>
      </g>
      <circle cx="45" cy="${HEADPIECE_BOTTOM_Y + 60}" r="10" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
      <circle cx="255" cy="${HEADPIECE_BOTTOM_Y + 60}" r="10" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
    </g>
  `, 'h3');
}

export function generateFengguanSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h4)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="120" ry="15" fill="${goldColor}" opacity="0.8"/>
      <rect x="85" y="120" width="130" height="80" rx="8" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
      ${Array.from({length: 5}).map((_, i) => `
        <rect x="${95 + i * 24}" y="130" width="18" height="60" rx="3" 
              fill="${i % 2 === 0 ? mainColor : accentColor}" stroke="${goldColor}" stroke-width="1.5"/>
      `).join('')}
      <g transform="translate(150, 100)">
        <path d="M0 -50 Q30 -40 25 -15 Q15 -5 0 -15 Q-15 -5 -25 -15 Q-30 -40 0 -50" 
              fill="${mainColor}" stroke="${goldColor}" stroke-width="2"/>
        <circle cx="0" cy="-35" r="6" fill="${goldColor}"/>
      </g>
      ${Array.from({length: 9}).map((_, i) => `
        <g transform="translate(${70 + i * 20}, 95)">
          <circle cx="0" cy="0" r="8" fill="${i % 3 === 0 ? mainColor : accentColor}" stroke="${goldColor}" stroke-width="2"/>
        </g>
      `).join('')}
      ${Array.from({length: 6}).map((_, i) => {
        const x = 90 + i * 24;
        return `
          <path d="M${x} ${HEADPIECE_BOTTOM_Y + 5} Q${x} ${HEADPIECE_BOTTOM_Y + 45} ${x} ${HEADPIECE_BOTTOM_Y + 85}" 
                stroke="${goldColor}" stroke-width="2" fill="none"/>
          <circle cx="${x}" cy="${HEADPIECE_BOTTOM_Y + 90}" r="5" fill="${i % 2 === 0 ? mainColor : accentColor}"/>
        `;
      }).join('')}
    </g>
  `, 'h4');
}

export function generateZijinguanSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h5)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="110" ry="14" fill="${goldColor}" opacity="0.8"/>
      <path d="M70 ${HEADPIECE_BOTTOM_Y} Q70 130 100 115 L200 115 Q230 130 230 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <rect x="105" y="120" width="90" height="75" rx="6" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      <g transform="translate(150, 90)">
        <ellipse cx="0" cy="-20" rx="45" ry="18" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        ${Array.from({length: 5}).map((_, i) => `
          <circle cx="${-30 + i * 15}" cy="-20" r="6" fill="${accentColor}" stroke="${goldColor}" stroke-width="1.5"/>
        `).join('')}
      </g>
      <g transform="translate(150, 55)">
        ${Array.from({length: 7}).map((_, i) => {
          const angle = i * 30 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 30;
          const y = Math.sin(rad) * 30;
          return `
            <g transform="translate(${x}, ${y}) rotate(${angle + 90})">
              <ellipse cx="0" cy="-12" rx="6" ry="15" fill="${goldColor}" stroke="${accentColor}" stroke-width="1.5"/>
            </g>
          `;
        }).join('')}
        <circle cx="0" cy="0" r="15" fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
        <circle cx="0" cy="0" r="7" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
      </g>
    </g>
  `, 'h5');
}

export function generateFuzikuiSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h6)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="105" ry="14" fill="${goldColor}" opacity="0.7"/>
      <path d="M75 ${HEADPIECE_BOTTOM_Y} Q75 125 110 110 L190 110 Q225 125 225 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <g transform="translate(150, 100)">
        <path d="M0 -35 Q25 -25 20 0 Q10 15 0 5 Q-10 15 -20 0 Q-25 -25 0 -35" 
              fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="0" cy="-18" r="8" fill="${accentColor}"/>
      </g>
      ${Array.from({length: 5}).map((_, i) => `
        <ellipse cx="${90 + i * 30}" cy="125" rx="8" ry="12" fill="${goldColor}" opacity="0.6"/>
      `).join('')}
    </g>
  `, 'h6');
}

export function generateHudiekuiSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h7)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="100" ry="12" fill="${goldColor}" opacity="0.7"/>
      <path d="M80 ${HEADPIECE_BOTTOM_Y} Q80 130 115 115 L185 115 Q220 130 220 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="2"/>
      <g transform="translate(150, 95)">
        <ellipse cx="-25" cy="0" rx="25" ry="30" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
        <ellipse cx="25" cy="0" rx="25" ry="30" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
        <ellipse cx="0" cy="5" rx="8" ry="12" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="-5" cy="3" r="2" fill="${mainColor}"/>
        <circle cx="5" cy="3" r="2" fill="${mainColor}"/>
      </g>
    </g>
  `, 'h7');
}

export function generateQixingeziSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h8)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="115" ry="15" fill="${goldColor}" opacity="0.7"/>
      <path d="M70 ${HEADPIECE_BOTTOM_Y} Q70 130 105 115 L195 115 Q230 130 230 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      ${Array.from({length: 7}).map((_, i) => {
        const angle = i * 30 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 150 + Math.cos(rad) * 50;
        const y = 90 + Math.sin(rad) * 30;
        return `
          <g transform="translate(${x}, ${y})">
            <circle cx="0" cy="0" r="10" fill="${i % 2 === 0 ? goldColor : accentColor}" 
                    stroke="${mainColor}" stroke-width="2"/>
            <circle cx="0" cy="0" r="4" fill="${i % 2 === 0 ? accentColor : goldColor}"/>
          </g>
        `;
      }).join('')}
      <g transform="translate(150, 85)">
        <circle cx="0" cy="0" r="18" fill="${accentColor}" stroke="${goldColor}" stroke-width="3"/>
        <circle cx="0" cy="0" r="8" fill="${goldColor}"/>
      </g>
    </g>
  `, 'h8');
}

export function generateDaeeziSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h9)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="120" ry="16" fill="${goldColor}" opacity="0.8"/>
      <path d="M65 ${HEADPIECE_BOTTOM_Y} Q65 125 100 108 L200 108 Q235 125 235 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <g transform="translate(150, 80)">
        ${Array.from({length: 3}).map((_, i) => `
          <ellipse cx="0" cy="${-15 - i * 12}" rx="${45 - i * 10}" ry="${12 - i * 2}" 
                   fill="${goldColor}" stroke="${accentColor}" stroke-width="2" opacity="${1 - i * 0.2}"/>
        `).join('')}
        ${Array.from({length: 5}).map((_, i) => `
          <circle cx="${-40 + i * 20}" cy="-15" r="6" fill="${accentColor}" stroke="${goldColor}" stroke-width="1.5"/>
        `).join('')}
      </g>
      <rect x="110" y="115" width="80" height="70" rx="5" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
    </g>
  `, 'h9');
}

export function generateXiaoeeziSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h10)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="110" ry="14" fill="${goldColor}" opacity="0.7"/>
      <path d="M75 ${HEADPIECE_BOTTOM_Y} Q75 128 105 112 L195 112 Q225 128 225 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="2"/>
      <g transform="translate(150, 85)">
        ${Array.from({length: 2}).map((_, i) => `
          <ellipse cx="0" cy="${-10 - i * 10}" rx="${35 - i * 8}" ry="10" 
                   fill="${goldColor}" stroke="${accentColor}" stroke-width="2" opacity="${1 - i * 0.3}"/>
        `).join('')}
        ${Array.from({length: 4}).map((_, i) => `
          <circle cx="${-30 + i * 20}" cy="-10" r="5" fill="${accentColor}" stroke="${goldColor}" stroke-width="1.5"/>
        `).join('')}
      </g>
      <rect x="115" y="120" width="70" height="65" rx="5" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
    </g>
  `, 'h10');
}

export function generateZhongjingguanSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h11)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="108" ry="15" fill="${goldColor}" opacity="0.8"/>
      <path d="M72 ${HEADPIECE_BOTTOM_Y} Q72 128 108 110 L192 110 Q228 128 228 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <g transform="translate(150, 75)">
        <rect x="-45" y="-20" width="90" height="40" rx="8" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        ${Array.from({length: 5}).map((_, i) => `
          <circle cx="${-30 + i * 15}" cy="0" r="6" fill="${accentColor}" stroke="${goldColor}" stroke-width="1.5"/>
        `).join('')}
        <path d="M0 -35 Q15 -50 30 -45 Q35 -30 20 -20 Q5 -15 0 -35" 
              fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
      </g>
      <rect x="112" y="118" width="76" height="68" rx="5" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
    </g>
  `, 'h11');
}

export function generateChunyangjinSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h12)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="100" ry="13" fill="${goldColor}" opacity="0.7"/>
      <path d="M80 ${HEADPIECE_BOTTOM_Y} Q80 130 110 115 L190 115 Q220 130 220 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="2"/>
      <g transform="translate(150, 80)">
        <ellipse cx="0" cy="-10" rx="40" ry="18" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        <path d="M0 -45 Q10 -55 25 -50 Q30 -35 15 -25 Q0 -20 0 -45" 
              fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        <path d="M0 -45 Q-10 -55 -25 -50 Q-30 -35 -15 -25 Q0 -20 0 -45" 
              fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="0" cy="-10" r="8" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      </g>
    </g>
  `, 'h12');
}

export function generateWenshengjinSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h13)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="102" ry="14" fill="${goldColor}" opacity="0.7"/>
      <path d="M78 ${HEADPIECE_BOTTOM_Y} Q78 128 112 112 L188 112 Q222 128 222 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="2"/>
      <g transform="translate(150, 78)">
        <ellipse cx="0" cy="-8" rx="38" ry="16" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        ${Array.from({length: 4}).map((_, i) => `
          <ellipse cx="${-20 + i * 12}" cy="-20" rx="4" ry="10" 
                   fill="${goldColor}" stroke="${accentColor}" stroke-width="1.5"/>
        `).join('')}
        <circle cx="0" cy="-8" r="7" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      </g>
    </g>
  `, 'h13');
}

export function generateXiangjinSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h14)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="105" ry="14" fill="${goldColor}" opacity="0.8"/>
      <path d="M75 ${HEADPIECE_BOTTOM_Y} Q75 130 108 112 L192 112 Q225 130 225 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <rect x="110" y="118" width="80" height="70" rx="5" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      <g transform="translate(150, 82)">
        <rect x="-38" y="-12" width="76" height="24" rx="6" fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        ${Array.from({length: 4}).map((_, i) => `
          <rect x="${-28 + i * 16}" y="-6" width="10" height="12" rx="2" fill="${accentColor}"/>
        `).join('')}
      </g>
    </g>
  `, 'h14');
}

export function generateFengchikuiSVG(options: HeadpieceSVGOptions): string {
  const { mainColor, goldColor, accentColor } = options;
  return headpieceSVGWrapper(`
    <g filter="url(#h15)">
      <ellipse cx="150" cy="${HEADPIECE_BOTTOM_Y}" rx="110" ry="14" fill="${goldColor}" opacity="0.7"/>
      <path d="M70 ${HEADPIECE_BOTTOM_Y} Q70 125 105 110 L195 110 Q230 125 230 ${HEADPIECE_BOTTOM_Y}" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <g transform="translate(100, 95)">
        <path d="M0 0 Q-15 -20 -10 -40 Q5 -50 15 -35 Q20 -20 10 -5 Q5 5 0 0" 
              fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        ${Array.from({length: 4}).map((_, i) => `
          <ellipse cx="${-8 + i * 5}" cy="${-15 - i * 8}" rx="3" ry="8" 
                   fill="${goldColor}" opacity="0.8"/>
        `).join('')}
      </g>
      <g transform="translate(200, 95)">
        <path d="M0 0 Q15 -20 10 -40 Q-5 -50 -15 -35 Q-20 -20 -10 -5 Q-5 5 0 0" 
              fill="${goldColor}" stroke="${accentColor}" stroke-width="2"/>
        ${Array.from({length: 4}).map((_, i) => `
          <ellipse cx="${8 - i * 5}" cy="${-15 - i * 8}" rx="3" ry="8" 
                   fill="${goldColor}" opacity="0.8"/>
        `).join('')}
      </g>
      <g transform="translate(150, 85)">
        <circle cx="0" cy="0" r="15" fill="${accentColor}" stroke="${goldColor}" stroke-width="3"/>
        <circle cx="0" cy="0" r="6" fill="${goldColor}"/>
      </g>
    </g>
  `, 'h15');
}
