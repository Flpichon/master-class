<template>
  <div id="app">
    <v-app  id="inspire">
      <notifications group="foo" />
        <body class="bg-light">
          <div id="nav">
            <div class="row">
                <div class="col">
                    <nav class="navbar bg-light fixed-top shadow">
                    <router-link to="/"><h1 class="navbar-brand" >MasterClass 2020</h1></router-link>
                        <ul class="nav nav-pills">
                            <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle colordarkblue" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Conférences</a>
                            <div class="dropdown-menu">
                                <a v-for="conference in conferences" :key="conference.id"  class="dropdown-item" @click="goToConference(conference.id)">{{conference.titre}}</a>
                            </div>
                            </li>
                            <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle colordarkblue" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Mon compte</a>
                            <div class="dropdown-menu">
                                <a v-if="isLoggedIn" class="dropdown-item" @click="goToInformations">Informations</a>
                                <a v-if="isLoggedIn" class="dropdown-item" @click="redirectToOwnerConference">Ma conférence</a>
                                <a v-if="isLoggedIn" class="dropdown-item" @click="logout">Déconnexion</a>
                                <router-link v-else to="/login"><a class="dropdown-item">Connexion</a></router-link>
                            </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
          <router-view/>
        </body>
    </v-app>
  </div>
</template>
<script>
import Axios from 'axios';
export default {
    data() {
      return {
        isLoggedIn: false,
        conferences: []
      };
    },
    computed : {
    },
    watch: {
        async $route(to, from) {
          this.isLoggedIn = await this.isLogged();
          if (!this.isLoggedIn) {
            await this.$store.dispatch('logout');
          }
          await this.getConferences();
        }
    },
    async mounted() {
      this.isLoggedIn = await this.isLogged();
      if (!this.isLoggedIn) {
          await this.$store.dispatch('logout');
      }
      await this.getConferences();
    },
    methods: {
      goToInformations() {
        this.$router.push('/informations');
      },
      goToConference(conferenceId) {
        this.$router.push(`/conference/${conferenceId}`)
      },
      async redirectToOwnerConference() {
        let conference = await Axios.get(`/api/users/${localStorage.getItem('userId')}/conference`);
        conference = conference.data;
        this.$router.push(`/conference/${conference.id}`);
      },
      async getConferences() {
        let conferences = await Axios.get(`/api/projects/1/allConferences`);
        conferences = conferences.data;
        this.conferences = conferences;
      },
      isLogged: async function() {
        return await this.$store.dispatch('isTokenValid');
      },
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      },
      created: function () {
        this.$http.interceptors.response.use(undefined, function (err) {
          return new Promise(function (resolve, reject) {
            if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
              this.$store.dispatch('logout')
            }
            throw err;
          });
        });
      }
    },
  }
</script>
<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
body {
  height: 100%;
}
</style>
