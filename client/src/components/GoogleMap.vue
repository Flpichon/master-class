<template>
  <div>
    <gmap-map
      :center="center"
      :zoom="20"
      style="width:100%;  height: 500px;"
    >
      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen=false"
      >
      <div v-html="infoContent"></div>
      </gmap-info-window>
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        @click="toggleInfo(m, index)"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
      infoContent: '',
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      infoOptions: {
        pixelOffset: {
        width: 0,
        height: -35
        }
      },
      center: { lat: 48.816594, lng: 2.309276 },
      zoom: 11,
      markers: [],
      places: [],
      currentPlace: null,
      infoPosition: null,
      infoOpened: false,
      infoCurrentKey: null
    };
  },

  mounted() {
    this.geolocate();
    const marker = { 
        lat: 48.816594,
        lng: 2.309276 
    };
    this.markers.push({
      position: marker,
      name: 'Efficom',
      description: '13 Rue Camille Pelletan, 92120 Montrouge'
    });
    this.center = marker;
},

  methods: {
    toggleInfo: function (marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoContent = this.getInfoWindowContent(marker);

      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    getInfoWindowContent: function (marker) {
      return (`<div class="card effCard">
        <div class="card-image">
          <figure class="image is-4by3">
            <img src="https://www.efficom.fr/wp-content/uploads/2019/10/logo-EFFICOM-V2okblanc.png" class="superimage m-1" alt="Placeholder image">
          </figure>
        </div>
        <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">${marker.name}</p>
          </div>
        </div>
          <div class="content">
            ${marker.description}
          <br>
          </div>
        </div>
      </div>`);
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = { lat: 48.816594, lng: 2.309276}
      });
    }
  }
};
</script>
<style>
  .effCard {
    background-color: rgb(214, 210, 210) !important;
  }
  .is-4 {
    margin-left: 80px;
  }
  .content {
    text-align: center;
  }

</style>