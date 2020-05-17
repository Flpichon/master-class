<template>
    <div class="container-fluid">
        <div class="row justify-content-center mt-5">
            <div class="col-12 col-lg-10  rounded border shadow">
              <div class="parallax">
                  <h1 class="align-middle text-center p-5 animed soulign">{{article.title}}</h1>
                </div>
                <div class="row mt-5 mb-5">
                    <div class="col-6 text-left">
                        <h3>Le {{article.formatedDateCreation}}</h3>
                    </div>
                    <div class="col-6 text-right">
                        <h3>auteur : <span class="soulign">{{author.username}}</span></h3>
                    </div>
                </div>
                <div class="mt-4" v-html="article.content">
                  {{article.content}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import moment from 'moment';
export default {

  data() {
    return {
      conferenceId: '',
      articleId: '',
      article: {},
      author: {}
    };
  },
  watch: {
    async $route(to, from) {
      this.conferenceId = this.$route.params.conferenceId;
      this.articleId = this.$route.params.articleId;
      if (this.articleId !== 'new') {
        let article;
        try {
          article = await axios.get(`/api/conferences/${this.conferenceId}/articles/${this.articleId}`);
        } catch(e) {
          article = {}
        }
        article = article.data;
        article.formatedDateCreation = moment(String(article.createdAt)).format('MM/DD/YYYY à HH:mm');
        article.formatedDateModification = moment(String(article.modifiedAt)).format('MM/DD/YYYY à HH:mm');
        this.article = article;
      } else {
        this.article = {};
      }
      await this.getAuthor();
    }
  },

    async mounted() {
      this.conferenceId = this.$route.params.conferenceId;
      this.articleId = this.$route.params.articleId;
      if (this.articleId !== 'new') {
        let article;
        try {
        article = await axios.get(`/api/conferences/${this.conferenceId}/articles/${this.articleId}`);
        } catch(e) {
        article = {}
        }
        article = article.data
        article.formatedDateCreation = moment(String(article.createdAt)).format('MM/DD/YYYY à HH:mm');
        article.formatedDateModification = moment(String(article.modifiedAt)).format('MM/DD/YYYY à HH:mm');
        this.article = article;
        } else {
        this.article = {};
      }
      await this.getAuthor();
  },
  methods: {
    async getAuthor() {
      let author = {};
      try {
        author = await axios.get(`/api/conferences/${this.conferenceId}/user`)
      } catch(e) {
        author = {};
      }
      author = author.data;
      this.author = author;
    }
  }
};
</script>

<style>
.soulign {
    text-decoration: underline;
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
}
.animed{
    color : white;
}
</style>