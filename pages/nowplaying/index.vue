<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background -->
    <NowPlayingBackground 
      :background="currentMetadata?.background" 
      :isInactive="isInactive" 
    />
    
    <!-- Content -->
    <div v-if="!isInactive" class="container mx-auto px-6 py-8 relative z-10">
      <NowPlayingData 
        size="full"
        :metadata="currentMetadata"
        :playerState="playerState"
        :elapsedTime="elapsedTime"
        :formatTime="formatTime"
      />
        <!-- Back Button -->
      <div class="fixed bottom-8 left-8 transition-all duration-1000 ease-in-out">
        <NuxtLink 
          to="/" 
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 transition-all duration-300 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span class="text-sm font-medium">Back to Library</span>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Inactive View -->
    <NowPlayingData 
      v-else
      size="small"
      :metadata="currentMetadata"
      :formatTime="formatTime"
    />
  </div>
</template>

<script setup>

import { usePlaybackStore } from '~/stores/playback'

const playbackStore = usePlaybackStore()
const isInactive = ref(false)
let inactivityTimer = null

const currentMetadata = computed(() => playbackStore.current_metadata)
const playerState = computed(() => playbackStore.player_state)
const elapsedTime = computed(() => playbackStore.elapsed_time)

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const resetInactivityTimer = () => {
  if (isInactive.value) isInactive.value = false
  if (inactivityTimer) clearTimeout(inactivityTimer)
  
  if (playerState.value === 'playing' && currentMetadata.value?.background) {
    inactivityTimer = setTimeout(() => {
      isInactive.value = true
    }, 10000)
  }
}

const handleUserActivity = () => resetInactivityTimer()

watch([playerState, currentMetadata], ([newState, newMetadata]) => {
  if (newState === 'playing' && newMetadata?.background) {
    resetInactivityTimer()
  } else {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    isInactive.value = false
  }
})

onMounted(() => {
  playbackStore.setFullscreen(true)
  
  const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
  events.forEach(event => document.addEventListener(event, handleUserActivity))
  
  resetInactivityTimer()
})

onUnmounted(() => {
  playbackStore.setFullscreen(false)
  
  if (inactivityTimer) clearTimeout(inactivityTimer)
  
  const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
  events.forEach(event => document.removeEventListener(event, handleUserActivity))
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