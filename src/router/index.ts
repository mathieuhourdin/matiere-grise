import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/articles/new',
      name: 'writeArticle',
      props: false,
      component: () => import('@/views/WriteArticle.vue')
    },
    {
      path: '/articles/:uuid',
      name: 'seeArticle',
      props: true,
      component: () => import('@/views/SeeArticle.vue')
    },
    {
      path: '/articles/:id/edit',
      name: 'editArticle',
      props: true,
      component: () => import('@/views/EditArticle.vue')
    },
    {
      path: '/writer',
      name: 'writer',
      component: () => import('@/views/WriterView.vue')
    },
  ]
})

export default router
