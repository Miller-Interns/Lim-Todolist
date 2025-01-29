import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/enums/RouteName'
import HomeView from '../views/home-view.vue'
import TodoListView from '../views/todo-list.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.HOME,
      component: HomeView,
    },
    {
      path: '/todo',
      name: RouteName.TODOLISTVIEW,
      component: TodoListView,
    },
  ],
})

export default router
