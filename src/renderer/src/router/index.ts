import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

router.beforeEach((to, from) => {
  document.title = `${to.meta.title} | Mehmet Uysal`
})

export default router
