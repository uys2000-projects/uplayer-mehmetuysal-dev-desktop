<template>
  <div class="h-page w-full">
    <video id="player" class="video-js h-full w-full" controls :src="src">
      <source :src="src" type="application/x-mpegURL" />
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
  emits: ["error"],
  data() {
    return {
      player: null as null | Player
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
    createPlayer() {
      if (this.live) {
        this.player = videojs("player", {
          html5: {
            vhs: {
              overrideNative: true
            },
            nativeAudioTracks: false,
            nativeVideoTracks: false
          },
          type: 'application/x-mpegURL',
          liveui: true,
          liveTracker: true,
          controls: true,
        })
        this.player.on("error", () => {
          this.destroyPlayer();
          this.$emit("error")
        })
        this.player.play();
      } else {
        this.player = videojs("player", {
          autoplay: true,
          controls: true,
        })
        this.player.on("error", () => {
          this.destroyPlayer();
          this.$emit("error")
        })
        this.player.load();
        this.player.play();
      }
    },
    destroyPlayer() {
      if (this.player) {
        this.player.dispose();
      }
    },
  },
  mounted() {
    this.createPlayer();
  },
  unmounted() {
    this.destroyPlayer()
  },
}
</script>
