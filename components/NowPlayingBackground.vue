<template>
  <div>
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
      :style="backgroundStyle"
    >
      <div 
        class="absolute inset-0 transition-all duration-1000 ease-in-out"
        :class="overlayClass"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  background: String,
  isInactive: Boolean
})

const backgroundStyle = computed(() => {
  if (props.background) {
    return {
      backgroundImage: `url(${props.background})`,
      opacity: 1
    }
  }
  return {
    background: 'linear-gradient(to bottom right, rgb(15 23 42), rgb(88 28 135), rgb(15 23 42))',
    opacity: 1
  }
})

const overlayClass = computed(() => 
  props.isInactive ? 'bg-black/20' : 'bg-black/70 backdrop-blur-xs'
)
</script>
