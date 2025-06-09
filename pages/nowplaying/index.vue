<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background -->
    <NowPlayingBackground 
      :background="currentMetadata?.background" 
      :isInactive="isInactive" 
    />    
    <!-- Content -->
    <div v-if="!isInactive" class="container mx-auto px-6 py-8 relative z-10">        <!-- Desktop Layout with Sidebar -->
      <div :class="['gap-8 h-[80vh] items-stretch', isMobile ? 'hidden' : 'flex']" v-if="showLyricsModal">
        <!-- Left Side - Compact Player Data -->
        <div :class="[isMobile ? 'w-full' : 'w-1/2', 'flex items-center justify-center']">
          <NowPlayingData 
            size="compact"
            :metadata="currentMetadata"
            :playerState="playerState"
            :elapsedTime="elapsedTime"
            :formatTime="formatTime"
            @showLyrics="handleShowLyrics"
          />
        </div>        
        <!-- Right Side - Lyrics -->
        <div :class="[isMobile ? 'w-full' : 'w-1/2', 'flex flex-col min-h-0']">          
          <LyricsViewer 
            :show="true"
            layout="sidebar"
            @close="handleCloseLyrics"
          />
        </div>
      </div>
      <!-- Default Layout (No Lyrics or Mobile) -->
      <div v-else>
        <NowPlayingData 
          size="full"
          :metadata="currentMetadata"
          :playerState="playerState"
          :elapsedTime="elapsedTime"
          :formatTime="formatTime"
          @showLyrics="handleShowLyrics"
        />
      </div>      
      <!-- Mobile Lyrics Modal -->
      <div :class="[isMobile ? 'block' : 'hidden']" v-if="showLyricsModal">        
        <LyricsViewer 
          :show="showLyricsModal"
          layout="modal"
          @close="handleCloseLyrics"
        />      
      </div>      
      <!-- Back Button -->
      <div class="fixed bottom-8 left-8 transition-all duration-1000 ease-in-out">
        <button 
          @click="navigateBack()"
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 transition-all duration-300 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span v-if="!isMobile" class="text-sm font-medium">Back to Library</span>
        </button>
      </div>
      
      <!-- Play/Pause Button -->
    
    </div>      
    <!-- Inactive View -->
    <NowPlayingData 
      v-else
      size="small"
      :metadata="currentMetadata"
      :playerState="playerState"
      :elapsedTime="elapsedTime"
      :formatTime="formatTime"
    />
  </div>
</template>

<script setup>

import { usePlaybackStore } from '~/stores/playback'

const playbackStore = usePlaybackStore()
const route = useRoute()
const router = useRouter()
const isInactive = ref(false)
const showLyricsModal = ref(false)
const isMobile = ref(false)
let inactivityTimer = null

const currentMetadata = computed(() => playbackStore.current_metadata)
const playerState = computed(() => playbackStore.player_state)
const elapsedTime = computed(() => playbackStore.elapsed_time)

function navigateBack() {
  // if (isMobile.value) {
  //   router.push('/')
  // } else {
  //   router.back()
  // }
  router.push('/')
}
const updateMobileStatus = (skipVolumeChange = false) => {
  if (process.client) {
    const newIsMobile = window.innerWidth < 768
    isMobile.value = newIsMobile
    playbackStore.setMobileMode(newIsMobile, skipVolumeChange)
  }
}

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const updateUrlParams = () => {
  const query = { ...route.query }
  if (showLyricsModal.value) {
    query.showLyrics = 'true'
  } else {
    delete query.showLyrics
  }
  router.replace({ query })
}

const resetInactivityTimer = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer)
  
  if (isInactive.value) {
    isInactive.value = false
  }
  
  if (!isMobile.value && playerState.value === 'playing' && currentMetadata.value?.background && !showLyricsModal.value) {
    inactivityTimer = setTimeout(() => {
      if (!isMobile.value && playerState.value === 'playing' && currentMetadata.value?.background && !showLyricsModal.value) {
        isInactive.value = true
      }
    }, 10000)
  }
}

const handleUserActivity = () => {
  if (!isMobile.value && playerState.value === 'playing' && currentMetadata.value?.background && !showLyricsModal.value) {
    resetInactivityTimer()
  }
}

const handleShowLyrics = () => {
  showLyricsModal.value = true
  updateUrlParams()
  if (inactivityTimer) clearTimeout(inactivityTimer)
  if (isInactive.value) {
    isInactive.value = false
  }
}

const handleCloseLyrics = () => {
  showLyricsModal.value = false
  updateUrlParams()
  resetInactivityTimer()
}

const handlePlayPause = () => {
  playbackStore.playPause()
}

const shouldShowMiniPlayer = computed(() => {
  return isMobile.value && showLyricsModal.value
})

watch([playerState, currentMetadata, showLyricsModal], ([newState, newMetadata, lyricsShown]) => {
  if (!isMobile.value && newState === 'playing' && newMetadata?.background && !lyricsShown) {
    if (!isInactive.value) {
      resetInactivityTimer()
    }
  } else {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (isInactive.value && !lyricsShown) {
      isInactive.value = false
    }
  }
})

watch(isMobile, (newIsMobile) => {
  if (newIsMobile && isInactive.value) {
    isInactive.value = false
  }
  if (newIsMobile && inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
})

watch(shouldShowMiniPlayer, (shouldShow) => {
  playbackStore.setShouldShowMiniPlayer(shouldShow)
})

watch(() => route.query.showLyrics, (newShowLyrics) => {
  showLyricsModal.value = newShowLyrics === 'true'
})

onMounted(() => {
  playbackStore.setFullscreen(true)
  
  updateMobileStatus(true)
  
  if (route.query.showLyrics === 'true') {
    showLyricsModal.value = true
  }
  
  const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
  events.forEach(event => document.addEventListener(event, handleUserActivity))
  
  window.addEventListener('resize', updateMobileStatus)
    resetInactivityTimer()
})

onUnmounted(() => {
  playbackStore.setFullscreen(false)
  playbackStore.setShouldShowMiniPlayer(false)
  
  if (inactivityTimer) clearTimeout(inactivityTimer)
  
  const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
  events.forEach(event => document.removeEventListener(event, handleUserActivity))
  
  window.removeEventListener('resize', updateMobileStatus)
})

useHead({
  title: computed(() => {
    const metadata = currentMetadata.value
    if (metadata?.title && metadata?.artist) {
      return `${metadata.title} - ${metadata.artist} | MyTunes`
    }
    return 'Now Playing | MyTunes'
  })
})
</script>