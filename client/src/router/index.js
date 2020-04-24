import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import store from './../store'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/about',
        name: 'about',
        meta: {
            requiresAuth: false
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: false
        }
    }
]

const router = new VueRouter({
    routes
})
router.beforeEach(async (to, from, next) => {
    if (to.fullPath === '/login' && store.getters.isLoggedIn) {
        next('/');
        return;
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            const isTokenValid = await store.dispatch('isTokenValid');
            if (!isTokenValid) {
                await store.dispatch('logout')
                    .then(() => {
                        next('/login');
                    });
                return;
            }
            await store.dispatch('refreshToken');
            next();
            return;
        }
        next('/login');
    } else {
        next();
    }
});

export default router