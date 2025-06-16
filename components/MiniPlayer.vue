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
const streamSrc = computed(() => {
    return store.stream_src;
});
const streamName = computed(() => {
    return store.stream_name;
});
const streamArtwork = computed(() => {
    return store.stream_artwork;
});

const themeColor = computed(() => {
    return store.theme_color;
});
const themeColorRgb = computed(() => {
    return store.theme_color_rgb;
});

const textColor = computed(() => {
    return store.complementaryColor || 'white';
});

const hasThemeColor = computed(() => {
    return store.hasThemeColor;
});

const miniPlayerStyle = computed(() => {
    if (!themeColor.value || !themeColorRgb.value) {
        return 'bg-gray-800';
    }
    
    const { r, g, b } = themeColorRgb.value;
    return {
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.9)`,
        borderTop: `2px solid ${themeColor.value}`,
    };
});

const buttonStyle = computed(() => {
    if (!themeColor.value) {
        return {};
    }
    
    return {
        backgroundColor: `${themeColor.value}40`,
    };
});

const handleButtonMouseEnter = (event) => {
    if (themeColor.value) {
        event.target.style.backgroundColor = `${themeColor.value}60`;
    }
};

const handleButtonMouseLeave = (event) => {
    if (themeColor.value) {
        event.target.style.backgroundColor = `${themeColor.value}40`;
    }
};

const route = useRoute();
const isInLyricsMode = computed(() => {
    return route.query.showLyrics === 'true';
});

const navigateToNowPlaying = () => {
    navigateTo({ path: '/nowplaying' }, { replace: true });
};


const handlePlayPause = (event) => {
    event.stopPropagation();
    store.playPause();
};

const handleMouseEnter = (event) => {
    if (themeColorRgb.value) {
        const { r, g, b } = themeColorRgb.value;
        event.target.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 1)`;
    }
};

const handleMouseLeave = (event) => {
    if (themeColorRgb.value) {
        const { r, g, b } = themeColorRgb.value;
        event.target.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
    }
};

onMounted(() => {
    console.log('MiniPlayer component mounted');
});
</script>

<template>    
<section v-if="streamSrc && (!isFullScreen || shouldShowMiniPlayer)" 
         :style="themeColor ? miniPlayerStyle : {}"
         :class="themeColor ? 'fixed bottom-0 left-0 w-full text-white flex items-center justify-between z-50 cursor-pointer theme-transition h-16' : 'fixed bottom-0 left-4 right-4 bg-gray-800 text-white flex items-center justify-between z-50 cursor-pointer hover:bg-gray-700 transition-colors duration-200 h-16 my-4 '"
         @click="navigateToNowPlaying"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave">        <div class="flex items-center gap-4">
            <img :src="nowPlaying?.artwork || streamArtwork" alt="Cover Image" class="w-16 object-cover" />
            <section>
                <h2 class="font-medium" :style="{ color: hasThemeColor ? textColor : 'white' }">{{ nowPlaying?.title || streamName }}</h2>
                <p v-if="nowPlaying?.artist" class="opacity-50 text-xs" :style="{ color: hasThemeColor ? textColor : 'white' }">{{ nowPlaying.artist }}</p>
            </section>        
        </div>
        
        <div class="flex items-center gap-2 mr-4">
            <!-- Play/Pause Button -->            
             <button 
                @click="handlePlayPause"
                @mouseenter="handleButtonMouseEnter"                
                @mouseleave="handleButtonMouseLeave"
                :class="themeColor ? 'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300' : 'flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300'"
                :style="themeColor ? { ...buttonStyle, color: textColor } : {}"
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