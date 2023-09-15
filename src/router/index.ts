import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      props: true,
      component: HomeView
    },
    {
      path: '/platform-presentation',
      name: 'platformPresentation',
      component: () => import('@/views/PlatformPresentation.vue')
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
      path: '/thought_outputs/:id',
      name: 'seeArticle',
      props: true,
      component: () => import('@/views/SeeArticle.vue')
    },
    {
        path: '/thought_inputs',
        name: 'thoughtInputs',
        props: false,
        component: () => import('@/views/ThoughtInputsView.vue')
    },
    {
      path: '/problems',
      name: 'problemsList',
      component: () => import('@/views/ProblemsView.vue')
    },
    {
      path: '/articles/:id/edit',
      name: 'editArticle',
      props: true,
      component: () => import('@/views/EditArticle.vue')
    },
    {
      path: '/users/:pageUserId',
      name: 'userFeed',
      props: true,
      component: () => import('@/views/UserFeedView.vue')
    },
    {
      path: '/writer',
      name: 'writer',
      component: () => import('@/views/WriterView.vue')
    }
  ]
})

export default router
