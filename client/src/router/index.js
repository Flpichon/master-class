import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import EditConference from '../views/EditConference'
import Conference from '../views/Conference'
import ArticleDisplay from '../views/ArticleDisplay'
import Information from '../views/Information'
import store from './../store'
import axios from "axios"

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Conference,
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
    },
    {
        path: '/conference/:conferenceId',
        name: 'conférence',
        component: Conference,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/conference/:conferenceId/article/:articleId/edit',
        name: 'article',
        component: EditConference,
        meta: {
            requiresAuth: true,
            requiresOwner: true
        }
    },

    {
        path: '/conference/:conferenceId/article/:articleId/view',
        name: 'article-view',
        component: ArticleDisplay,
        meta: {
            requiresAuth: false,
            requiresOwner: false
        }
    },

    {
        path: '/informations',
        name: 'infos',
        component: Information,
        meta: {
            requiresAuth: true
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
            if (to.matched.some(record => record.meta.requiresOwner)) {
                let conference;
                try {
                    conference = await axios({ url: `/api/conferences/${to.params.conferenceId}`, method: 'GET' });
                    conference = conference.data;
                } catch(e) {
                    conference = false;
                }
                if (!conference) {
                    next('/');
                    return;
                }
                if (conference) {
                    const isOwner = `${conference.userId}` === `${localStorage.getItem('userId')}`;
                    if (!isOwner) {
                        next('/');
                        return;
                    }
                }
                next();
            }
            next();
            return;
        }
        next('/login');
    } else {
        next();
    }
});

export default router