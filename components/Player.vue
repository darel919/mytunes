<script setup>
import { usePlaybackStore } from '@/stores/playback';
const store = usePlaybackStore();
const src = computed(() => store.stream_src);

onMounted(() => {
  console.log('Player component mounted');
  console.log('Playback state:', store.player_state);
});

</script>
<template>
  <section v-if="src">
    <audio
      :src="src"
      autoplay
      preload="metadata"
      @play="store.setPlayerState('playing')"
      @pause="store.setPlayerState('paused')"
    />
    <MetadataFetcher />
  </section>
</template>