<template>
  <div class="h-page w-full">
    <template v-if="loaded">
      <template v-if="isChannel">
        <LivePlayer :src="url" />
      </template>
      <template v-else>
        <Player :src="url" @error="() => isChannel = true" />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import LivePlayer from '../components/shared/LivePlayer.vue';
import Player from '../components/shared/Player.vue';

import { usePlaylistStore } from '../stores/playlist';
import { filterBatcher } from '../services/batcher';
import { UPlayListItem } from '../types/playlist';

export default {
  components: { LivePlayer, Player },
  data() {
    return {
      playlistStore: usePlaylistStore(),
      isChannel: undefined as undefined | boolean,
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