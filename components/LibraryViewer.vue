<script setup>
import { useLibraryStore } from '@/stores/library';
import { usePlaybackStore } from '@/stores/playback';

const store = useLibraryStore();
const playback = usePlaybackStore();

const library = computed(() => {
    return store.library;
});
onMounted(() => {
    console.log('LibraryView component mounted');
});
</script>

<template>
    <!-- <h1> Hello! LibraryView</h1> -->
    <div v-if="library.length > 0">
        <div v-for="item in library" :key="item.id" class="flex items-center gap-4" v-on:click="playback.setCurrentTrack(item)">
            <img :src="item.artwork" alt="Cover Image" class="w-24" />
            <section>
                <h2>{{ item.title }}</h2>
                <p class="opacity-50 text-xs">{{ item.short_description }}</p>
            </section>
        </div>
    </div>
</template>