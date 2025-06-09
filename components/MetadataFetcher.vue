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
            });
            const data = await response.json();
            // console.log('Metadata fetched:', data);
            store.setMetadata(data);
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
        console.log('New stream API:', newApi);
        startFetching();
    } else {
        stopFetching();
    }
});

onMounted(() => {
    console.log('MetadataFetcher component mounted');
    startFetching();
});

onUnmounted(() => {
    stopFetching();
});
</script>
<template>

</template>