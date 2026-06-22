interface CostumeSVGOptions {
  mainColor: string;
  accentColor: string;
  goldColor: string;
  pattern: string;
}

interface HeadpieceSVGOptions {
  mainColor: string;
  accentColor: string;
  goldColor: string;
}

const COSTUME_WIDTH = 400;
const COSTUME_HEIGHT = 600;
const COSTUME_NECK_X = 200;
const COSTUME_NECK_Y = 120;

const HEADPIECE_WIDTH = 300;
const HEADPIECE_HEIGHT = 250;
const HEADPIECE_BOTTOM_Y = 200;

function costumeSVGWrapper(content: string, filterId: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COSTUME_WIDTH} ${COSTUME_HEIGHT}" width="${COSTUME_WIDTH}" height="${COSTUME_HEIGHT}">
  <defs>
    <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.3"/>
    </filter>
  </defs>
  ${content}
</svg>`;
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

export function generateMangpaoSVG(options: CostumeSVGOptions): string {
  const { mainColor, accentColor, goldColor, pattern } = options;
  const patternFill = pattern === 'dragon' 
    ? `<path d="M40 10 Q50 20 45 35 Q40 45 30 40 Q20 35 25 25 Q30 15 40 10" fill="${goldColor}" opacity="0.5"/>` 
    : `<circle cx="40" cy="40" r="15" fill="${goldColor}" opacity="0.3"/>`;

  return costumeSVGWrapper(`
    <pattern id="robePattern" patternUnits="userSpaceOnUse" width="80" height="80">
      ${patternFill}
    </pattern>
    <g filter="url(#f1)">
      <path d="M80 140 L60 200 L50 400 L70 580 L330 580 L350 400 L340 200 L320 140 Q200 160 80 140" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="4"/>
      <path d="M80 140 L60 200 L50 400 L70 580 L330 580 L350 400 L340 200 L320 140 Q200 160 80 140" 
            fill="url(#robePattern)"/>
      <path d="M170 140 Q200 180 230 140 L230 200 Q200 220 170 200 Z" 
            fill="${goldColor}" opacity="0.8"/>
      <circle cx="200" cy="170" r="8" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      <path d="M160 145 L175 145 L190 170 L180 185 L165 180 Z" fill="${goldColor}" opacity="0.9"/>
      <path d="M240 145 L225 145 L210 170 L220 185 L235 180 Z" fill="${goldColor}" opacity="0.9"/>
      <path d="M70 150 L55 180 L50 220 L70 230 L80 200 L75 160 Z" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <path d="M330 150 L345 180 L350 220 L330 230 L320 200 L325 160 Z" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <path d="M150 145 L250 145" stroke="${goldColor}" stroke-width="6" stroke-linecap="round"/>
    </g>
  `, 'f1');
}

export function generateKaoSVG(options: CostumeSVGOptions): string {
  const { mainColor, accentColor, goldColor, pattern } = options;
  
  return costumeSVGWrapper(`
    <pattern id="scalePattern" patternUnits="userSpaceOnUse" width="30" height="30">
      <path d="M15 0 L30 15 L15 30 L0 15 Z" fill="none" stroke="${goldColor}" stroke-width="1.5" opacity="0.6"/>
    </pattern>
    <g filter="url(#f2)">
      <path d="M90 140 L70 200 L60 420 L80 580 L320 580 L340 420 L330 200 L310 140 Q200 155 90 140" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="5"/>
      <path d="M90 140 L70 200 L60 420 L80 580 L320 580 L340 420 L330 200 L310 140 Q200 155 90 140" 
            fill="url(#scalePattern)"/>
      <path d="M165 140 Q200 175 235 140 L245 210 Q200 235 155 210 Z" 
            fill="${goldColor}" opacity="0.85" stroke="${accentColor}" stroke-width="2"/>
      <circle cx="200" cy="175" r="10" fill="${accentColor}" stroke="${goldColor}" stroke-width="3"/>
      <g transform="translate(75, 280)">
        <rect x="0" y="0" width="20" height="120" rx="5" fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
        <path d="M10 0 L25 -30 L25 -60 L10 -40 L-5 -60 L-5 -30 Z" fill="${goldColor}" opacity="0.8"/>
      </g>
      <g transform="translate(305, 280)">
        <rect x="0" y="0" width="20" height="120" rx="5" fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
        <path d="M10 0 L25 -30 L25 -60 L10 -40 L-5 -60 L-5 -30 Z" fill="${goldColor}" opacity="0.8"/>
      </g>
      <path d="M110 480 L290 480" stroke="${goldColor}" stroke-width="8" stroke-linecap="round"/>
    </g>
  `, 'f2');
}

export function generatePeiSVG(options: CostumeSVGOptions): string {
  const { mainColor, accentColor, goldColor, pattern } = options;
  const flower = pattern === 'flower' ? `
    <g transform="translate(200, 320)">
      ${Array.from({length: 8}).map((_, i) => `
        <ellipse cx="0" cy="-20" rx="8" ry="18" fill="${goldColor}" opacity="0.7" transform="rotate(${i * 45})"/>
      `).join('')}
      <circle cx="0" cy="0" r="8" fill="${accentColor}"/>
    </g>
  ` : '';

  return costumeSVGWrapper(`
    <pattern id="flowerPattern" patternUnits="userSpaceOnUse" width="60" height="60">
      <circle cx="30" cy="30" r="10" fill="${goldColor}" opacity="0.3"/>
    </pattern>
    <g filter="url(#f3)">
      <path d="M100 140 L85 180 L75 400 L95 580 L305 580 L325 400 L315 180 L300 140 Q200 155 100 140" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="3"/>
      <path d="M100 140 L85 180 L75 400 L95 580 L305 580 L325 400 L315 180 L300 140 Q200 155 100 140" 
            fill="url(#flowerPattern)"/>
      <path d="M180 140 Q200 165 220 140 L220 210 Q200 225 180 210 Z" 
            fill="${goldColor}" opacity="0.75"/>
      <path d="M180 140 L220 140 L220 210 L180 210" fill="none" stroke="${goldColor}" stroke-width="3"/>
      <path d="M130 500 L270 500" stroke="${goldColor}" stroke-width="4" stroke-linecap="round"/>
      ${flower}
    </g>
  `, 'f3');
}

export function generateZheziSVG(options: CostumeSVGOptions): string {
  const { mainColor, accentColor, goldColor } = options;

  return costumeSVGWrapper(`
    <pattern id="zheziPattern" patternUnits="userSpaceOnUse" width="10" height="10">
      <line x1="0" y1="0" x2="10" y2="10" stroke="${goldColor}" stroke-width="0.5" opacity="0.3"/>
    </pattern>
    <g filter="url(#f4)">
      <path d="M110 140 L95 190 L85 400 L100 580 L300 580 L315 400 L305 190 L290 140 Q200 150 110 140" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="2"/>
      <path d="M110 140 L95 190 L85 400 L100 580 L300 580 L315 400 L305 190 L290 140 Q200 150 110 140" 
            fill="url(#zheziPattern)"/>
      <path d="M175 140 Q200 158 225 140 L225 220 Q200 235 175 220 Z" 
            fill="${mainColor}" opacity="0.95" stroke="${goldColor}" stroke-width="2"/>
      <rect x="180" y="150" width="40" height="55" fill="${accentColor}" opacity="0.3"/>
      <path d="M90 520 L310 520" stroke="${goldColor}" stroke-width="3"/>
    </g>
  `, 'f4');
}

export function generateGuanyiSVG(options: CostumeSVGOptions): string {
  const { mainColor, accentColor, goldColor, pattern } = options;
  const bird = pattern === 'bird' ? `
    <g transform="translate(200, 360)">
      <path d="M0 -20 Q15 -12 10 8 Q0 20 -10 8 Q-15 -12 0 -20" fill="${goldColor}" opacity="0.8"/>
      <circle cx="0" cy="-10" r="4" fill="${accentColor}"/>
    </g>
  ` : '';

  return costumeSVGWrapper(`
    <g filter="url(#f5)">
      <path d="M95 140 L80 190 L70 410 L90 580 L310 580 L330 410 L320 190 L305 140 Q200 155 95 140" 
            fill="${mainColor}" stroke="${goldColor}" stroke-width="4"/>
      <path d="M170 140 Q200 170 230 140 L230 205 Q200 225 170 205 Z" 
            fill="${goldColor}" opacity="0.85" stroke="${accentColor}" stroke-width="2"/>
      <rect x="180" y="150" width="40" height="45" rx="3" fill="${mainColor}" stroke="${accentColor}" stroke-width="2"/>
      <rect x="185" y="200" width="30" height="60" rx="2" fill="${accentColor}" stroke="${goldColor}" stroke-width="2"/>
      <path d="M120 480 L280 480" stroke="${goldColor}" stroke-width="6" stroke-linecap="round"/>
      ${bird}
    </g>
  `, 'f5');
}

export { COSTUME_WIDTH, COSTUME_HEIGHT, COSTUME_NECK_X, COSTUME_NECK_Y };
export { HEADPIECE_WIDTH, HEADPIECE_HEIGHT, HEADPIECE_BOTTOM_Y };
