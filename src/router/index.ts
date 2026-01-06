import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/composables/useUser'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/me/home' },
    {
      path: '/social',
      name: 'social',
      component: () => import('@/layouts/SocialLayout.vue'),
      children: [
        {
          path: 'feed',
          name: 'feed',
          component: () => import('@/pages/social/FeedPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'users',
          name: 'usersList',
          component: () => import('@/pages/social/UsersPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'users/:pageUserId',
          name: 'userFeed',
          meta: { requiresRender: true, requiresAuth: true },
          props: true,
          component: () => import('@/pages/social/UserFeedPage.vue')
        },
        {
          path: 'resources/:id/feed',
          name: 'socialResourceFeed',
          props: true,
          component: () => import('@/pages/social/SocialResourceFeedPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'resources',
          name: 'resourcesList',
          component: () => import('@/pages/social/ResourcesListPage.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/me',
      name: 'me',
      component: () => import('@/layouts/MeLayout.vue'),
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/pages/me/HomePage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'create-resource',
          name: 'createResource',
          component: () => import('@/pages/me/CreateResourcePage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'platform-presentation',
          name: 'platformPresentation',
          component: () => import('@/pages/me/PlatformPresentationPage.vue')
        },
        {
          path: 'mission-choice',
          name: 'missionChoice',
          component: () => import('@/pages/me/MissionChoicePage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'mentor-choice',
          name: 'mentorChoice',
          component: () => import('@/pages/me/MentorChoicePage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'resources/:id/feed',
          name: 'meResourceFeed',
          props: true,
          component: () => import('@/pages/me/ResourceFeedPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'user',
          name: 'userProfile',
          component: () => import('@/pages/me/UserPage.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/app/LoginPage.vue')
        },
        {
          path: 'writer',
          name: 'writer',
          component: () => import('@/pages/app/WriterPage.vue')
        },
        {
          path: 'trace',
          name: 'trace',
          component: () => import('@/pages/app/TracePage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'resources/:id',
          name: 'seeResource',
          props: true,
          component: () => import('@/pages/app/SeeResourcePage.vue')
        }
      ]
    },
    {
      path: '/legacy',
      name: 'legacy',
      children: [
        {
          path: 'spip-conversion',
          name: 'spipConversion',
          component: () => import('@/pages/legacy/SpipConversionPage.vue')
        }
      ]
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
