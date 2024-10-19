import type { RouteRecordRaw } from "vue-router";

export const routes = [
  {
    path: "/",
    name: "Layout",
    component: () => import("../layouts/Layout.vue"),
    meta: { title: "Base" },
    children: [
      {
        path: "",
        name: "HomeView",
        component: () => import("../views/HomeView.vue"),
        meta: { title: "Home" },
      },
      {
        path: "about",
        name: "AboutView",
        component: () => import("../views/AboutView.vue"),
        meta: { title: "About" },
      },
    ],
  },
] as RouteRecordRaw[];
