import { createRouter, createWebHistory } from 'vue-router';

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/managerDash/Home.vue'),
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
      path: '/starter',
      name: 'starter',
      component: () => import('../views/workplace-choice.vue'),
      meta: {
        requiresAuth: true,
        requiresProfileEdit : true,
      },
    },
    {
      path: '/managerDashboard',
      name: 'managerDashboard',
      meta: {
        requiresAuth: true,
        requiresManager : true,
      },
      component: () => import('../views/CreateWorkplace.vue'),
      children : [
        {
          path : 'hiration',
          name : 'hiration',
          component : ()=> import('@/views/managerDash/StarterManagerTemplate.vue'),
        },
        {
          path : 'hiration',
          name : 'hiration',
          component : ()=> import('@/views/auth/hiration.vue'),
          meta: {
            requiresAuth: true,
          },
        },

        {
          path: '/jobs',
          name: 'job-list',
          component: () => import('../views/managerDash/JobListView.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/jobs/add/1',
          name: 'add-job-1',
          component: () => import('../views/managerDash/AddJobStep1View.vue'),
        },
        {
          path: '/jobs/add/2',
          name: 'add-job-2',
          component: () => import('../views/managerDash/AddJobStep2View.vue'),
        },
        {
          path: '/jobs/add/3',
          name: 'add-job-3',
          component: () => import('../views/managerDash/AddJobStep3View.vue'),
        },
        {
          path: '/jobs/add/4',
          name: 'add-job-4',
          component: () => import('../views/managerDash/AddJobStep4View.vue'),
        },
      
        // job detail, tabbed
        {
          path: '/jobs/:id/colors',
          name: 'job-detail-colors',
          component: () => import('../views/managerDash/JobDetailColorsView.vue'),
        },
        {
          path: '/jobs/:id/workers',
          name: 'job-detail-workers',
          component: () => import('../views/managerDash/JobDetailWorkersView.vue'),
        },
        {
          path: '/jobs/:id/finance',
          name: 'job-detail-finance',
          component: () => import('../views/managerDash/JobDetailFinanceView.vue'),
        },
      
        {
          path: '/distribute',
          name: 'work-distribution',
          component: () => import('../views/managerDash/WorkDistributionView.vue'),
        },
        {
          path: '/success',
          name: 'success',
          component: () => import('../views/managerDash/SuccessView.vue'),
        },

      ]
    },






    {
      path: '/workerDashboard',
      name: 'workerDashboard',
      component: () => import('../views/WorkerProfile.vue'),
      children : [
        {
          path : 'starterTemplate',
          name : 'starterTemplate',
          component : ()=> import('@/views/workerDash/StaterWorkerTemplate.vue'),
        },
        {
          path : 'myInvitations',
          name : 'myInvitations',
          component : ()=> import('@/views/auth/invitation.vue'),
          meta: {
            requiresAuth: true,
            requiresWorker : true,
          },
        },
        {
          path : 'heroWorker',
          name : 'heroWorker',
          component : ()=> import('@/views/workerDash/workerHero.vue'),
          meta: {
            requiresAuth: true,
            requiresWorker : true,
          },
        },

      ]
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/auth/hiration.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    

    // 4-step "add new job" wizard
    
  ],
});

routes.beforeEach((to) => {
  const token = localStorage.getItem('accessToken');

  if (to.meta.requiresAuth && !token ) {
    return '/login';
  }
});
routes.beforeEach((to) => {
  const data = localStorage.getItem('role')
  const role = data === 'WORKER'

  if (to.meta.requiresWorker && !role) {
    return '/login';
  }
});
routes.beforeEach((to) => {
  const data = localStorage.getItem('role')
  const workplace = localStorage.getItem('workplace')
  const role = data === 'MANAGER'

  if (to.meta.requiresManager && !role && !workplace) {
    return '/login';
  }
});
routes.beforeEach((to) => {
  const data = localStorage.getItem('role')
  
  if (to.meta.requiresProfileEdit && data === 'MANAGER') {
    return {name : 'managerDashboard'};
  }
  if(to.meta.requiresProfileEdit && data === 'WORKER'){
    return {name : 'workerDashboard'}
  }
});
export default routes;
