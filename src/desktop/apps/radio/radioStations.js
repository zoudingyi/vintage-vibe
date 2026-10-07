export const radioStations = [
  {
    frequency: '88.7',
    id: 'mirage',
    name: 'Palm Mirage',
    tracks: [
      {
        artist: 'Aevv',
        audioSrc: '/audio/palm-mirage/Aevv - Love Philter.mp3',
        title: 'Love Philter'
      },
      {
        artist: 'DENKI SAMA',
        audioSrc: '/audio/palm-mirage/DENKI SAMA - 告白♡.mp3',
        title: '告白♡'
      },
      {
        artist: 'ナニダト',
        audioSrc: '/audio/palm-mirage/ナニダト - 雨ame.mp3',
        title: '雨ame'
      },
      {
        artist: '幸子小姐拜托了',
        audioSrc: '/audio/palm-mirage/幸子小姐拜托了 - 柴 鱼 の c a l l i n g.mp3',
        title: '柴 鱼 の c a l l i n g'
      },
      {
        artist: '眠',
        audioSrc: '/audio/palm-mirage/眠 - ほんとうに ほんと.mp3',
        title: 'ほんとうに ほんと'
      },
      {
        artist: '眠, Aevv, Lopu$',
        audioSrc: '/audio/palm-mirage/眠,Aevv,Lopu$ - 四 ピ.mp3',
        title: '四 ピ'
      }
    ]
  },
  {
    frequency: '94.2',
    id: 'midnight',
    name: 'Midnight Plaza',
    tracks: [
      {
        artist: '松原みき',
        audioSrc:
          '/audio/midnight-plaza/松原みき - 真夜中のドアStay With Me.mp3',
        title: '真夜中のドア Stay With Me'
      },
      {
        artist: 'SHAMBARA',
        audioSrc: '/audio/midnight-plaza/SHAMBARA - Solid Dance.mp3',
        title: 'Solid Dance'
      },
      {
        artist: '中原めいこ',
        audioSrc:
          '/audio/midnight-plaza/中原めいこ - Dance in the memories(FULL VERSION).mp3',
        title: 'Dance in the memories'
      },
      {
        artist: '中森明菜',
        audioSrc: '/audio/midnight-plaza/中森明菜 - OH NO,OH YES!.mp3',
        title: 'OH NO, OH YES!'
      },
      {
        artist: '八神纯子',
        audioSrc: '/audio/midnight-plaza/八神纯子 - カシミヤのほほえみ.mp3',
        title: 'カシミヤのほほえみ'
      },
      {
        artist: '山下達郎',
        audioSrc: '/audio/midnight-plaza/山下達郎 - Ride On Time.mp3',
        title: 'Ride On Time'
      },
      {
        artist: '当山瞳',
        audioSrc: '/audio/midnight-plaza/当山瞳 - Cathy.mp3',
        title: 'Cathy'
      },
      {
        artist: '杏里',
        audioSrc: '/audio/midnight-plaza/杏里 - SHYNESS BOY.mp3',
        title: 'SHYNESS BOY'
      },
      {
        artist: '石井明美',
        audioSrc: '/audio/midnight-plaza/石井明美 - 瞳で抱いてて.mp3',
        title: '瞳で抱いてて'
      },
      {
        artist: '竹内まりや',
        audioSrc: '/audio/midnight-plaza/竹内まりや-プラスティック・ラブ.mp3',
        title: 'プラスティック・ラブ'
      }
    ]
  },
  {
    frequency: '101.9',
    id: 'dream',
    name: 'Dream Channel',
    tracks: [
      {
        artist: 'Desired',
        audioSrc:
          '/audio/dream-channel/Desired - Solid Dance (Desired Bootleg).mp3',
        title: 'Solid Dance (Desired Bootleg)'
      },
      {
        artist: 'Night Tempo',
        audioSrc: '/audio/dream-channel/Night Tempo - Sunset Disco.mp3',
        title: 'Sunset Disco'
      },
      {
        artist: 'Night Tempo',
        audioSrc:
          '/audio/dream-channel/Night Tempo - 夢の続き~Dreams Of Light~.mp3',
        title: '夢の続き ~Dreams Of Light~'
      },
      {
        artist: 'Vantage',
        audioSrc: '/audio/dream-channel/Vantage - Power Make Up.mp3',
        title: 'Power Make Up'
      },
      {
        artist: 'コンシャスTHOUGHTS',
        audioSrc:
          '/audio/dream-channel/コンシャスTHOUGHTS - Goodbye『さようなら』.mp3',
        title: 'Goodbye『さようなら』'
      },
      {
        artist: 'コンシャスTHOUGHTS, マクロスMACROSS 82-99',
        audioSrc:
          '/audio/dream-channel/コンシャスTHOUGHTS,マクロスMACROSS 82-99 - 水野 亜美AMY (コンシャスTHOUGHTS Remix).mp3',
        title: '水野 亜美 AMY (コンシャスTHOUGHTS Remix)'
      }
    ]
  }
];

export function createRadioPlaybackMemory() {
  return Object.fromEntries(
    radioStations.map(station => [
      station.id,
      { currentTime: 0, trackIndex: 0 }
    ])
  );
}
