<template>
    <div class="container-fluid">
        <div class="row justify-content-around">
            <div class="parallax col m-3 colfix">
                <h3 id="autotext" class="text-center animed">MasterClass 2020</h3>
                <h2 class="text-center m-5 animed">{{conference.titre}}</h2>
                <h3 class="text-center m-4 date">Le {{conference.formatedDate}}</h3>
            </div>
        </div>
        <div v-if="isUserOwner" class="row">
          <div class="col-md-12">
            <button type="button" @click="newArticle" class="shadow btn btn-primary">Ajouter un article</button>
          </div>
        </div>
        <div class="row">
            <div class="col-lg-8 col-md-12">
                <div  v-for="article in articles" :key="article.id" class="card m-3 shadow-lg rounded white">
                    <div class="card-header bgcolor">
                      <div class="row">
                        <div class="col-md-10">
                          <h5 class="card-title size25">{{article.title}}</h5>  
                        </div>
                        <div class="col-md-2 text-right">
                          <a class="edit" @click="editArticle(article.id)">
                            <span v-if="isUserOwner"><i class="fas fa-edit"></i></span>
                          </a>
                          <a class="delete" @click="deleteArticle(article.id)">
                            <span v-if="isUserOwner"><i class="fas fa-trash-alt"></i></span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">
                          Création :
                          <span class="badge badge-pill badge-primary">
                            {{article.formatedDateCreation}}
                          </span>
                          Modification :
                          <span class="badge badge-pill badge-secondary">
                            {{article.formatedDateModification}}
                          </span>
                        </h6>
                        <p class="card-text" v-html="article.content">{{article.content}}</p>
                    </div>
                    <div class="card-footer text-muted bgcolor">
                      <a @click="viewArticle(article.id, article.conferenceId)" class="card-link">Voir l'article</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-12">
                <div class="card m-3 shadow-lg sticky-top">
                    <div class="card-body">
                        <h5 class="card-title text-center colordarkblue">Informations :</h5>
                        <div class="row" role="group">
                            <a :href="facebook" class="btn text-white m-1 col colorfacebook"><i class="fab fa-facebook-f fa-2x"></i> Facebook</a>
                            <a :href="twitter" class="btn text-white m-1 col colortwitter"><i class="fab fa-twitter fa-2x"></i> Twitter</a>
                            <a :href="linkedin" class="btn text-white m-1 col colorlinkedin"><i class="fab fa-linkedin-in fa-2x"></i> Linkedin</a>
                            <a :href="instagram" class="btn text-white m-1 col colorinstagram"><i class="fab fa-instagram fa-2x"></i> Instagram</a>
                        </div>
                        <GoogleMap/>
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
import moment from 'moment'
export default {
  name: 'Conference',
  components: {
    GoogleMap
  },
  data:() => ({
      conferenceId: '',
      conference: {},
      isUserOwner: false,
      articles: [],
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: ""
  }),

  computed: {
  },

  methods: {
    viewArticle(id, conferenceId) {
      this.$router.push(`/conference/${conferenceId}/article/${id}/view`);
    },

    async getConferenceById(conferenceId) {
      let conferences = await axios({ url: '/api/conferences', method: 'GET' })
      conferences = conferences.data;
      let conference = conferences.find(conference => `${conference.id}` === conferenceId, '');
      if (!conference) {
        conference = conferences[0];
      }
      let data = new Date(conference.date);
      conference.formatedDate = `${data.getDate()}-${data.getMonth() + 1}-${data.getUTCFullYear()}`
      if (conference.reseaux) {
        conference.reseaux.forEach(reseau => {
        const key = Object.keys(reseau);
        const value = Object.values(reseau)
        this[key] = value[0];
        });
      }
      this.conferenceId = conference.id;
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
    },

    async getArticles() {
      let articles = await axios({ url: `/api/conferences/${this.conferenceId}/articles`, method: 'GET' });
      articles = articles.data;
      return articles;
    },

    async setArticles() {
      let articles = await this.getArticles();
      articles = articles.map(article => {
        article.formatedDateCreation = moment(String(article.createdAt)).format('MM/DD/YYYY à HH:mm');
        article.formatedDateModification = moment(String(article.modifiedAt)).format('MM/DD/YYYY à HH:mm');
        return article;
      })
      articles = articles.sort((a, b) => b.modifiedAt - a.modifiedAt);
      this.articles = articles;
    },

    newArticle() {
      this.$router.push(`/conference/${this.conferenceId}/article/new/edit`);
    },

    editArticle(articleId) {
      this.$router.push(`/conference/${this.conferenceId}/article/${articleId}/edit`);
    },

    async deleteArticle(articleId) {
      const conf = confirm('Voulez vous vraiment supprimer cet article ?');
      if (confirm) {
        await axios({ url: `/api/conferences/${this.conferenceId}/articles/${articleId}`, method: 'DELETE' });
        await this.setArticles();
          this.$notify({
          type: 'success',
          group: 'foo',
          title: 'Succès',
          text: `L'article a bien été supprimé`
        });
      }
    }
  },

  watch: {
    async $route(to, from) {
      this.conferenceId = this.$route.params.conferenceId;
      this.conference = await this.getConferenceById(this.conferenceId);
      this.isUserOwner = await this.isOwnerOfConference();
      await this.setArticles();
    },
  },

  async mounted() {
    this.conferenceId = this.$route.params.conferenceId;
    this.conference = await this.getConferenceById(this.conferenceId);
    this.isUserOwner = await this.isOwnerOfConference();
    await this.setArticles();
    const date = moment(String("2020-05-07T10:25:55.000Z")).format('MM/DD/YYYY hh:mm')
  }
}
</script>
<style scoped>
       /* Set the size of the div element that contains the map */
       #map {
        height: 200px;  /* The height is 400 pixels */
        width: 100%;  /* The width is the width of the web page */
       }
       .bgcolor {
         background-color: #eaefff;
       }
        .backcolor {
        background-color : #222222;    
        }
        .bluecolor {
        background-color : #b7d0e8;
        }
        .white {
          background-color: white;
        }
        .animed{
            color : white;
            font-size: 55px;
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
        .card-text {
          max-height: 200px;
          text-overflow: ellipsis;
          overflow: hidden; 
          /* white-space: nowrap; */
        }
        .delete {
          color: red;
          margin-left: 10px;
        }
        .parallax {
        /* The image used */
        background-image: url("../assets/voiture.jpg");

        /* Set a specific height */

        /* Create the parallax scrolling effect */
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        }
</style>
