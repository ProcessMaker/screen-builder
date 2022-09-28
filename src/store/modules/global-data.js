import { debounce } from "lodash";

const namespaced = true;

const updateData = async (mainScreen, commit, getters) => {
  const { currentJsonData } = getters;
  const jsonData = JSON.stringify(mainScreen.vdata);
  if (currentJsonData !== jsonData) {
    commit("updateData", jsonData);
  }
};
const updateDataDebounced = debounce(updateData, 500);

const globalDataModule = {
  namespaced,
  state: () => {
    return {
      jsonData: "{}",
      dataChanged: 0
    };
  },
  getters: {
    currentJsonData(state) {
      return state.jsonData;
    }
  },
  mutations: {
    updateData(state, jsonData) {
      state["jsonData"] = jsonData;
      state["dataChanged"]++;
    }
  },
  actions: {
    updateData({ commit, getters }, mainScreen) {
      updateDataDebounced(mainScreen, commit, getters);
    },
    async updateDataNow({ commit }, mainScreen) {
      await updateData(mainScreen, commit);
    }
  }
};

export default globalDataModule;
