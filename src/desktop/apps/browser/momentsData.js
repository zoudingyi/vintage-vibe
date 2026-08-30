export const moments = [
  {
    id: 'sample-archive-boot-sequence',
    publishedAt: '2026-04-03T19:24:00+08:00',
    body:
      '示例记录：个人信号档案完成首次启动。未来的生活片段会从这里开始，按时间留下一份可以慢慢翻阅的本地记录。',
    media: []
  },
  {
    id: 'sample-city-light-photo-log',
    publishedAt: '2026-07-19T20:16:00+08:00',
    body:
      '示例记录：傍晚的城市刚刚亮起霓虹。这里预留给一张照片和一段简短说明，真实素材将在后续版本替换。',
    media: [
      {
        id: 'sample-city-light-photo',
        type: 'image',
        alt: 'Photo placeholder for an evening city-light moment',
        variant: 'single'
      }
    ]
  },
  {
    id: 'sample-midnight-ride-notes',
    publishedAt: '2026-08-24T21:42:00+08:00',
    body:
      '示例记录：夜间频道保持在线。这里适合保存一段临时想到的话、一次短途出发，或某个不想忘记的普通瞬间。',
    media: []
  },
  {
    id: 'sample-vintage-vibe-build-tape',
    publishedAt: '2026-05-11T22:08:00+08:00',
    body:
      '示例记录：一段 Vintage Vibe 桌面录屏将出现在这里。当前仅保留视频封面与时长信息，不加载或播放任何媒体。',
    media: [
      {
        id: 'sample-vintage-vibe-video',
        type: 'video',
        alt: 'Video placeholder for a Vintage Vibe desktop recording',
        duration: '02:48',
        variant: 'wide'
      }
    ]
  },
  {
    id: 'sample-cat-network-gallery',
    publishedAt: '2026-06-28T16:35:00+08:00',
    body:
      '示例记录：家庭网络检测到三帧新的猫咪影像。这里演示多图动态在时间轴中的排列方式，不包含真实照片。',
    media: [
      {
        id: 'sample-cat-frame-a',
        type: 'image',
        alt: 'Gallery placeholder for cat-network frame one',
        variant: 'gallery'
      },
      {
        id: 'sample-cat-frame-b',
        type: 'image',
        alt: 'Gallery placeholder for cat-network frame two',
        variant: 'gallery'
      },
      {
        id: 'sample-cat-frame-c',
        type: 'image',
        alt: 'Gallery placeholder for cat-network frame three',
        variant: 'gallery'
      }
    ]
  }
];

export function getMomentsNewestFirst(records = moments) {
  return [...records].sort(
    (left, right) =>
      Date.parse(right.publishedAt) - Date.parse(left.publishedAt)
  );
}
