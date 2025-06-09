import { defineStore } from 'pinia'

export const usePlaybackStore = defineStore('playback', {
   state: () => ({
        timer_interval: 15000,
        isFullscreen: false,

        player_state: 'stopped',
        stream_src: null,
        stream_api: null,

        current_metadata: null,
        elapsed_time: 0,
    }),
    actions: {
        setCurrentTrack(item) {
            if(item.stream_src && item.stream_api) {
                this.stream_src = item.stream_src
                this.stream_api = item.stream_api
                console.warn('Setting current track:', item)
            } else {
                console.error('No stream source provided for the current track.')
            }
        },
        setPlayerState(state) {
            this.player_state = state        
        },
        setMetadata(metadata) {
            this.current_metadata = metadata        },
        setElapsedTime(time) {
            this.elapsed_time = time
        },
        setFullscreen(isFullscreen) {
            this.isFullscreen = isFullscreen
        }
    },
})