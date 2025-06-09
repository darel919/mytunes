<template>
  <div :class="containerClass">
    <div :class="innerContainerClass">
      
        <!-- Background overlay for small mode -->
        <div v-if="size === 'small'" class="absolute inset-0 bg-gradient-to-r bg-black/30 rounded-xl backdrop-blur-md transition-all duration-500 ease-in-out -z-10"></div>
      
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
            <div v-if="size === 'full'" class="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-50 -z-10 transition-all duration-500 ease-in-out"></div>
        </div>

        <!-- Track Information -->
        <div :class="infoContainerClass">
            <div :class="infoContentClass">
                <!-- Title -->
                <h1 :class="titleClass">
                {{ metadata?.title || 'No track selected' }}
                </h1>

                <!-- Artist -->
                <h2 :class="artistClass">
                {{ metadata?.artist || 'Unknown Artist' }}
                </h2>

                <!-- Metadata (full only) -->
                <div v-if="size === 'full'" class="flex flex-wrap gap-6 justify-center lg:justify-start text-slate-400 text-sm transition-all duration-1000 ease-in-out">
                    <span v-if="metadata?.year" class="flex items-center gap-2 transition-all duration-1000 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 transition-all duration-1000 ease-in-out">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 21 9v7.5m-9-13.5h.008v.008H12V8.25Z" />
                        </svg>
                        {{ metadata.year }}
                    </span>
            
                
                    <span class="flex items-center text-lg transition-all duration-1000 ease-in-out">
                        {{ formatTime(elapsedTime) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'full',
    validator: (value) => ['full', 'small'].includes(value)
  },
  metadata: Object,
  playerState: String,
  elapsedTime: Number,
  formatTime: Function
})

const containerClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `fixed bottom-8 left-8 ${baseTransition}`
  }
  return `flex flex-col lg:flex-row gap-8 items-center justify-center min-h-[80vh] ${baseTransition}`
})

const innerContainerClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out flex flex-row'
  if (props.size === 'small') {
    return `items-center gap-4 relative p-4 ${baseTransition}`
  }
  return `${baseTransition} items-center justify-center gap-8 relative`
})

const artworkContainerClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return baseTransition
  }
  return `flex-shrink-0 relative group ${baseTransition}`
})

const artworkClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700'
  if (props.size === 'small') {
    return `w-24 h-24 rounded-lg shadow-lg ${baseTransition}`
  }
  return `w-64 h-64 lg:w-80 lg:h-80 rounded-2xl shadow-2xl ${baseTransition}`
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
  return `flex-1 max-w-xl text-center lg:text-left ml-2 ${baseTransition}`
})

const infoContentClass = computed(() => {
  const baseTransition = 'transition-all duration-1000 ease-in-out space-x-6'
  return props.size === 'small' ? baseTransition : `space-y-4 ${baseTransition}`
})

const titleClass = computed(() => {
  const baseTransition = 'font-light text-white leading-tight transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `text-xl ${baseTransition}`
  }
  return `text-3xl lg:text-5xl tracking-wide ${baseTransition}`
})

const artistClass = computed(() => {
  const baseTransition = 'font-light text-purple-200 opacity-90 transition-all duration-1000 ease-in-out'
  if (props.size === 'small') {
    return `text-md ${baseTransition}`
  }
  return `text-2xl lg:text-3xl ${baseTransition}`
})

</script>
