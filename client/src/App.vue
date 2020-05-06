<template>
  <div id="app">
    <v-app  id="inspire">
      <notifications group="foo" />
        <body class="parallax">
          <div id="nav">
            <div class="row">
                <div class="col">
                    <nav class="navbar bg-light fixed-top shadow">
                    <router-link to="/"><h1 class="navbar-brand" >MasterClass 2020</h1></router-link>
                        <ul class="nav nav-pills">
                            <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle colordarkblue" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Conférences</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#one">one</a>
                                <a class="dropdown-item" href="#two">two</a>
                                <div role="separator" class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#three">three</a>
                            </div>
                            </li>
                            <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle colordarkblue" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Mon compte</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#one">Informations</a>
                                <a class="dropdown-item" to="/about" href="#two">Ma conférence</a>
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
export default {
    computed : {
      isLoggedIn: function(){ return this.$store.getters.isLoggedIn}
    },
    methods: {
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
.parallax {
/* The image used */
background-image: url("./assets/voiture.jpg");

/* Set a specific height */
/* height: 500px; */

/* Create the parallax scrolling effect */
background-attachment: fixed;
background-position: center;
background-repeat: no-repeat;
background-size: cover;
height: 100%;
}
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
</style>
