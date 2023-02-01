const blobImagesModule = {
  namespaced: true,
  state() {
    return {
      blobImages: {}
    };
  },
  mutations: {
    addBlobImages(state, payload) {
      // eslint-disable-next-line no-param-reassign
      const binaryData = atob(payload.image.split(",")[1]);
      const binaryArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        binaryArray[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([binaryArray], { type: "image/jpeg" });
      // eslint-disable-next-line no-param-reassign
      state.blobImages[payload.name] = URL.createObjectURL(blob);
      // state.blobImages[payload.key] = payload.blobImage;
    }
  },
  getters: {
    allBlobImages(state) {
      return state.blobImages;
    }
  },
  actions: {
    addBlobImages({ commit }, payload) {
      commit("addBlobImages", payload);
    }
  }
};

export default blobImagesModule;
