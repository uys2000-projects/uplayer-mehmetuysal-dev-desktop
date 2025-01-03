<template>
  <div class="h-page w-full relative">
    <div class="btn btn-primary absolute top-1 right-1 rounded-box p-2 cursor-pointer z-10 hidden"
      @click="changePlayer">
      Use Mpegts Video Player
    </div>
    <video id="player" class="video-js h-full w-full" controls :src="src">
      <template v-if="mpeg || live">
        <source :src="src" type="application/x-mpegURL" />
      </template>
      <source :src="src" type="rtmp/flv" />
      <source :src="src" type="video/mp4" />
      <source :src="src" type="video/ogg">
      <source :src="src" type="video/webm">
      <source :src="src">
    </video>
  </div>
</template>

<script lang="ts">
import "video.js/dist/video-js.css"
import videojs from 'video.js';
import "@videojs/http-streaming"
import type Player from 'video.js/dist/types/player';

export default {
  emits: ["change"],
  data() {
    return {
      player: null as null | Player,
      mpeg: false,
    }
  },
  props: {
    live: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      required: true
    }
  },
  methods: {
    changePlayer() {
      this.destroyPlayer()
      this.$emit("change")
    },
    createPlayerElement() {

    },
    createPlayer() {
      console.log("create")
      let options: Record<string, any> = {
        controls: true,
      }
      if (this.live || this.mpeg) {
        options.html5 = {
          vhs: {
            overrideNative: true
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        }
        options.liveui = true
        options.liveTracker = true
        options.liveui = true
        options.type = 'application/x-mpegURL'
      }
      this.player = videojs("player", options)
      this.player.on("error", () => {
        //this.destroyPlayer()
        //this.$emit("error")
      })
      this.player.play();
    },
    destroyPlayer() {
      if (this.player) {
        this.player.dispose();
      }
    },
  },
  mounted() {
    if (this.src.endsWith(".m3u8")) this.mpeg = true
    this.createPlayer();
  },
  unmounted() {
    this.destroyPlayer()
  },
}
</script>
