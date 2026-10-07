import neonCoast from '@/assets/images/gallery/neon-coast.png';
import nightCity from '@/assets/images/gallery/night-city.png';
import emptyMall from '@/assets/images/gallery/empty-mall.png';
import dreamPool from '@/assets/images/gallery/dream-pool.png';
import classicalSculpture from '@/assets/images/gallery/classical-sculpture.png';
import gridSunset from '@/assets/images/gallery/grid-sunset.png';

export const galleryImages = [
  {
    id: 'neon-coast', title: 'Neon Coast', src: neonCoast,
    alt: 'A pink sunset above a purple coast and a cyan-lit palm-lined road',
    description: '霓虹海岸：沿着青色灯光驶向粉紫色的海平线。'
  },
  {
    id: 'night-city', title: 'Night City', src: nightCity,
    alt: 'An empty neon city avenue beneath a pink moon with cyan glass towers',
    description: '夜间城市：湿润的街道映出玻璃高楼与深夜霓虹。'
  },
  {
    id: 'empty-mall', title: 'Empty Mall', src: emptyMall,
    alt: 'A deserted pastel mall with escalators, palms and a pink glass roof',
    description: '空旷商场：营业时间已经结束，天窗下的梦仍在继续。'
  },
  {
    id: 'dream-pool', title: 'Dream Pool', src: dreamPool,
    alt: 'A turquoise dream pool reflecting lavender arches and a pink sunset',
    description: '梦幻泳池：拱廊、落日和水面共同保存一段静止的夏天。'
  },
  {
    id: 'classical-sculpture', title: 'Classical Sculpture', src: classicalSculpture,
    alt: 'A cyan-lit marble bust in a lavender arch overlooking a magenta moon',
    description: '古典雕塑：大理石的轮廓与虚拟世界的月色相遇。'
  },
  {
    id: 'grid-sunset', title: 'Grid Sunset', src: gridSunset,
    alt: 'An infinite cyan grid leading toward a magenta sun and violet mountains',
    description: '网格落日：无限延伸的坐标，把黄昏留在数字地平线上。'
  }
].map(image => ({ ...image, fileName: `${image.id}.png`, format: 'PNG' }));
