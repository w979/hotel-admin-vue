import Layout from '@/layouts';
import ListIcon from '@/assets/assets-slide-list.svg';
import FormIcon from '@/assets/assets-slide-form.svg';
import DetailIcon from '@/assets/assets-slide-detail.svg';

export default [
  {
    path: '/frontdesk',
    name: 'card',
    component: Layout,
    redirect: '/frontdesk/card',
    meta: { title: '前台接待', icon: ListIcon },
    children: [
      {
        path: 'card',
        name: 'listCard',
        component: () => import('@/pages/list/card/index.vue'),
        meta: { title: '房态信息' },
      },
      {
        path: 'checkin',
        name: 'checkin',
        component: () => import('@/pages/form/checkinForm/CheckinForm.vue'),
        meta: { title: '旅客登记' },
      },
      {
        path: 'subscribes',
        name: 'listSubscribes',
        component: () => import('@/pages/list/subscribes/Subscribes.vue'),
        meta: { title: '预订信息' },
      },
      {
        path: 'orders',
        name: 'listOrders',
        component: () => import('@/pages/list/orders/Orders.vue'),
        meta: { title: '订单信息' },
      },
      {
        path: 'deposit',
        name: 'listDeposit',
        component: () => import('@/pages/list/deposit/Deposit.vue'),
        meta: { title: '押金信息' },
      },
      {
        path: 'checkdeposit',
        name: 'formCheck',
        component: () => import('@/pages/form/checkdeposit/CheckDeposit.vue'),
        meta: { title: '押金清退' },
      },
    ],
  },
  {
    path: '/guest',
    name: 'clean',
    component: Layout,
    redirect: '/guest/clean',
    meta: { title: '客房管理', icon: ListIcon },
    children: [
      {
        path: 'clean',
        name: 'listBase',
        component: () => import('@/pages/list/base/index.vue'),
        meta: { title: '客房清除' },
      },
    ]
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Layout,
    redirect: '/checkout/checkout',
    meta: { title: '退房管理', icon: ListIcon },
    children: [
      {
        path: 'checkout',
        name: 'co',
        component: () => import('@/pages/checkout/checkout.vue'),
        meta: { title: '退房处理' },
      },
    ]
  },
  {
    path: '/vip',
    name: 'vip',
    component: Layout,
    redirect: '/vip/level',
    meta: { title: '会员管理', icon: ListIcon },
    children: [
      {
        path: 'level',
        name: 'listLevel',
        component: () => import('@/pages/vip/level/Level.vue'),
        meta: { title: '会员类型' },
      },
      {
        path: 'members',
        name: 'listMembers',
        component: () => import('@/pages/vip/members/Members.vue'),
        meta: { title: '会员列表' },
      },
      {
        path: 'transact',
        name: 'transactDo',
        component: () => import('@/pages/vip/transact/Transact.vue'),
        meta: { title: '会员办理' },
      },
    ],
  },
  {
    path: '/result',
    name: 'result',
    component: Layout,
    redirect: '/result/success',
    meta: { title: '结果页面', icon: 'check-circle' },
    children: [
      {
        path: 'success',
        name: 'resultSuccess',
        component: () => import('@/pages/result/success/index.vue'),
        meta: { title: '成功页' },
      },
      {
        path: 'fail',
        name: 'resultFail',
        component: () => import('@/pages/result/fail/index.vue'),
        meta: { title: '失败页' },
      },
      {
        path: 'network-error',
        name: 'warningNetworkError',
        component: () => import('@/pages/result/network-error/index.vue'),
        meta: { title: '网络异常' },
      },
      {
        path: '403',
        name: 'warning403',
        component: () => import('@/pages/result/403/index.vue'),
        meta: { title: '无权限' },
      },
      {
        path: '404',
        name: 'warning404',
        component: () => import('@/pages/result/404/index.vue'),
        meta: { title: '访问页面不存在页' },
      },
      {
        path: '500',
        name: 'warning500',
        component: () => import('@/pages/result/500/index.vue'),
        meta: { title: '服务器出错页' },
      },
      {
        path: 'browser-incompatible',
        name: 'warningBrowserIncompatible',
        component: () => import('@/pages/result/browser-incompatible/index.vue'),
        meta: { title: '浏览器不兼容页' },
      },
    ],
  },
];
