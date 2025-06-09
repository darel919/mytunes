<template>
  <div :class="containerClass">
    <div :class="innerContainerClass">
      
        <!-- Background overlay for small mode -->
        <div v-if="size === 'small'" class="absolute inset-0 bg-gradient-to-r bg-black/30 rounded-xl backdrop-blur-md transition-all duration-500 ease-in-out -z-10"/>
      
        <!-- Album Artwork -->
        <div :class="artworkContainerClass">
            <div :class="artworkClass">
                <img 
                v-if="metadata?.artwork" 
                :src="metadata.artwork" 
                :alt="metadata?.artist || 'Album artwork'"
                :class="imageClass"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                    <div :class="iconContainerClass">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="iconClass">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div v-if="size === 'full' || size === 'compact'" class="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-50 -z-10 transition-all duration-500 ease-in-out"/>
        </div>

        <!-- Track Information -->
        <div :class="infoContainerClass">
            <div :class="infoContentClass">
                <!-- Title -->
                <h1 :class="titleClass">
                {{ metadata?.title || 'No track selected' }}
                </h1>          <!-- Artist -->
          <h2 :class="artistClass">
            {{ metadata?.artist || 'Unknown Artist' }}
          </h2>
          
          <!-- Metadata (full and compact only) -->
                <div v-if="size === 'full' || size === 'compact'" class="flex flex-wrap gap-6 justify-start text-slate-400 text-sm transition-all duration-1000 ease-in-out" :class="{ 'justify-center': size === 'compact' }">
                
                    <span class="flex items-center text-lg transition-all duration-1000 ease-in-out">
                        {{ formatTime(elapsedTime) }}
                    </span>                
                  </div>                  
                  <!-- Actions (full and compact only) -->
                <div v-if="size === 'full' || size === 'compact'" class="flex flex-col gap-6 justify-start mt-6 w-full" :class="{ 'items-center': size === 'compact' }">
                    
                    <!-- Volume Slider (desktop only) -->
                    <div v-if="!isMobile" class="flex items-center gap-4 w-full" :class="{ 'justify-center': size === 'compact' }">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white/60 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.5c-.69 0-1.25-.56-1.25-1.25V9.75c0-.69.56-1.25 1.25-1.25h2.25z" />
                        </svg>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01"
                            :value="currentVolume"
                            @input="handleVolumeChange"
                            class="range range-primary range-xs flex-1" 
                        />
                        <span class="text-sm text-white/60 w-8 text-right flex-shrink-0">{{ Math.round(currentVolume * 100) }}</span>
                    </div>

                    <!-- Control Buttons -->
                    <div class="flex gap-4 justify-start" :class="{ 'justify-center': size === 'compact' }">
                        <!-- Play/Pause Button -->
                        <button 
                            @click="handlePlayPause"
                            class="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                            :aria-label="playerState === 'playing' ? 'Pause' : 'Play'"
                        >
                            <!-- Play Icon -->
                            <svg v-if="playerState === 'paused' || playerState === 'stopped'" 
                                 xmlns="http://www.w3.org/2000/svg" 
                                 fill="currentColor" 
                                 viewBox="0 0 24 24" 
                                 class="w-6 h-6">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            
                            <!-- Pause Icon -->
                            <svg v-else-if="playerState === 'playing'" 
                                 xmlns="http://www.w3.org/2000/svg" 
                                 fill="currentColor" 
                                 viewBox="0 0 24 24" 
                                 class="w-6 h-6">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                            
                            <!-- Loading Icon -->
                            <svg v-else-if="playerState === 'buffering'" 
                                 xmlns="http://www.w3.org/2000/svg" 
                                 fill="none" 
                                 viewBox="0 0 24 24" 
                                 class="w-6 h-6 animate-spin">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
                            </svg>
                        </button>
                        
                        <!-- Lyrics Button -->
                        <button 
                            v-if="playbackStore.lyrics_available"
                            @click="showLyrics" 
                            class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 transition-all duration-300 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.606 1.298 2.906 2.905 2.906h9.394c1.607 0 2.905-1.3 2.905-2.906V9.375c0-1.606-1.298-2.906-2.905-2.906H4.655C3.048 6.469 1.75 7.769 1.75 9.375v2.885zM11.25 9.375v.885" />
                            </svg>
                            <span class="text-sm font-medium">Lyrics</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { usePlaybackStore } from '@/stores/playback'

const props = defineProps({
  size: {
    type: String,
    default: 'full',
    validator: (value) => ['full', 'small', 'compact'].includes(value)
  },
  metadata: Object,
  playerState: String,
  elapsedTime: Number,
  formatTime: Function
})

const emit = defineEmits(['showLyrics'])
const playbackStore = usePlaybackStore()

const isMobile = ref(false)

const currentVolume = computed(() => playbackStore.player_vol)

const updateMobileStatus = (skipVolumeChange = false) => {
  if (process.client) {
    const newIsMobile = window.innerWidth < 768
    isMobile.value = newIsMobile
    playbackStore.setMobileMode(newIsMobile, skipVolumeChange)
  }
}

const handleVolumeChange = (event) => {
  const volume = parseFloat(event.target.value)
  playbackStore.setPlayerVolume(volume)
}

const showLyrics = () => {
  emit('showLyrics', props.metadata)
}

const handlePlayPause = () => {
  playbackStore.playPause()
}

onMounted(() => {
  updateMobileStatus(true)
  if (process.client) {
    window.addEventListener('resize', updateMobileStatus)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', updateMobileStatus)
  }
})

const containerClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `fixed bottom-8 left-8 ${baseTransition}`
  }
  if (props.size === 'compact') {
    return `flex flex-col items-center justify-center h-full ${baseTransition}`
  }
  const flexDirection = isMobile.value ? 'flex-col' : 'flex-row'
  const alignment = isMobile.value ? 'items-start' : 'items-center'
  const justification = isMobile.value ? 'justify-start' : 'justify-center'
  return `flex ${flexDirection} gap-8 ${alignment} ${justification} min-h-[80vh] ${baseTransition}`
})

const innerContainerClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out flex'
  if (props.size === 'small') {
    return `flex-row items-center gap-4 relative p-4 ${baseTransition}`
  }
  if (props.size === 'compact') {
    return `flex-col items-center gap-6 relative ${baseTransition}`
  }
  const flexDirection = isMobile.value ? 'flex-col' : 'flex-row'
  const alignment = isMobile.value ? 'items-start' : 'items-center'
  const justification = isMobile.value ? 'justify-start' : 'justify-center'
  return `${flexDirection} ${alignment} ${justification} gap-8 relative ${baseTransition}`
})

const artworkContainerClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `${baseTransition}`
  }
  if (props.size === 'compact') {
    return `flex-shrink-0 relative group ${baseTransition}`
  }
  return `flex-shrink-0 relative group ${baseTransition}`
})

const artworkClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700'
  if (props.size === 'small') {
    return `w-24 h-24 shadow-lg ${baseTransition}`
  }
  if (props.size === 'compact') {
    return `w-48 h-48 rounded-2xl shadow-2xl ${baseTransition}`
  }
  const size = isMobile.value ? 'w-64 h-64' : 'w-80 h-80'
  return `${size} rounded-2xl shadow-2xl ${baseTransition}`
})

const imageClass = computed(() => {
  const baseTransition = 'w-full h-full object-cover transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return baseTransition
  }
  return `${baseTransition} group-hover:scale-105`
})

const iconContainerClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out'
  return props.size === 'small' ? baseTransition : `text-6xl text-slate-500 ${baseTransition}`
})

const iconClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out'
  return props.size === 'small' ? `w-8 h-8 text-slate-500 ${baseTransition}` : `w-24 h-24 ${baseTransition}`
})

const infoContainerClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `flex flex-col justify-center ml-4 ${baseTransition}`
  }
  if (props.size === 'compact') {
    return `text-left ${baseTransition}`
  }
  const marginLeft = isMobile.value ? 'ml-0' : 'ml-2'
  return `flex-1 max-w-xl text-left ${marginLeft} ${baseTransition}`
})

const infoContentClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `${baseTransition}`
  }
  if (props.size === 'compact') {
    return `space-y-3 flex flex-col align-center items-left ${baseTransition}`
  }
  return `space-y-4 flex flex-col align-center items-start ${baseTransition}`
})

const titleClass = computed(() => {
  const baseTransition = 'font-light text-white leading-tight transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `text-xl ${baseTransition}`
  }
  if (props.size === 'compact') {
    const size = isMobile.value ? 'text-2xl' : 'text-3xl'
    return `${size} tracking-wide ${baseTransition}`
  }
  const size = isMobile.value ? 'text-3xl' : 'text-5xl'
  return `${size} tracking-wide ${baseTransition}`
})

const artistClass = computed(() => {
  const baseTransition = 'font-light text-purple-200 opacity-90 transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `text-md ${baseTransition}`
  }
  if (props.size === 'compact') {
    const size = isMobile.value ? 'text-xl' : 'text-2xl'
    return `${size} ${baseTransition}`
  }
  const size = isMobile.value ? 'text-2xl' : 'text-3xl'
  return `${size} ${baseTransition}`
})

</script>
