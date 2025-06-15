<script setup>
import { usePlaybackStore } from '@/stores/playback';
const store = usePlaybackStore();

let intervalId = null;

const fetchMetadata = async () => {
    if (store.stream_api) {
        try {
            const response = await fetch(store.stream_api, {
                headers: {
                    'X-App': 'myTunes',
                    'X-Env': process.env.NODE_ENV
                }
            });              const data = await response.json();
            store.setMetadata(data);
            
            if (data?.artwork_rgb) {
                const hexColor = `#${data.artwork_rgb.r.toString(16).padStart(2, '0')}${data.artwork_rgb.g.toString(16).padStart(2, '0')}${data.artwork_rgb.b.toString(16).padStart(2, '0')}`
                store.setThemeColor(hexColor, data.artwork_rgb)
            } else {
                store.clearThemeColor()
            }
        } catch (error) {
            console.error('Error fetching metadata:', error);
        }
    }
};

const startFetching = () => {
    stopFetching();
    if (store.stream_api) {
        fetchMetadata();
        intervalId = setInterval(fetchMetadata, store.timer_interval);
    }
};

const stopFetching = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

watch(() => store.stream_api, (newApi) => {
    if (newApi) {
        startFetching();
    } else {
        stopFetching();
    }
});

onMounted(() => {
    startFetching();
});

onUnmounted(() => {
    stopFetching();
});
</script>
<template>

</template>