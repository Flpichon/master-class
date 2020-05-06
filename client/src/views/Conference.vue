<template>
    <div class="container-fluid">
        <div class="row justify-content-around">
            <div class="col m-3 colfix">
                <h2 id="autotext" class="text-center m-5 animed">MasterClass 2020 : {{conference.titre}}</h2>
                <h3 class="text-center m-4 date">Le {{conference.formatedDate}}</h3>
            </div>
        </div>
        <div v-if="isUserOwner" class="row">
          <div class="col-md-12">
            <button type="button" class="btn btn-outline-light">Ajouter un article</button>
          </div>
        </div>
        <div class="row">
            <div class="col-lg-8 col-md-12">
                <div class="card m-3 shadow rounded bluecolor">
                    <div class="card-body">
                        <h5 class="card-title size25 colordarkblue">Exemple news</h5>
                        <h6 class="card-subtitle mb-2 text-muted">sous titre news</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="card-link">liens</a>
                    </div>
                </div>
                <div class="card m-3 shadow rounded bluecolor">
                    <div class="card-body">
                        <h5 class="card-title size25 colordarkblue">Exemple news 2</h5>
                        <h6 class="card-subtitle mb-2 text-muted">sous titre news 2</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="card-link">liens</a>
                    </div>
                </div>
                <div class="card m-3 shadow rounded bluecolor">
                    <div class="card-body">
                        <h5 class="card-title size25 colordarkblue">Exemple news 3</h5>
                        <h6 class="card-subtitle mb-2 text-muted">sous titre news 3</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="card-link">liens</a>
                    </div>
                </div>
                <div class="card m-3 shadow rounded bluecolor">
                    <div class="card-body">
                        <h5 class="card-title size25 colordarkblue">Exemple news 3</h5>
                        <h6 class="card-subtitle mb-2 text-muted">sous titre news 3</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="card-link">liens</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-12">
                <div class="card m-3 shadow sticky-top">
                    <div class="card-body">
                        <h5 class="card-title text-center colordarkblue">Informations :</h5>
                        <div class="row" role="group">
                            <a href="#" class="btn text-white m-1 col colorfacebook"><i class="fab fa-facebook-f fa-2x"></i> Facebook</a>
                            <a href="#" class="btn text-white m-1 col colortwitter"><i class="fab fa-twitter fa-2x"></i> Twitter</a>
                            <a href="#" class="btn text-white m-1 col colorlinkedin"><i class="fab fa-linkedin-in fa-2x"></i> Linkedin</a>
                            <a href="#" class="btn text-white m-1 col colorinstagram"><i class="fab fa-instagram fa-2x"></i> Instagram</a>
                        </div>
                        <GoogleMap/>
                        <p class="card-text">Les 19 et 20 mai a efficom comedy club</p>
                        <a href="#" class="card-link">liens</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import GoogleMap from '../components/GoogleMap'
import axios from 'axios'
export default {
  name: 'Conference',
  components: {
    GoogleMap
  },
  data:() => ({
      conferenceId: '',
      conference: {},
      isUserOwner: false
  }),

  computed: {
  },

  methods: {
    async getConferenceById(conferenceId) {
      let conferences = await axios({ url: '/api/conferences', method: 'GET' })
      conferences = conferences.data;
      conferences.forEach(conference => console.log(conference.id + conferenceId));
      let conference = conferences.find(conference => `${conference.id}` === conferenceId, '');
      if (!conference) {
        conference = conferences[0];
      }
      let data = new Date(conference.date);
      conference.formatedDate = `${data.getDate()}-${data.getMonth() + 1}-${data.getUTCFullYear()}`
      return conference;
    },
    async getUserConnected() {
      const isTokenValid = await this.$store.dispatch('isTokenValid');
      if (isTokenValid) {
        let user = await axios({ url: `/api/projects/1/users/${localStorage.getItem('userId')}`, method: 'GET' });
        return user.data;
      } else {
        return false;
      }
    },
    async isOwnerOfConference() {
      const user = await this.getUserConnected();
      return this.conference.userId === user.id;
    }
  },

  watch: {
    async $route(to, from) {
      this.conferenceId = this.$route.params.conferenceId;
      this.conference = await this.getConferenceById(this.conferenceId);
      this.isUserOwner = await this.isOwnerOfConference();
    },
  },

  async mounted() {
    this.conferenceId = this.$route.params.conferenceId;
    this.conference = await this.getConferenceById(this.conferenceId);
    this.isUserOwner = await this.isOwnerOfConference();
  }
}
</script>
<style scoped>
       /* Set the size of the div element that contains the map */
       #map {
        height: 200px;  /* The height is 400 pixels */
        width: 100%;  /* The width is the width of the web page */
       }
        .backcolor {
        background-color : #222222;    
        }
        .bluecolor {
        background-color : #b7d0e8;
        }
        .animed{
            color : white;
            font-size: 60px !important;
        }
        .date{
          color: white;
          font-size: 50px !important;
        }
        .colfix{
            min-height: 170px !important;
        }
        .colordarkblue{
            color : rgb(55, 55, 145);
        }
        .noborder{
            border: 0px !important;
        }
        #autotext {
            letter-spacing: 0.05em;
        }
        .colorfacebook {
            background-color: #3b5998;
        }
        .colortwitter {
            background-color: #00acee;
        }
        .colorlinkedin {
            background-color: #0e76a8;
        }
        .colorinstagram {
            background: rgb(92,83,166);
            background: linear-gradient(90deg, rgba(92,83,166,1) 0%, rgba(187,48,147,1) 35%, rgba(241,90,45,1) 100%);
        }
        .size25 {
            font-size: 25px;
        }
        .logoM {
            font-size: 35px;
            background: -webkit-linear-gradient(#f8f9fa, #373791);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
</style>
