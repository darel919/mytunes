<script setup>
import { usePlaybackStore } from '@/stores/playback';

const store = usePlaybackStore();

const nowPlaying = computed(() => {
    return store.current_metadata;
});
const currentRadio = computed(() => {
    return store.current_radio;
});
const isFullScreen = computed(() => {
    return store.isFullScreen;
});
onMounted(() => {
    console.log('MiniPlayer component mounted');
});
</script>

<template>
    <section v-if="nowPlaying && !isFullScreen" class="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex items-center justify-between z-50">
        <div class="flex items-center gap-4">
            <img :src="nowPlaying.artwork" alt="Cover Image" class="w-20" />
            <section v-if="nowPlaying && nowPlaying.title && nowPlaying.artist">
                <h2>{{ nowPlaying.title }}</h2>
                <p class="opacity-50 text-xs">{{ nowPlaying.artist }}</p>
            </section>
            <section v-else-if="nowPlaying && !nowPlaying.title && !nowPlaying.artist">
                <h2>{{ nowPlaying.title }}</h2>
                <p class="opacity-50 text-xs">{{ nowPlaying.artist }}</p>
            </section>
        </div>
    </section>
</template>