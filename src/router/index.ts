import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/home-view.vue'
import TodoListView from '../views/todo-list.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/todo',
      name: 'todoListView',
      component: TodoListView,
    },
  ],
})

export default router
