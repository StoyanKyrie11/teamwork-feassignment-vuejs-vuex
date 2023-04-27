import { createRouter, createWebHistory } from "vue-router";
import CharacterData from "../components/CharacterData.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/people/:id",
      name: "character",
      component: CharacterData,
    },
  ],
});

export default router;

