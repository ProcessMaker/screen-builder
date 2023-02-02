const blobImagesModule = {
  namespaced: true,
  state() {
    return {
      blobImages: {}
    };
  },
  mutations: {
    removeBlobImages(state) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const prop in state.blobImages) {
        URL.revokeObjectURL(state.blobImages[prop]);
      }
      // eslint-disable-next-line no-param-reassign
      state.blobImages = {};
    },
    buildBlobImages(state, payload) {
      // eslint-disable-next-line no-param-reassign
      if (payload.image) {
        const binaryData = atob(payload.image.split(",")[1]);
        const binaryArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          binaryArray[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([binaryArray], { type: "image/jpeg" });
        // eslint-disable-next-line no-param-reassign
        state.blobImages[payload.name] = URL.createObjectURL(blob);
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
