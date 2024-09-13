<template>
  <div>
    <b-card
      img-top
      style="max-width: 20rem;"
      class="mb-2 p-0"
    >
      <img class="thumbnail-image" v-if="thumbnail" :src="thumbnail" :alt="`${template.name}`"/>
      <i v-else class="fas fa-palette thumbnail-icon"></i>
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

.screen-template-card {
  // border: none;
}



.thumbnail-container:hover,
.thumbnail-container.active {
  border-color: #1572C2;
  cursor: pointer;
}

.thumbnail-image {
  width: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.thumbnail-icon {
  color: #CDDDEE;
  font-size: 59px;
}

.template-details {
  color: #556271;
}

.template-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
}

.template-description {
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

</style>