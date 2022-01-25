import Layout from '@/layouts';
import DashboardIcon from '@/assets/assets-slide-dashboard.svg';

export default [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/base',
    name: 'dashboard',
    meta: { title: '数据分析', icon: DashboardIcon },
    children: [
      {
        path: 'base',
        name: 'dashboardBase',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: { title: '酒店概况分析' },
      },
      {
        path: 'detail',
        name: 'dashboardDetail',
        component: () => import('@/pages/dashboard/detail/index.vue'),
        meta: { title: '酒店统计报表' },
      },
    ],
  },
];
