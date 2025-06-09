import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', {
   state: () => ({
        library: [],
    }),
    getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++
        },
        setLibrary(library) {
            this.library = library
        },
    },
})