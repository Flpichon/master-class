<template>
  <div id="app">
    <div class="row">
      <div class="col-md-2">
        <label for="">Titre</label>
      </div>
      <div class="col-md-4">
            <input v-model="article.title" type="text">
      </div>
    </div>
    <button @click="saveContent">button</button>
    <vue-editor id="editor" v-model="article.content" useCustomImageHandler @image-added="handleImageAdded"> </vue-editor>
  </div>
</template>
 
<script>
import { VueEditor, Quill } from "vue2-editor";
import axios from "axios";
export default {

  data() {
    return {
      conferenceId: '',
      articleId: '',
      article: {}
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
        this.article = article.data;
      } else {
        this.article = {}
      }
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
        this.article = article.data;
        } else {
        this.article = {}
      }
  },
  methods: {
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      let formData = new FormData();
      formData.append("image", file);
      axios({
        url: "/api/containers/container1/upload",
        method: "POST",
        data: formData
      })
        .then(async result => {
          const ImageBlot = Quill.import('formats/image');
          ImageBlot.sanitize = function(url) {
          return url;
          };

          let url = `/api/containers/container1/download/${file.name}`;
          Editor.insertEmbed(cursorLocation, "image", ImageBlot.sanitize(url));
          resetUploader();
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveContent: function() {
      // You have the content to save
      this.article.authorId = localStorage.getItem('userId');
      console.log(this.article.content);
      const conferenceId = this.$route.params.conferenceId;
      console.log("conferenceId", conferenceId)
      console.log(this.article);
      const method = this.article.id ? 'PUT' : 'POST';
      const url = this.article.id
        ? `/api/conferences/${conferenceId}/articles/${this.articleId}`
        : `/api/conferences/${conferenceId}/articles`;
      axios({
        url,
        method,
        data: this.article
      })
        .then(article => {
          this.$router.push(`/conference/${conferenceId}`);
          this.$notify({
            type: 'success',
            group: 'foo',
            title: 'Succès',
            text: method === 'PUT' ? `L'article a bien été modifié.` : `L'article a bien été créé.`
          });
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
};
</script>
<style>
  #app {
    background: white;
    margin: 10px;
  }
</style>