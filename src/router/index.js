import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import {
    ClockCircleOutlined,
    AntCloudOutlined,
    BarsOutlined,
    DeleteOutlined,
    CommentOutlined,
    CopyOutlined,
} from '@ant-design/icons-vue'

const menuRoutes = [
    {
        path: '/cloud/index',
        name: '云盘文件',
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
        name: '订阅任务',
        component: () => import('../views/CloudDiskSubscribe/index.vue'),
        meta: {
            icon: BarsOutlined,
        },
    },
    {
        path: '/cloud/scheduled',
        name: '定时配置',
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
    {
        path: '/cloud/channel',
        name: '频道消息',
        component: () => import('../views/ChanelViews/index.vue'),
        meta: {
            icon: CommentOutlined,
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
    history: createWebHistory(import.meta.env.BASE_URL),
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
