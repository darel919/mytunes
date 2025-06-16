<template>
  <div v-if="showPrompt" :class="promptClass" class="fixed top-0 left-0 right-0 text-white p-4 shadow-xl z-50 border-b-2">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div v-if="promptType === 'update'" class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-lg">{{ promptTitle }}</h3>
          <p class="text-sm" :class="promptTextClass">{{ promptMessage }}</p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button
          @click="primaryAction"
          :class="primaryButtonClass"
          class="px-6 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-all duration-200 transform shadow-lg"
        >
          {{ primaryButtonText }}
        </button>
        <button
          @click="dismissPrompt"
          :class="secondaryButtonClass"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const showPrompt = ref(false)
const promptType = ref(null)
let deferredPrompt = null
let refreshing = false

const promptClass = computed(() => {
  if (promptType.value === 'install') {
    return 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-600'
  }
  return 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-700'
})

const promptTitle = computed(() => {
  return promptType.value === 'install' ? 'Install myTunes' : 'Update Available'
})

const promptMessage = computed(() => {
  return promptType.value === 'install' 
    ? 'Get the full app experience on your device'
    : 'A new version of myTunes is ready to install'
})

const promptTextClass = computed(() => {
  return promptType.value === 'install' ? 'text-orange-100' : 'text-blue-100'
})

const primaryButtonText = computed(() => {
  return promptType.value === 'install' ? 'Install Now' : 'Update Now'
})

const primaryButtonClass = computed(() => {
  if (promptType.value === 'install') {
    return 'bg-white text-orange-600 hover:bg-orange-50'
  }
  return 'bg-white text-blue-600 hover:bg-blue-50'
})

const secondaryButtonClass = computed(() => {
  if (promptType.value === 'install') {
    return 'bg-orange-600 bg-opacity-50 text-white hover:bg-opacity-70 border-orange-400'
  }
  return 'bg-blue-700 bg-opacity-50 text-white hover:bg-opacity-70 border-blue-400'
})

onMounted(() => {
  if (process.client) {
    setupInstallPrompt()
    setupUpdatePrompt()
  }
})

const setupInstallPrompt = () => {
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    return
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    if (!showPrompt.value) {
      promptType.value = 'install'
      showPrompt.value = true
    }
  })

  window.addEventListener('appinstalled', () => {
    if (promptType.value === 'install') {
      showPrompt.value = false
      promptType.value = null
    }
    deferredPrompt = null
  })
}

const setupUpdatePrompt = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              promptType.value = 'update'
              showPrompt.value = true
            }
          })
        }
      })
    })

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  }
}

const primaryAction = async () => {
  if (promptType.value === 'install') {
    await installPWA()
  } else if (promptType.value === 'update') {
    updateApp()
  }
}

const installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      showPrompt.value = false
      promptType.value = null
    }
    deferredPrompt = null
  }
}

const updateApp = () => {
  if (process.client && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    })
    showPrompt.value = false
    promptType.value = null
  }
}

const dismissPrompt = () => {
  if (promptType.value === 'install') {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }
  showPrompt.value = false
  promptType.value = null
}
</script>
