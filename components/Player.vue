<script setup>
import { usePlaybackStore } from '@/stores/playback';
const store = usePlaybackStore();
const src = computed(() => store.stream_src);
const audioElement = ref(null);

let timeUpdateInterval = null;

const handleTimeUpdate = (event) => {
  const currentTime = event.target.currentTime;
  store.setElapsedTime(Math.floor(currentTime));
};

const handlePlay = () => {
  store.setPlayerState('playing');
};

const handlePause = () => {
  store.setPlayerState('paused');
};

const handleEnded = () => {
  store.setPlayerState('stopped');
  store.setElapsedTime(0);
};

const handleLoadStart = () => {
  store.setPlayerState('buffering');
};

const handleCanPlay = () => {
  if (store.player_state === 'buffering') {
    store.setPlayerState('paused');
  }
  applyVolumeToAudio();
};

watch(() => store.player_remote, (remote) => {
  if (!audioElement.value) return;
  
  switch (remote) {
    case 'play':
      audioElement.value.play();
      break;
    case 'pause':
      audioElement.value.pause();
      break;
  }
  
  store.setPlayerRemote('ready');
});

watch(() => store.player_vol, (volume) => {
  if (audioElement.value) {
    audioElement.value.volume = volume;
  }
});

const applyVolumeToAudio = () => {
  if (audioElement.value) {
    audioElement.value.volume = store.player_vol;
  }
};

onMounted(() => {
  console.log('Player component mounted');
  store.loadPlayerVolume();
  
  nextTick(() => {
    applyVolumeToAudio();
  });
});

watch(audioElement, (newElement) => {
  if (newElement) {
    applyVolumeToAudio();
  }
});

onUnmounted(() => {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
  }
});

</script>
<template>
  <section v-if="src">
    <audio
      ref="audioElement"
      :src="src"
      autoplay
      preload="metadata"
      @play="handlePlay"
      @pause="handlePause"      @ended="handleEnded"
      @timeupdate="handleTimeUpdate"
      @loadstart="handleLoadStart"
      @canplay="handleCanPlay"
      @loadeddata="applyVolumeToAudio"
    />
    <MetadataFetcher />
  </section>
</template>