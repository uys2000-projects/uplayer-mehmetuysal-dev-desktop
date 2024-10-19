<template>
  <router-view v-slot="{ Component }">
    <transition name="layout">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/app'
export default {
  components: {
    RouterView
  },
  data() {
    return {
      appStore: useAppStore()
    }
  },
  methods: {
    loadTheme() {
      const theme = localStorage.getItem("theme")
      this.appStore.theme = theme || "light"
      document.body.setAttribute("data-theme", this.appStore.theme || "light");
    },
  },
  async mounted() {
    this.loadTheme()
  }
}
</script>


<style>
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.5s ease;
  position: absolute;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>