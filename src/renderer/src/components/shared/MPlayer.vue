<template>
  <div class="h-page w-full relative">
    <div class="btn btn-primary absolute top-1 right-1 rounded-box p-2 cursor-pointer z-10 hidden"
      @click="changePlayer">
      Use HTML5 Video Player
    </div>
    <video id="player" class="h-full w-full" controls></video>
  </div>
</template>

<script lang="ts">
import Mpegts from "mpegts.js";
let type: "mse" | "mpegts" | "m2ts" | "flv" = "m2ts";

export default {
  data() {
    return {
      player: null as null | Mpegts.Player,
    }
  },
  props: {
    src: {
      type: String,
      required: true
    },
    posterUrl: {
      type: String,
      required: false,
      default: ''
    },
    live: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    changePlayer() {
      this.destroyPlayer()
      this.$emit("change")
    },
    createPlayer() {
      if (Mpegts.getFeatureList().mseLivePlayback && this.src) {
        const videElement = document.getElementById("player") as HTMLVideoElement
        this.player = Mpegts.createPlayer({
          type: type,
          isLive: this.live,
          url: this.src,
        });
        this.player.attachMediaElement(videElement);
        this.player.load();
        this.player.play();
      }
    },
    destroyPlayer() {
      if (this.player) {
        this.player.unload();
      }
    }
  },
  mounted() {
    this.createPlayer()
  },
  unmounted() {
    this.destroyPlayer()
  }
}
</script>
