<script setup>
import { usePlaybackStore } from '@/stores/playback';

const store = usePlaybackStore();

const nowPlaying = computed(() => {
    return store.current_metadata;
});
const isFullScreen = computed(() => {
    return store.isFullscreen;
});
const playerState = computed(() => {
    return store.player_state;
});
const shouldShowMiniPlayer = computed(() => {
    return store.shouldShowMiniPlayer;
});

const route = useRoute();
const isInLyricsMode = computed(() => {
    return route.query.showLyrics === 'true';
});

const navigateToNowPlaying = () => {
    navigateTo({ path: '/nowplaying' }, { replace: true });
};

const navigateToLyrics = (event) => {
    event.stopPropagation();
    if (isInLyricsMode.value) {
        navigateTo({ path: '/nowplaying' }, { replace: true });
    } else {
        navigateTo('/nowplaying?showLyrics=true');
    }
};

const handlePlayPause = (event) => {
    event.stopPropagation();
    store.playPause();
};

onMounted(() => {
    console.log('MiniPlayer component mounted');
});
</script>

<template>    
<section v-if="nowPlaying && (!isFullScreen || shouldShowMiniPlayer)" class="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex items-center justify-between z-50 cursor-pointer hover:bg-gray-700 transition-colors duration-200 h-16" @click="navigateToNowPlaying">
        <div class="flex items-center gap-4">
            <img :src="nowPlaying.artwork" alt="Cover Image" class="w-16 object-cover" />
            <section v-if="nowPlaying && nowPlaying.title && nowPlaying.artist">
                <h2 class="font-medium">{{ nowPlaying.title }}</h2>
                <p class="opacity-50 text-xs">{{ nowPlaying.artist }}</p>
            </section>
            <section v-else-if="nowPlaying && !nowPlaying.title && !nowPlaying.artist">
                <h2 class="font-medium">{{ nowPlaying.title }}</h2>
                <p class="opacity-50 text-xs">{{ nowPlaying.artist }}</p>
            </section>        
        </div>
        
        <div class="flex items-center gap-2 mr-4">
            <!-- Play/Pause Button -->
            <button 
                @click="handlePlayPause"
                class="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                :aria-label="playerState === 'playing' ? 'Pause' : 'Play'"
            >
                <!-- Play Icon -->
                <svg v-if="playerState === 'paused' || playerState === 'stopped'" 
                     xmlns="http://www.w3.org/2000/svg" 
                     fill="currentColor" 
                     viewBox="0 0 24 24" 
                     class="w-5 h-5">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                
                <!-- Pause Icon -->
                <svg v-else-if="playerState === 'playing'" 
                     xmlns="http://www.w3.org/2000/svg" 
                     fill="currentColor" 
                     viewBox="0 0 24 24" 
                     class="w-5 h-5">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                
                <!-- Loading Icon -->
                <svg v-else-if="playerState === 'buffering'" 
                     xmlns="http://www.w3.org/2000/svg" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     class="w-5 h-5 animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
                </svg>
            </button>
            
        </div>
    </section>
</template>