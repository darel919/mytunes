<template>
  <div v-if="showBanner" :class="bannerClass" class="fixed bottom-0 left-0 right-0 text-white text-center py-1 text-sm font-medium z-50 shadow-lg">
    {{ bannerMessage }}
  </div>
</template>

<script setup>
const isOffline = ref(false)
const showConnectedMessage = ref(false)
let connectedTimeout = null

const showBanner = computed(() => isOffline.value || showConnectedMessage.value)

const bannerClass = computed(() => {
  return showConnectedMessage.value ? 'bg-green-500' : 'bg-red-500'
})

const bannerMessage = computed(() => {
  return showConnectedMessage.value ? 'You are connected to the Internet' : 'You are disconnected from the internet'
})

onMounted(() => {
  if (process.client) {
    isOffline.value = !navigator.onLine

    const handleOffline = () => {
      isOffline.value = true
      if (connectedTimeout) {
        clearTimeout(connectedTimeout)
        connectedTimeout = null
      }
      showConnectedMessage.value = false
    }

    const handleOnline = () => {
      isOffline.value = false
      showConnectedMessage.value = true
      
      connectedTimeout = setTimeout(() => {
        showConnectedMessage.value = false
      }, 4000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    onUnmounted(() => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
      if (connectedTimeout) {
        clearTimeout(connectedTimeout)
      }
    })
  }
})
</script>
