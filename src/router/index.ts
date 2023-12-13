import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/problems' },
    {
      path: '/productions',
      name: 'home',
      props: true,
      component: () => import('@/views/ProductionsListView.vue')
    },
    {
      path: '/platform-presentation',
      name: 'platformPresentation',
      component: () => import('@/views/PlatformPresentationView.vue')
    },
    {
      path: '/resources',
      name: 'resourcesList',
      component: () => import('@/views/ResourcesListView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/thought_outputs/:id',
      name: 'seeArticle',
      props: true,
      component: () => import('@/views/SeeResourceView.vue')
    },
    {
      path: '/resources/:id',
      name: 'seeResource',
      props: true,
      component: () => import('@/views/SeeResourceView.vue')
    },
    {
      path: '/thought_inputs/:id',
      name: 'seeThoughtInput',
      props: true,
      component: () => import('@/views/SeeThoughtInputView.vue')
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
      path: '/friends',
      name: 'friendsList',
      component: () => import('@/views/UsersView.vue')
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
