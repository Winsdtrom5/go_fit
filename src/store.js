import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    username: '', // Initial value of username
    jabatan: '', // Initial value of jabatan
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setJabatan(state, jabatan) {
      state.jabatan = jabatan;
    },
  },
});

export default store;
