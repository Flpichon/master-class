<template>
<div class="container-fluid">
  <div class="row justify-content-center">
    <div class="col-sm-4">
      <label>Pseudonyme</label>
      <div class="form-group pass_show"> 
          <input type="text" v-model="user.username" class="form-control" disabled> 
      </div> 
      <label>Email</label>
      <div class="form-group pass_show"> 
          <input type="text" v-model="user.email" class="form-control" disabled> 
      </div> 
      <form id="Login"
        @submit="change"
      >
      <label>Mot de passe actuel</label>
      <div class="form-group pass_show"> 
          <input type="password" v-model="currentPassword" class="form-control" placeholder="Mot de passe..."> 
      </div> 
      <label>Nouveau mot de passe</label>
      <div class="form-group pass_show"> 
          <input type="password"  v-model="newPassword" class="form-control" placeholder="Mot de passe..."> 
      </div> 
      <label>Confirmation du mot de passe</label>
      <div class="form-group pass_show"> 
          <input type="password" v-model="newPassword2" class="form-control" placeholder="Mot de passe..."> 
      </div> 
        <button type="submit" class="btn btn-primary">Modifier le mot de passe</button>
      </form>
		</div>  
	</div>
</div>
</template>

<script>
import Axios from 'axios';
export default {
    data() {
    return {
      user: {},
      currentPassword: '',
      newPassword: '',
      newPassword2: ''
    };
  },
    methods: {
      async change() {
        const oldPassword = this.currentPassword;
        const newPassword = this.newPassword;
        const newPassword2 = this.newPassword2;
        if (newPassword && newPassword2 && newPassword === newPassword2) {
          Axios({url: `/api/users/change-password`, data: {oldPassword, newPassword}, method: 'POST' })
            .then(() => {
              this.$notify({
                type: 'success',
                group: 'foo',
                title: 'Modification effectuée',
                text: 'Votre mot de passe a bien été modifié.'
              });
            })
            .catch(error => {
              this.$notify({
                type: 'error',
                group: 'foo',
                title: 'Mot de passe actuel invalide',
                text: 'Votre mot de passe actuel est invalide, réessayez.'
              });
            });
          this.currentPassword = '';
          this.newPassword = '';
          this.newPassword2 = '';
        } else {
            this.$notify({
              type: 'error',
              group: 'foo',
              title: 'Mots de passes différents',
              text: 'Votre nouveau mot de passe et sa confirmation sont différents.'
            });
        }
      },
      async getUser() {
        const userId = localStorage.getItem('userId');
        let user = await Axios({url: `/api/projects/1/users/${userId}`, method: 'GET'});
        return user.data;
      },
      async setUser() {
        const user = await this.getUser();
        this.user = user;
      }
    },
    async mounted() {
      this.setUser();
    }
}
</script>