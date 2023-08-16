const audio = document.getElementById("audio-stream-handler");
const track_timer = document.getElementById("track-timer");
const track_title = document.getElementById("track-title");
const clock_display = document.querySelector(".clock-display");
const track_list = [
  "/assets/songs/SHAMBARA - Solid Dance.mp3",
  "/assets/songs/中森明菜 - OH NO,OH YES!.mp3",
  "/assets/songs/今井美樹 - Boogie-Woogie Lonesome High-Heel.mp3",
  "/assets/songs/山下達郎 - Ride On Time.mp3",
  "/assets/songs/杏里 - Good Bye Boogie Dance.mp3",
  "/assets/songs/松原みき - 真夜中のドアStay With Me.mp3",
];

let track_number = 0;

function audioInit() {
  audio.src = track_list[track_number];
  updateTrackTitle();
}

function playSong() {
  audio.play();
  clock_display.classList.add("play");
}

function pauseSong() {
  audio.pause();
  clock_display.classList.remove("play");
}

function stopSong() {
  audio.pause();
  audio.currentTime = 0;
  clock_display.classList.remove("play");
}

function lastSong() {
  track_number--;
  if (track_number < 0) track_number = track_list.length - 1;
  changeAudioSource(track_list[track_number]);
}

function nextSong() {
  track_number++;
  if (track_number >= track_list.length) track_number = 0;
  changeAudioSource(track_list[track_number]);
}

// 监听媒体播放结束事件
audio.addEventListener("ended", function () {
  nextSong();
});

// 获取歌曲名称
function getTrackTitle() {
  const split_String = audio.src.split("/");
  for (i = 0; i < split_String.length; i++) {
    if (split_String[i + 1] == null) {
      const title = decodeURI(split_String[i]);
      const [singer, song] = title.slice(0, -4).split(" - ");

      return `<strong>${song}</strong><div class="singer">${singer}</div>`;
    }
  }
  return "No data or disc loaded";
}
// 个位数补0
function onlyTwoDigits(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}
// 获取音乐当前时间
function getTrackTimeAsString() {
  const timer_string = `${onlyTwoDigits(
    Math.floor(audio.currentTime / 60)
  )} : ${onlyTwoDigits(Math.floor(audio.currentTime % 60))}`;
  return timer_string;
}
function updateMainTimer() {
  track_timer.innerHTML = `${getTrackTimeAsString()}`;
}
function updateTrackTitle() {
  track_title.innerHTML = getTrackTitle();
}

// 当currentTime更新时触发的事件。
function updatePlayerUI() {
  updateMainTimer(); // 更新时间
}

// 切换音频源
function changeAudioSource(source) {
  audio.src = source;
  updateTrackTitle(); // 获取歌曲名称
  audio.load(); // 重新加载音频
  audio.play(); // 播放音频
  clock_display.classList.add("play");
}

audioInit(); // 初始化
