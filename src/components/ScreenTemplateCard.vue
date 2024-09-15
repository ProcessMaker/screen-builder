<template>
  <div>
    <b-card
      img-top
      class="mb-2 screenbuilder-template-card"
    >
      <div
        v-if="thumbnail"
        class="thumbnail-container thumbnail-image-container"
      >
        <img class="thumbnail-image" :src="thumbnail" :alt="`${template.name}`"/>
      </div>
      <div
        v-else
        class="thumbnail-container thumbnail-icon-container d-flex align-items-center justify-content-center"
      >
        <i class="p-4 fas fa-palette thumbnail-icon"></i>
      </div>
      <hr class="card-divider">
      <b-card-body>
        <div class="template-details">
          <span class="template-name d-block pt-1">{{ template.name }}</span>
          <span class="template-description d-block">{{ template.description }}</span>
        </div>
      </b-card-body>
    </b-card>
    
  </div>
</template>

<script>

export default {
  mixins: [],
  props: ['template'],
  data() {
    return {
    };
  },
  computed: {
    thumbnail() {
      if (this.template?.template_media && this.template.template_media.length > 0) {
        return this.template.template_media[0].url;
      } else if (this.template?.template_media?.thumbnail?.url) {
        return this.template?.template_media.thumbnail.url
      }
      return null;
    },
  },
  mounted() {
  },
  methods: {
    // selectTemplate() {
    //   this.$emit("template-selected", this.template.id);
    // },
  },
};
</script>

<style lang="scss" scoped>

.screenbuilder-template-card {
  width: 225px;
  margin: 8px;
  border: 1px solid #D7DDE5;
  border-radius: 8px;
  box-shadow: 0px 3px 6px -3px rgb(0, 0, 0, 0.05), 0px 2px 4px -2px rgba(0, 0, 0, 0.05);;
}

.card-divider {
  width: 100%;
  margin: 0px;
  background-color: #D7DDE5;
}

// .thumbnail-container {
//   width: 247px;
//   height: 133px;
//   border: 2px solid #CDDDEE;
//   border-radius: 7px;
//   background-color: #fff;
// }

.thumbnail-container:hover,
.thumbnail-container.active {
  border-color: #1572C2;
  cursor: pointer;
}

.thumbnail-image {
  width: 100%;
  border-radius: 8px 8px 0px 0px;
}

.thumbnail-image-container {
  border-radius: 8px;
  padding: 0px !important;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.thumbnail-icon {
  color: #CDDDEE;
  font-size: 59px;
}

.template-details {
  padding: 10px;
}

.template-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2F343B;
}

.template-description {
  font-size: 12.5px;
  font-weight: 400;
  line-height: 18px;
  color: #4E5663;
}

</style>