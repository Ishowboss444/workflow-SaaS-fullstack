import { createRouter, createWebHistory } from 'vue-router';

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/login.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/signup.vue'),
    },

    {
      path: '/preview',
      name: 'preview',
      component: () =>
        import('../views/managerDashboard/OrderDetailsColorsTab.vue'),
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/jobs',
      name: 'job-list',
      component: () => import('../views/JobListView.vue'),
      meta: {
        requiresAuth: true,
      },
    },

    // 4-step "add new job" wizard
    {
      path: '/jobs/add/1',
      name: 'add-job-1',
      component: () => import('../views/AddJobStep1View.vue'),
    },
    {
      path: '/jobs/add/2',
      name: 'add-job-2',
      component: () => import('../views/AddJobStep2View.vue'),
    },
    {
      path: '/jobs/add/3',
      name: 'add-job-3',
      component: () => import('../views/AddJobStep3View.vue'),
    },
    {
      path: '/jobs/add/4',
      name: 'add-job-4',
      component: () => import('../views/AddJobStep4View.vue'),
    },

    // job detail, tabbed
    {
      path: '/jobs/:id/colors',
      name: 'job-detail-colors',
      component: () => import('../views/JobDetailColorsView.vue'),
    },
    {
      path: '/jobs/:id/workers',
      name: 'job-detail-workers',
      component: () => import('../views/JobDetailWorkersView.vue'),
    },
    {
      path: '/jobs/:id/finance',
      name: 'job-detail-finance',
      component: () => import('../views/JobDetailFinanceView.vue'),
    },

    {
      path: '/distribute',
      name: 'work-distribution',
      component: () => import('../views/WorkDistributionView.vue'),
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('../views/SuccessView.vue'),
    },
  ],
});

routes.beforeEach((to) => {
  const token = localStorage.getItem('accessToken');

  if (to.meta.requiresAuth && !token) {
    return '/login';
  }
});

export default routes;
