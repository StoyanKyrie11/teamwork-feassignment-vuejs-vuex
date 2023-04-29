<template>
  <v-autocomplete
    @change="store.getUsers()"
    v-model="data.selectedName"
    :items="data.characterNames"
    color="info"
    bg-color="white"
    item-text=".name"
    hide-no-data
    clearable
    label="Search or select character"
  ></v-autocomplete>
  <table>
    <thead>
      <tr>
        <th @click="sortBy('name')">Name</th>
        <th @click="sortBy('height')">Height</th>
        <th @click="sortBy('mass')">Mass</th>
        <th @click="sortBy('created')">Created</th>
        <th @click="sortBy('edited')">Edited</th>
        <th @click="sortBy('homeworld')">Homeworld</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="person in data.characterFilterData" :key="person.name">
        <td>{{ person.name }}</td>
        <td>{{ person.height }}</td>
        <td>{{ person.mass }}</td>
        <td>{{ person.created }}</td>
        <td>{{ person.edited }}</td>
        <td>{{ person.homeworld }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { reactive, computed, watch, onMounted } from "vue";
import {
  CHARACTER_PEOPLE_URL,
  CHARACTER_PAGES_URL,
} from "../../constants/constants.js";
import axios from "axios";
import store from "../../store/store";
const data = reactive({
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
  modalTableHeaders: [
    { text: "Planet name", value: "planet name" },
    { text: "Diameter", value: "diameter" },
    { text: "Climate", value: "climate" },
    { text: "Population", value: "population" },
  ],
  characterFilterData: [],
  sortBy: "asc",
  sortColumn: "name",
  searchQueryParam: "",
});
/* axios.get("https://swapi.dev/api/people/").then((response) => {
  state.peopleData = response.data.results.map((person) => ({
    name: person.name,
    height: person.height,
    mass: person.mass,
    created: person.created,
    edited: person.edited,
    homeworld: person.homeworld,
  }));
}); */

const getUsers = async () => {
  /* 1. Transfer methods in Vuex store */
  /* Import the default Star Wars Icon as v-icon */
  /* Work on the Router + v-modal for the planets data */
  /* Style the application */
  let initRequest = await axios.get(CHARACTER_PEOPLE_URL);
  initRequest.data.results.forEach((person) =>
    data.characterFilterData.push({
      name: person.name,
      height: person.height,
      mass: person.mass,
      created: person.created,
      edited: person.edited,
      homeworld: person.homeworld,
    })
  );
  let count = initRequest.data.count;
  let pages = Math.ceil(count / 10);
  data.isLoading = true;
  try {
    for (let i = 2; i <= pages; i++) {
      const response = await axios.get(CHARACTER_PAGES_URL + i);
      response.data.results.forEach((result) => {
        data.characterData.push({
          name: result.name,
          height: result.height,
          weight: result.weight,
          created: result.created,
          edited: result.edited,
        });
        data.characterNames.push(result.name);
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    data.isLoading = false;
  }
};

const filteredPeople = computed(() => {
  let filteredData = data.peopleData.filter((person) =>
    person.name.toLowerCase().includes(data.searchQuery.toLowerCase())
  );
  if (data.sortDirection === "asc") {
    filteredData.sort((a, b) =>
      a[data.sortColumn] > b[data.sortColumn] ? 1 : -1
    );
  } else {
    filteredData.sort((a, b) =>
      a[data.sortColumn] < b[data.sortColumn] ? 1 : -1
    );
  }
  return filteredData;
});

function sortBy(column) {
  if (data.sortColumn === column) {
    data.sortDirection = data.sortDirection === "asc" ? "desc" : "asc";
  } else {
    data.sortDirection = "asc";
    data.sortColumn = column;
  }
}

watch(
  () => data.selectedName,
  () => {
    store.getCharacterData();
  }
);
onMounted(async () => {
  try {
    getUsers();
    const usersData = await axios.get("https://swapi.dev/api/people/");
    data.names = usersData.data.results.map((person) => person.name);
  } catch (error) {
    console.log(error);
  }
});
</script>
