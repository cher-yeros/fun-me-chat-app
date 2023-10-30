import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const model = {
  token: {
    default: null,
    saved: true,
  },
  user: {
    default: null,
    saved: true,
  },
  loggedIn: {
    default: false,
    saved: true,
  },
};

import { getVuexState, saveStatePlugin } from "vuex-plugin-save-state";

const store = new Vuex.Store({
  strict: true,
  state: getVuexState(model),
  mutations: {
    setUser(state, user) {
      state.user = user;
      if (user) {
        state.loggedIn = true;
      } else {
        state.loggedIn = false;
      }
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },
  },
  plugins: [
    saveStatePlugin(model, {
      namespace: `myapp@${process.env.VUE_APP_VERSION || "0.0.1"}`,
      savedByDefault: true,
      clearStorageOnError: process.env.NODE_ENV === "production",
    }),
  ],
});

export default store;
