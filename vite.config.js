import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: 'cloud-vue-pc', // 将这里的 'your-desired-directory-name' 替换为你想要的目录名
    },
    plugins: [vue(), vueJsx(), VueDevTools()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },

    server: {
        port: 8080,
        // host: '0.0.0.0', // 允许外部访问，如果你需要在同一局域网下的其他设备访问此开发服务器，可以设置此选项
        open: true,
        proxy: {
            '/proxy': {
                target: 'https://cloud.189.cn',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy/, ''),
            },
            '/locality': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/locality/, ''),
            },
            '/cloudApi': {
                target: 'https://api.cloud.189.cn',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/cloudApi/, ''),
            },
        },
    },
})
