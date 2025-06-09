<script setup>
import { usePlaybackStore } from '@/stores/playback';
const store = usePlaybackStore();
const src = computed(() => store.stream_src);

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

onMounted(() => {
  console.log('Player component mounted');
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
      :src="src"
      autoplay
      preload="metadata"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @timeupdate="handleTimeUpdate"
    />
    <MetadataFetcher />
  </section>
</template>