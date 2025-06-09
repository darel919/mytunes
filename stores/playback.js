import { defineStore } from 'pinia'

export const usePlaybackStore = defineStore('playback', {           
    state: () => ({
        timer_interval: 15000,
        isFullscreen: false,
        shouldShowMiniPlayer: false,

        player_state: 'stopped',
        player_remote: 'ready',
        player_vol: 0.8,
        saved_volume: 0.8,
        is_mobile_mode: false,
        stream_src: null,
        stream_api: null,

        current_metadata: null,
        selected_track: null,
        elapsed_time: 0,

        lyrics_text: null,
        lyrics_loading: false,
        lyrics_error: null,
        lyrics_available: false,
    }),
    actions: {            
        setCurrentTrack(item) {
            if(item.stream_src && item.stream_api) {
                this.stream_src = item.stream_src
                this.stream_api = item.stream_api
                this.selected_track = item
                console.warn('Setting current track:', item)
                
                if (item.id) {
                    this.clearLyrics()
                }
            } else {
                console.error('No stream source provided for the current track.')
            }
        },
        setPlayerState(state) {
            this.player_state = state        
        },              
        setMetadata(metadata) {
            const previousSongId = this.current_metadata?.song_id
            this.current_metadata = metadata
            
            if (metadata?.song_id && metadata.song_id !== previousSongId) {
                this.clearLyrics()
                this.fetchLyrics()
            }
        },
        setElapsedTime(time) {
            this.elapsed_time = time
        },          
        setFullscreen(isFullscreen) {
            this.isFullscreen = isFullscreen
        },
        setShouldShowMiniPlayer(shouldShow) {
            this.shouldShowMiniPlayer = shouldShow
        },
        async fetchLyrics() {
            if(!this.current_metadata || !this.current_metadata.song_id) {
                this.lyrics_error = 'No current track metadata available'
                this.lyrics_available = false
                this.lyrics_loading = false
                return
            }
            this.lyrics_loading = true
            this.lyrics_error = null
            
            try {
                console.warn('Fetching lyrics for song ID:', this.current_metadata.song_id)
                const api = useRuntimeConfig().public.endpoint;
                const response = await fetch(`${api}/lyrics?id=${encodeURIComponent(this.current_metadata.song_id)}`, {
                    headers: {
                        'X-App': 'myTunes',
                        'X-Env': process.env.NODE_ENV
                    }
                })
                
                if (!response.ok) {
                    if (response.status === 404) {
                        this.lyrics_error = 'Lyrics not found'
                        this.lyrics_available = false
                    } else {
                        this.lyrics_error = `Failed to fetch lyrics: ${response.statusText}`
                        this.lyrics_available = false
                    }
                    return
                }
                
                const data = await response.json()
                this.lyrics_text = data.lyrics || data.text || ''
                
                if (!this.lyrics_text) {
                    this.lyrics_error = 'No lyrics content available'
                    this.lyrics_available = false
                } else {
                    this.lyrics_available = true
                }
            } catch (err) {
                console.error('Error fetching lyrics:', err)
                this.lyrics_error = 'Failed to load lyrics'
                this.lyrics_available = false
            } finally {
                this.lyrics_loading = false
            }
        },        
        clearLyrics() {
            console.warn('Clearing lyrics for current track')
            this.lyrics_text = null
            this.lyrics_error = null
            this.lyrics_available = false
            this.lyrics_loading = false
        },
        setPlayerRemote(remote) {
            this.player_remote = remote
        },
        setPlayerVolume(volume) {
            this.player_vol = volume
            if (!this.is_mobile_mode) {
                this.saved_volume = volume
            }
            if (process.client) {
                localStorage.setItem('mytunes_volume', volume.toString())
            }
        },        
        loadPlayerVolume() {
            if (process.client) {
                const savedVolume = localStorage.getItem('mytunes_volume')
                if (savedVolume !== null) {
                    const vol = parseFloat(savedVolume)
                    this.player_vol = vol
                    this.saved_volume = vol
                } else {
                    this.player_vol = 0.7
                    this.saved_volume = 0.7
                }
            }
        },
        playPause() {
            this.player_remote = this.player_state === 'playing' ? 'pause' : 'play'
        },        
        setMobileMode(isMobile, skipVolumeChange = false) {
            this.is_mobile_mode = isMobile
            if (!skipVolumeChange) {
                if (isMobile) {
                    this.setPlayerVolume(0.8)
                } else {
                    this.setPlayerVolume(this.saved_volume)
                }
            }
        }
    },
})