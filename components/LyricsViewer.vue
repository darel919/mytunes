<template>
  <div v-if="show" :class="containerClass">
    <div :class="contentClass">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-light text-white">Lyrics</h3>
        <button 
          @click="$emit('close')" 
          class="p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
          aria-label="Hide lyrics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-if="playbackStore.lyrics_loading" class="flex flex-col items-center justify-center text-white/70 py-8">
        <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3"></div>
        <p class="text-sm">Loading lyrics...</p>
      </div>
      
      <div v-else-if="playbackStore.lyrics_error" class="flex flex-col items-center justify-center text-red-300 py-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mb-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p class="text-sm">{{ playbackStore.lyrics_error }}</p>
      </div>
      
      <div v-else-if="playbackStore.lyrics_text" :class="lyricsContentClass">
        <pre class="whitespace-pre-wrap sm:text-xl text-2xl font-light leading-[1.75] sm:leading-relaxed">{{ playbackStore.lyrics_text }}</pre>
      </div>
      
      <div v-else class="flex flex-col items-center justify-center text-white/50 py-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mb-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>
        <p class="text-sm">No lyrics available for this track</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlaybackStore } from '@/stores/playback'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  layout: {
    type: String,
    default: 'modal',
    validator: (value) => ['modal', 'sidebar'].includes(value)
  }
})

defineEmits(['close'])
const playbackStore = usePlaybackStore()

const containerClass = computed(() => {
  if (props.layout === 'sidebar') {
    return 'h-full flex flex-col'
  }
  return 'w-full max-w-2xl mx-auto mt-8'
})

const contentClass = computed(() => {
  if (props.layout === 'sidebar') {
    return 'bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full flex flex-col'
  }
  return 'bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10'
})

const lyricsContentClass = computed(() => {
  if (props.layout === 'sidebar') {
    return 'text-white/90 leading-relaxed flex-1 overflow-y-auto'
  }
  return 'text-white/90 leading-relaxed max-h-96 overflow-y-auto'
})
</script>
