import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

/* 常规同步引入 */
import Login from '@/views/Login.vue'
import Layout from '@/views/layout/Index.vue'
import Dashboard from '@/views/Dashboard.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: Login,
        meta: {public: true, title: '登录'}
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        // 默认重定向
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                name: 'home',
                meta: {title: '仪表盘'}
            },
            {
                path: 'setting',
                /* 懒加载写法 ↓↓↓ */
                component: () => import('@/views/Setting.vue'),
                meta: {title: '系统设置'}
            },
            {
                path: 'role',
                /* 懒加载写法 ↓↓↓ */
                component: () => import('@/views/Role.vue'),
                meta: {title: '角色管理'}
            },
            {
                path: 'perm',
                /* 懒加载写法 ↓↓↓ */
                component: () => import('@/views/Permissions.vue'),
                meta: {title: '权限管理'}
            },
            {
                path: 'user',
                /* 懒加载写法 ↓↓↓ */
                component: () => import('@/views/User.vue'),
                meta: {title: '用户管理'}
            },

            {
                path: 'singleChoiceQuestion',
                /* 懒加载写法 ↓↓↓ */
                component: () => import('@/views/subject/singleChoiceQuestion.vue'),
                meta: {title: '单选题管理'}
            },
            {
                path: 'multipleChoiceQuestions',
                /* 懒加载写法 ↓↓↓ */
                component: () => import('@/views/subject/multipleChoiceQuestions.vue'),
                meta: {title: '多选题管理'}
            },
            {
                path: 'judgmentQuestion',
                /* 懒加载写法 ↓↓↓ */
                component: () => import('@/views/subject/judgmentQuestion.vue'),
                meta: {title: '判题题管理'}
            },
            {
                path: 'shortAnswerQuestions',
                /* 懒加载写法 ↓↓↓ */
                component: () => import('@/views/subject/shortAnswerQuestions.vue'),
                meta: {title: '简答题管理'}
            },

        ]
    },
    /* 404 可选 */
    {path: '/:pathMatch(.*)*', redirect: '/dashboard'}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

/* 登陆拦截 */
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('token')
    if (!to.meta.public && !token) return next('/login')
    next()
})

export default router
