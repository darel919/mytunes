<script setup>
import { useLibraryStore } from '@/stores/library';
import { usePlaybackStore } from '@/stores/playback';

const store = useLibraryStore();
const playback = usePlaybackStore();

const library = computed(() => {
    return store.library;
});

const isCurrentlyPlaying = (item) => {
    return playback.selected_track?.id === item.id;
};

const getCurrentDisplayData = (item) => {
    if (isCurrentlyPlaying(item) && playback.current_metadata) {
        return {
            title: playback.current_metadata.title || item.title,
            artist: playback.current_metadata.artist || item.short_description,
            artwork: playback.current_metadata.artwork || item.artwork
        };
    }
    return {
        title: item.title,
        artist: item.short_description,
        artwork: item.artwork
    };
};

onMounted(() => {
    console.log('LibraryView component mounted');
});
</script>

<template>
    <div v-if="library.length > 0" class="bg-black text-white font-light min-h-screen p-4">
        <div class="border-b border-gray-700 pb-2 mb-4">
            <h1 class="text-2xl font-light tracking-wide">radios</h1>
            <p class="text-gray-400 text-sm">{{ library.length }} stations</p>
        </div>
        
        <div class="space-y-0">
            <div 
                v-for="item in library" 
                :key="item.id" 
                class="flex items-center py-3 px-2 border-b border-gray-800 hover:bg-gray-900 cursor-pointer group transition-colors duration-200"
                :class="{ 
                    'bg-orange-600 hover:bg-orange-500': isCurrentlyPlaying(item),
                }"
                @click="playback.setCurrentTrack(item)"
            >
                <div class="w-12 h-12 bg-gray-800 flex-shrink-0 mr-4 relative">
                    <img :src="getCurrentDisplayData(item).artwork" alt="" class="w-full h-full object-cover" />
                    <div v-if="isCurrentlyPlaying(item)" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div class="w-4 h-4 text-white">
                            <svg v-if="playback.player_state === 'playing'" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div class="flex-1 min-w-0">
                    <div class="font-normal text-base truncate" :class="{ 'text-white': isCurrentlyPlaying(item), 'text-gray-100': !isCurrentlyPlaying(item) }">
                        {{ getCurrentDisplayData(item).title }}
                    </div>
                    <div class="text-sm font-light truncate" :class="{ 'text-gray-200': isCurrentlyPlaying(item), 'text-gray-400': !isCurrentlyPlaying(item) }">
                        {{ getCurrentDisplayData(item).artist }}
                    </div>
                    <div v-if="isCurrentlyPlaying(item)" class="text-xs font-light mt-1" :class="{ 'text-gray-100': isCurrentlyPlaying(item) }">
                        {{ playback.player_state === 'playing' ? 'now playing' : 'paused' }}
                    </div>
                </div>
                
                <div class="text-gray-500 text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="w-4 h-4">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

