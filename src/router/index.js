import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import {
  ClockCircleOutlined,
  AntCloudOutlined,
  BarsOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  CopyOutlined,
} from '@ant-design/icons-vue'

const menuRoutes = [
  //   {
  //     path: '/vueuse',
  //     name: 'VueUse',
  //     redirect: '/vueuse/use-clipboard',
  //     component: () => import('../views/RouteViewTemplate.vue'),
  //     meta: {
  //       icon: UserOutlined,
  //     },
  //     children: [
  //       {
  //         path: '/vueuse/use-clipboard',
  //         name: 'VueUseClipboard',
  //         component: () => import('../views/VueUse/UseClipboard.vue'),
  //         meta: {
  //           icon: CopyOutlined,
  //         },
  //       },
  //       {
  //         path: '/vueuse/use-route-query',
  //         name: 'VueUseRouteQuery',
  //         component: () => import('../views/VueUse/useRouteQuery.vue'),
  //         meta: {
  //           icon: MenuFoldOutlined,
  //         },
  //       },
  //     ],
  //   },
  {
    path: '/cloud/index',
    name: '天翼云盘',
    component: () => import('../views/CloudDisk/index.vue'),
    meta: {
      icon: AntCloudOutlined,
    },
  },
  {
    path: '/cloud/account',
    name: '云盘账号',
    component: () => import('../views/AccountList/index.vue'),
    meta: {
      icon: AntCloudOutlined,
    },
  },
  {
    path: '/cloud/subscribe',
    name: '天翼云盘订阅',
    component: () => import('../views/CloudDiskSubscribe/index.vue'),
    meta: {
      icon: BarsOutlined,
    },
  },
  {
    path: '/cloud/scheduled',
    name: '定时任务',
    component: () => import('../views/ScheduledTasks/index.vue'),
    meta: {
      icon: ClockCircleOutlined,
    },
  },
  {
    path: '/cloud/recycle',
    name: '回收站',
    component: () => import('../views/CloudRecycle/index.vue'),
    meta: {
      icon: DeleteOutlined,
    },
  },
  //   {
  //     path: '/test',
  //     name: 'Test',
  //     component: () => import('@/views/Test/index.vue'),
  //     meta: {
  //       icon: AntCloudOutlined,
  //     },
  //   },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },

    {
      path: '/home',
      name: 'home',
      redirect: '/cloud/index',
      component: () => import('../views/Layout/index.vue'),
      children: menuRoutes,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login/RebuildLogin.vue'),
    },
  ],
})

export default router
export { menuRoutes }
