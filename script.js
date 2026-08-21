// HTML Elements select karna
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const playlistEl = document.getElementById('playlist');

// 21 Songs Playlist Generate karna
const totalSongs = 21;
const songs = [];

for (let i = 1; i <= totalSongs; i++) {
  songs.push({
    id: i,
    name: `Track ${i}`,
    artist: "My Favorite Artist",
    src: `song${i}.mp3`,
    cover: "cover.jpg"
  });
}

let songIndex = 0;
let isPlaying = false;

// Playlist UI Render karna
function renderPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.classList.add('playlist-item');
    if (index === songIndex) item.classList.add('active');

    item.innerHTML = `
      <span class="item-number">${index + 1 < 10 ? '0' + (index + 1) : index + 1}</span>
      <div class="item-info">
        <div class="item-title">${song.name}</div>
        <div class="item-artist">${song.artist}</div>
      </div>
      <i class="fa-solid ${index === songIndex && isPlaying ? 'fa-volume-high' : 'fa-play'} item-icon"></i>
    `;

    // Click par gaana load & play
    item.addEventListener('click', () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });

    playlistEl.appendChild(item);
  });
}

// Active Track Highlight Update karna
function updateActiveTrack() {
  const items = document.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    const icon = item.querySelector('.item-icon');
    if (index === songIndex) {
      item.classList.add('active');
      icon.className = `fa-solid ${isPlaying ? 'fa-volume-high' : 'fa-play'} item-icon`;
      // Auto-scroll track into view
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      item.classList.remove('active');
      icon.className = 'fa-solid fa-play item-icon';
    }
  });
}

// Load Song
function loadSong(song) {
  title.innerText = song.name;
  artist.innerText = song.artist;
  audio.src = song.src;
  cover.src = song.cover;
  updateActiveTrack();
}

// Play Song
function playSong() {
  isPlaying = true;
  playIcon.classList.remove('fa-play');
  playIcon.classList.add('fa-pause');
  audio.play();
  updateActiveTrack();
}

// Pause Song
function pauseSong() {
  isPlaying = false;
  playIcon.classList.remove('fa-pause');
  playIcon.classList.add('fa-play');
  audio.pause();
  updateActiveTrack();
}

// Play / Pause Button Click
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Previous Song
function prevSong() {
  songIndex--;
  if (songIndex < 0) songIndex = songs.length - 1;
  loadSong(songs[songIndex]);
  playSong();
}

// Next Song
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) songIndex = 0;
  loadSong(songs[songIndex]);
  playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time Format (M:SS)
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Progress Bar Update
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.value = progressPercent;

    currentTimeEl.innerText = formatTime(audio.currentTime);
    durationEl.innerText = formatTime(audio.duration);
  }
});

// Seek bar input
progress.addEventListener('input', () => {
  const seekTime = (progress.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Song end pe automatic agla track
audio.addEventListener('ended', nextSong);

// Initial Setup
renderPlaylist();
loadSong(songs[songIndex]);