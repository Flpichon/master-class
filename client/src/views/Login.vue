<template>
  <div class="container login-container">
    <div class="row">
        <div class="col-md-6 login-form-1">
            <h3>Se connecter</h3>
            <form         @submit="login">
                <div class="form-group">
                    <input type="text" class="form-control"  v-model="username" placeholder="Pseudo">
                </div>
                <div class="form-group">
                    <input type="password" v-model="password" class="form-control" placeholder="Mot de passe">
                </div>
                <div class="form-group">
                    <input type="submit" class="btnSubmit" value="Connexion" />
                </div>
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
    validateEmail(email) {
    let re =  /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return re.test(String(email).toLowerCase());
    },
    submit () {
    },
    clear () {

    },
    login () {
      
      let user = {};
      let email = this.validateEmail(this.username) ? this.username : false;
      if (email) {
        user.email = this.username;
        user.password = this.password
      } else {
        user.username = this.username;
        user.password = this.password
      }
      this.$store.dispatch('login', user)
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
.login-container{
    margin-top: 5%;
    margin-bottom: 5%;
}
.login-form-1{
    padding: 5%;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
}
.login-form-1 h3{
    text-align: center;
    color: #333;
}
.login-form-2{
    padding: 5%;
    background: #0062cc;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
}
.login-form-2 h3{
    text-align: center;
    color: #fff;
}
.login-container form{
    padding: 10%;
}
.btnSubmit
{
    width: 50%;
    border-radius: 1rem;
    padding: 1.5%;
    border: none;
    cursor: pointer;
}
.login-form-1 .btnSubmit{
    font-weight: 600;
    color: #fff;
    background-color: #0062cc;
}
.login-form-2 .btnSubmit{
    font-weight: 600;
    color: #0062cc;
    background-color: #fff;
}
.login-form-2 .ForgetPwd{
    color: #fff;
    font-weight: 600;
    text-decoration: none;
}
.login-form-1 .ForgetPwd{
    color: #0062cc;
    font-weight: 600;
    text-decoration: none;
}


</style>