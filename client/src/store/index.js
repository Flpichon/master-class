import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        userId: localStorage.getItem('userId') || ''
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, { token, userId }) {
            state.status = 'success';
            state.token = token;
            state.userId = userId;
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = '';
            state.token = '';
            state.userId = '';
        },
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                axios({ url: '/api/users/login', data: user, method: 'POST' })
                    .then(resp => {
                        const token = resp.data.id;
                        const userId = resp.data.userId;
                        localStorage.setItem('token', token);
                        localStorage.setItem('userId', userId);
                        axios.defaults.headers.common['Authorization'] = token;
                        commit('auth_success', { token, userId });
                        resolve(resp);
                    })
                    .catch(err => {         
                        commit('auth_error');
                        localStorage.removeItem('token');
                        reject(err);
                    })
            })
        },
        async logout({ commit }) {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            delete axios.defaults.headers.common['Authorization'];
            let isTokenValid;
            if (userId && token) {
                try {
                    isTokenValid = await axios({ url: `/api/users/${userId}/isValidToken/${token}`, method: 'GET' });
                } catch(e) {
                    isTokenValid = false;
                }
            } else {
                isTokenValid = false;
            }
            axios.defaults.headers.common['Authorization'] = token;
            return await new Promise((resolve, reject) => {
                commit('logout');
                if (isTokenValid && isTokenValid.data.token) {
                    axios({ url: '/api/users/logout', method: 'POST' })
                        .then(() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userId');
                            delete axios.defaults.headers.common['Authorization'];
                            resolve();
                    });
                } else {
                    delete axios.defaults.headers.common['Authorization'];
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    resolve();
                }
            });
        },
        async isTokenValid({ commit }) {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            let isTokenValid;
            if (userId && token) {
                try {
                    delete axios.defaults.headers.common['Authorization'];
                    isTokenValid = await axios({ url: `/api/users/${userId}/isValidToken/${token}`, method: 'GET' });
                    isTokenValid = isTokenValid.data.token;
                } catch(e) {
                    isTokenValid = false;
                }
            } else {
                isTokenValid = false;
            }
            axios.defaults.headers.common['Authorization'] = token;
            return isTokenValid;
        },
        async refreshToken({ commit }) {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            return await axios({ url: `/api/users/${userId}/accessTokens/${token}`, method: 'GET' });
        }
    },
    modules: {},
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
    }
})