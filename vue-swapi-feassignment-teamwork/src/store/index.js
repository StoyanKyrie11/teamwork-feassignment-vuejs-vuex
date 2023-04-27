import axios from "axios";
import { createStore } from "vuex";

// Store setup
export default createStore({
  state: {
    users: [],
  },
  mutations: {
    getUsers(state, users) {
      state.users = users.data;
    },
  },
  actions: {
    async getUsers({ commit }) {
      try {
        const response = await axios.get("https://swapi.dev/api/people/");
        commit("getUsers", response.data.results);
      } catch (error) {
        console.error(error);
      }
    },
  },
  getters: {
    getUserById: (state) => (name) => {
      return state.users.find((user) => user.name === name);
    },
  },
});
