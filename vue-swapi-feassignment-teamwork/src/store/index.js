import axios from "axios";
import { createStore } from "vuex";
import { reactive } from "vue";

// Store setup
export default createStore({
  state: reactive({
    selectedName: "",
    selectedCharacter: null,
    characterPlanetName: "",
    characterData: [],
    characterNames: [],
    names: [],
    peopleData: [],
    homeworldData: {
      planetName: "",
      diameter: "",
      climate: "",
      population: "",
    },
    isLoading: false,
    isModalOpen: false,
    headers: [
      { text: "Name", value: "name" },
      { text: "Height", value: "height" },
      { text: "Mass", value: "mass" },
      { text: "Created", value: "created" },
      { text: "Edited", value: "edited" },
      { text: "Homeworld", value: "homeworld" },
    ],
    characterFilterData: [],
    sortBy: "asc",
    sortColumn: "name",
    searchQueryParam: "",
  }),
  mutations: {
    setSelectedName(state, payload) {
      state.selectedName = payload;
    },
    setPeopleData(state, payload) {
      state.peopleData = payload;
    },
    setCharacterNames(state, payload) {
      state.characterNames = payload;
    },
    setCharacterPlanetName(state, payload) {
      state.characterPlanetName = payload;
    },
    setHomeworldData(state, payload) {
      state.homeworldData = payload;
    },
    setIsLoading(state, payload) {
      state.isLoading = payload;
    },
    setIsModalOpen(state, payload) {
      state.isModalOpen = payload;
    },
    setCharacterFilterData(state, payload) {
      state.characterFilterData = payload;
    },
    setSearchQueryParam(state, payload) {
      state.searchQueryParam = payload;
    },
    setSortBy(state, payload) {
      state.sortBy = payload;
    },
    setSortColumn(state, payload) {
      state.sortColumn = payload;
    },
  },
  actions: {
    async getUsers(context) {
      let initRequest = await axios.get(CHARACTER_PEOPLE_URL);
      initRequest.data.results.forEach((person) =>
        context.state.characterFilterData.push({
          name: person.name,
          height: person.height,
          weight: person.weight,
          created: person.created,
          edited: person.edited,
          homeworld: person.homeworld,
        })
      );
      let count = initRequest.data.count;
      let pages = Math.ceil(count / 10);
      context.state.isLoading = true;
      try {
        for (let i = 2; i <= pages; i++) {
          const response = await axios.get(CHARACTER_PAGES_URL + i);
          response.data.results.forEach((result) => {
            context.state.characterData.push({
              name: result.name,
              height: result.height,
              weight: result.weight,
              created: result.created,
              edited: result.edited,
            });
            context.state.characterNames.push(result.name);
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        context.state.isLoading = false;
      }
    },

    async getPeopleData(context) {
      try {
        const response = await axios.get(
          `https://swapi.dev/api/people/?search=${context.state.selectedName}`
        );
        const charDataResults = response.data.results.map((person) => {
          return {
            name: person.name,
            height: person.height,
            mass: person.mass,
            created: person.created,
            edited: person.edited,
            homeworld: person.homeworld,
          };
        });
        context.state.peopleData = charDataResults;
        if (charDataResults.length > 0) {
          context.state.selectedCharacter = charDataResults[0];
          context.state.characterPlanetName = await context.dispatch(
            "getPlanetName",
            context.state.selectedCharacter.homeworld
          );
        } else {
          context.state.selectedCharacter = null;
          context.state.characterPlanetName = "";
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    getUserById: (state) => (name) => {
      return state.users.find((user) => user.name === name);
    },
  },
});
