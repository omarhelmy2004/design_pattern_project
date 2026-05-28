/**
 * Avatar Generator - Cryptographic Shield Avatars
 * 
 * Generates deterministic, anonymous avatars based on user's anonymous ID.
 * The same anonymous ID will always generate the same avatar.
 */

const COLORS = [
  '#2D5016', '#6B8E23', '#7CB342', '#A1D82F',
  '#8B9B7F', '#A89968', '#C4D4B8', '#D4AF9A'
];

const SHAPES = [
  'circle', 'square', 'triangle', 'diamond', 'hexagon', 'star'
];

/**
 * Simple hash function for consistent results
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get color from seed
 */
export function getColorFromSeed(seed) {
  const hash = hashCode(seed);
  const index = hash % COLORS.length;
  return COLORS[index];
}

/**
 * Get shape from seed
 */
export function getShapeFromSeed(seed) {
  const hash = hashCode(seed);
  const index = (hash / 31) % SHAPES.length;
  return SHAPES[Math.floor(index)];
}

/**
 * Generate SVG avatar
 */
export function generateAvatarSVG(seed, size = 40) {
  const color = getColorFromSeed(seed);
  const shape = getShapeFromSeed(seed);
  
  let shapeElement = '';
  
  switch (shape) {
    case 'circle':
      shapeElement = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}"/>`;
      break;
    case 'square':
      shapeElement = `<rect x="0" y="0" width="${size}" height="${size}" fill="${color}"/>`;
      break;
    case 'triangle':
      shapeElement = `<polygon points="${size / 2},0 ${size},${size} 0,${size}" fill="${color}"/>`;
      break;
    case 'diamond':
      shapeElement = `<polygon points="${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}" fill="${color}"/>`;
      break;
    case 'hexagon':
      const angle = Math.PI / 3;
      const points = Array.from({ length: 6 }, (_, i) => {
        const x = size / 2 + (size / 2) * Math.cos(i * angle);
        const y = size / 2 + (size / 2) * Math.sin(i * angle);
        return `${x},${y}`;
      }).join(' ');
      shapeElement = `<polygon points="${points}" fill="${color}"/>`;
      break;
    case 'star':
      const starPoints = [];
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? size / 2 : size / 4;
        const angle = (i * Math.PI) / 5;
        const x = size / 2 + radius * Math.cos(angle - Math.PI / 2);
        const y = size / 2 + radius * Math.sin(angle - Math.PI / 2);
        starPoints.push(`${x},${y}`);
      }
      shapeElement = `<polygon points="${starPoints.join(' ')}" fill="${color}"/>`;
      break;
    default:
      shapeElement = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}"/>`;
  }
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${shapeElement}
  </svg>`;
}

/**
 * Generate avatar data URL
 */
export function generateAvatarDataURL(seed, size = 40) {
  const svg = generateAvatarSVG(seed, size);
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}
