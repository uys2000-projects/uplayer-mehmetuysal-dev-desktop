<template>
  <div class="h-page w-full player-wrapper">
    <template v-if="loaded">
      <template v-if="useVideoJs">
        <VPlayer :src="url" :live="isChannel" @change="useVideoJs = false" />
      </template>
      <template v-else>
        <MPlayer :src="url" :live="isChannel" @change="useVideoJs = true" />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import MPlayer from '../components/shared/MPlayer.vue';
import VPlayer from '../components/shared/VPlayer.vue';

import { usePlaylistStore } from '../stores/playlist';
import { filterBatcher } from '../services/batcher';
import { UPlayListItem } from '../types/playlist';

export default {
  components: { VPlayer, MPlayer },
  data() {
    return {
      playlistStore: usePlaylistStore(),
      isChannel: false,
      useVideoJs: true,
      url: "",
      loaded: false
    }
  },
  methods: {
    isChannelUrl(url: string) {
      return url.search(/[.][^.\/]*$/) == -1;
    },
    async loadPlaylist() {
      const playlist = (await window.fileSystemApi.readFileObject("playlist").catch(() => { })) as UPlayListItem[] | undefined;
      if (playlist) this.playlistStore.playlist = playlist;
    },
    async loadSource() {
      const line = this.$route.params.id
      const item = (await filterBatcher<UPlayListItem>(this.playlistStore.playlist, (item) => item.line == line ? item : undefined))
      this.url = item[0].url
    },
  },
  async mounted() {
    if (this.$route.params.id) {
      if (this.playlistStore.playlist.length == 0) await this.loadPlaylist()
      await this.loadSource()
      this.isChannel = this.isChannelUrl(this.url)
      this.loaded = true
    }
  },
}
</script>

<style>
.player-wrapper:has(video:where(:target, :active, :hover)) .btn,
.btn:hover {
  display: inline-flex;
}
</style>