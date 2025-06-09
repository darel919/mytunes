<script setup>
import { useLibraryStore } from '@/stores/library';
const store = useLibraryStore();
const api = useRuntimeConfig().public.endpoint;
async function getLibrary() {
    if(store.library.length == 0) {
        try {
            const response = await fetch(`${api}/library`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            store.setLibrary(data);
        }
        catch (error) {
            console.error('Error fetching library:', error);
        }
    }
}
onMounted(() => {
    getLibrary()
});
</script>

<template></template>