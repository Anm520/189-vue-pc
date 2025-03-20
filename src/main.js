import './assets/main.less'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import API from '@/api/cloud'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
router.beforeEach((to, from, next) => {
    console.log('to >>>>>:', to);
    if (to.path === '/login') {
        next()
        return
    }
    const token = localStorage.getItem('token')
    if (!token) {
        next('/login')
        return
    }
    // if (to.path === '/home/account' || to.path === '/home/addacc') {
    //     next()
    //     return
    // }
    const account = localStorage.getItem('account')
    if (!account) {
        next('/cloud/account')
        return
    }
    const cloud = sessionStorage.getItem('cloud')
    if (account && !cloud) {
        API.getCookies({ account }).then(res => {
            console.log('getCookies >>>>>:', res);
            window.sessionStorage.setItem('cloud', res.cookies)
            next()

        }).catch(() => {
            next()

        })
    } else {
        next()
    }
})

app.mount('#app')
