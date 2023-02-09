const blobImagesModule = {
  namespaced: true,
  state() {
    return {
      blobImages: []
    };
  },
  mutations: {
    removeBlobImages(state) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const prop in state.blobImages) {
        URL.revokeObjectURL(state.blobImages[prop]);
      }
      // eslint-disable-next-line no-param-reassign
      state.blobImages = [];
    },
    buildBlobImages(state, payload) {
      if (payload && payload.image) {
        state.blobImages.push(payload);
      }
    }
  },
  getters: {
    allBlobImages(state) {
      return state.blobImages;
    }
  },
  actions: {
    addBlobImages({ commit }, payload) {
      commit("buildBlobImages", payload);
    },
    removeBlobImages({ commit }) {
      commit("removeBlobImages");
    }
  }
};

export default blobImagesModule;
