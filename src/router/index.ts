import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/composables/useUser'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/feed' },
    {
      path: '/feed',
      name: 'feed',
      component: () => import('@/views/FeedView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/create-resource',
      name: 'createResource',
      component: () => import('@/views/CreateResourceView.vue'),

      meta: { requiresAuth: true }
    },
    {
      path: '/create-resource/audio',
      name: 'createResourceAudio',
      component: () => import('@/views/AudioView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/spip-conversion',
      name: 'spipConversion',
      component: () => import('@/views/SpipConversionView.vue')
    },
    {
      path: '/platform-presentation',
      name: 'platformPresentation',
      component: () => import('@/views/PlatformPresentationView.vue')
    },
    {
      path: '/resources/:id/feed',
      name: 'resourceFeed',
      props: true,
      component: () => import('@/views/ResourceFeedView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/resources',
      name: 'resourcesList',
      component: () => import('@/views/ResourcesListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/resources/:id',
      name: 'seeResource',
      props: true,
      component: () => import('@/views/SeeResourceView.vue')
    },
    {
      path: '/users',
      name: 'usersList',
      component: () => import('@/views/UsersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/:pageUserId',
      name: 'userFeed',
      meta: { requiresRender: true, requiresAuth: true },
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

router.beforeEach((to, from, next) => {
  const { isUserLoaded, user } = useUser() // Assuming you are using Pinia for state management

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // If the route requires authentication and the user is not logged in, redirect to the login page
    if (isUserLoaded.value && !user.value) {
      next({ name: 'login' })
    } else {
      next() // Proceed to the route
    }
  } else {
    next() // Proceed to the route
  }
})

export default router
