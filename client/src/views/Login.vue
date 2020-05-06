<template>
  <div class="container">
    <h1 class="form-heading"></h1>
    <div class="login-form">
      <div class="main-div">
        <div class="panel">
        <h2>Connexion</h2>
        <p>Entrez votre pseudonyme et votre mot de passe</p>
        </div>
        <form id="Login"
        @submit="login"
        >
        <div class="form-group">
        <input type="text" class="form-control" v-model="username" placeholder="Pseudo">
        </div>
        <div class="form-group">
        <input type="password" v-model="password" class="form-control" placeholder="Mot de passe">
        </div>
        <div class="forgot">
        </div>
        <button type="submit" class="btn btn-primary">Connexion</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    select: null,
  }),

  computed: {
  },

  methods: {
    submit () {
    },
    clear () {

    },
    login () {
      const username = this.username;
      const password = this.password;
      this.$store.dispatch('login', { username, password })
        .then(() => this.$router.push('/'))
        .catch(err => {
          this.$notify({
            type: 'error',
            group: 'foo',
            title: 'Echec de la connexion',
            text: 'Votre identifiant et/ou votre mot de passe sont incorrects.'
          });
        });
    }
  },
}
</script>
<style scoped>
body#LoginForm{ background-image:url("https://hdwallsource.com/img/2014/9/blur-26347-27038-hd-wallpapers.jpg"); background-repeat:no-repeat; background-position:center; background-size:cover; padding:10px;}

.form-heading { color:#fff; font-size:23px;}
.panel h2{ color:#444444; font-size:18px; margin:0 0 8px 0;}
.panel p { color:#777777; font-size:14px; margin-bottom:30px; line-height:24px;}
.login-form .form-control {
  background: #f7f7f7 none repeat scroll 0 0;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
}
.main-div {
  background: #ffffff none repeat scroll 0 0;
  border-radius: 2px;
  margin: 10px auto 30px;
  max-width: 38%;
  padding: 50px 70px 70px 71px;
}

.login-form .form-group {
  margin-bottom:10px;
}
.login-form{ text-align:center;}
.forgot a {
  color: #777777;
  font-size: 14px;
  text-decoration: underline;
}
.login-form  .btn.btn-primary {
  background: #f0ad4e none repeat scroll 0 0;
  border-color: #f0ad4e;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0;
}
.forgot {
  text-align: left; margin-bottom:30px;
}
.botto-text {
  color: #ffffff;
  font-size: 14px;
  margin: auto;
}
.login-form .btn.btn-primary.reset {
  background: #ff9900 none repeat scroll 0 0;
}
.back { text-align: left; margin-top:10px;}
.back a {color: #444444; font-size: 13px;text-decoration: none;}

.container-fluid {
  height: 100%;
}

</style>