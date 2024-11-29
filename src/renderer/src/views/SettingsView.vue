<template>
  <div class="w-full h-full flex flex-col lg:flex-row flex-nowrap p-4 gap-4 overflow-hidden"
    :class="{ 'pb-12': appStore.adLoaded }">
    <div class="w-full max-h-full rounded-box overflow-hidden bg-black flex">
      <img src="/logo.jpg" alt="logo" class="max-h-full overflow-hidden m-auto">
    </div>
    <div class="w-full">
      <div class="flex flex-col gap-4 mb-4">
        <span class="text-xl">Settings</span>
        <div class="flex flex-col gap-2">
          <div>
            <span>M3U File URL:</span>
            <div class="join w-full items-center">
              <div class="input input-bordered w-full flex items-center gap-2 join-item">
                <input type="text" class="grow h-full" placeholder="https://url.com/" v-model="url" />
              </div>
              <div class="indicator">
                <button class="btn join-item tooltip tooltip-left" @click="getUrl"
                  data-tip="To access playlist you should load Playlist, there is no auto update you should periodically press this button.">Load
                  Playlist</button>
              </div>
            </div>
          </div>
          <div>
            <span>Easy Access Code (For Playlist URL Sharing)
              <div class="tooltip tooltip-bottom"
                data-tip="You can create short access codes to your playlist url. (You should remove it after usage to protect your url)">
                <span class="material-symbols-outlined text-xs mb-auto cursor-pointer select-none">
                  help
                </span>
              </div>
            </span>
            <div class="join w-full items-center">
              <div class="input input-bordered w-full flex items-center gap-2 join-item min-w-16">
                <input type="text" class="grow h-full min-w-0" placeholder="" v-model="code" />
              </div>
              <button class="btn join-item tooltip tooltip-left" data-tip="You can create access code to Playlist URL"
                @click="createAccessCode">Create</button>
              <button class="btn join-item tooltip tooltip-left"
                data-tip="You can access your Playlist URL with access code" @click="getAccessCode">Get</button>
              <button class="btn join-item tooltip tooltip-left"
                data-tip="You can remove your access code to protect your Playlist URL"
                @click="deleteAccessCode">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ACCESSCODE, PLAYLIST } from '../constant';
import { deleteDocument, getDocument, increaseDocument, setDocument } from '../services/firebase/firestore';
import { parse } from '../services/parser';
import { encode } from '../services/sqids';
import { useAppStore } from '../stores/app';
import { usePlaylistStore } from '../stores/playlist';
import type { UPlayListItem } from '../types/playlist';

export default {
  data() {
    return {
      url: "",
      code: "",
      playlistStore: usePlaylistStore(),
      appStore: useAppStore()
    }
  },
  methods: {
    async getIndex() {
      let index = 0;
      const indexDoc = await getDocument(ACCESSCODE, "-index")
      if (indexDoc.exists()) index = indexDoc.data().index
      return index
    },
    async updateChannels(data: string) {
      const playlist = parse.uLog(data)
      await window.fileSystemApi.writeFileObject(PLAYLIST, playlist.items.map(i => ({ line: i.line, url: i.url, name: i.name, group: i.group.title, img: i.tvg.logo } as UPlayListItem)))
    },
    async getUrl() {
      this.appStore.toast = "info"
      this.appStore.toastLabel = "Loading..."
      localStorage.setItem("url", this.url)
      const response = await window.axios.get(this.url, {})
      if (response.status == 200) {
        await this.updateChannels(response.data)
      }
      this.appStore.toast = "success"
      this.appStore.toastLabel = "Loaded "
    },
    async createAccessCode() {
      localStorage.setItem("url", this.url)
      const code = encode(await this.getIndex())
      await setDocument.uLog(ACCESSCODE, code, { url: this.url, timesamp: Date.now() })
      await increaseDocument.uLog(ACCESSCODE, "-index", "index").catch(() => {
        return setDocument.uLog(ACCESSCODE, "-index", { index: 1 })
      })
      this.code = code
      localStorage.setItem("code", this.code)
    },
    async getAccessCode() {
      if (!this.code) return
      localStorage.setItem("code", this.code)
      const urlRef = await getDocument.uLog(ACCESSCODE, this.code)
      console.log(urlRef.exists())
      if (urlRef.exists()) {
        this.url = urlRef.data().url
        localStorage.setItem("url", urlRef.data().url)

      }
    },
    async deleteAccessCode() {
      if (!this.code) return
      await deleteDocument.uLog(ACCESSCODE, this.code)
      localStorage.removeItem("code")
      this.code = ""
    }
  },
  async mounted() {
    let [url, code] = [localStorage.getItem("url"), localStorage.getItem("code")]
    if (code) {
      const urlRef = await getDocument.uLog(ACCESSCODE, code)
      if (!urlRef.exists()) {
        code = ""
        localStorage.removeItem("code")
      }
    }
    this.url = url || ""
    this.code = code || ""
  }
}
</script>

<style>
.input:focus,
.input input:focus,
.input:focus-within {
  outline: none;
}
</style>