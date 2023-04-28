<template>
  <v-autocomplete
    @change="callbackMethod()"
    v-model="selected"
    :items="people"
    item-text="name"
    clearable
    filled
    dark
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
      <tr v-for="person in filteredPeople" :key="person.name">
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
import { reactive, computed } from "vue";
import axios from "axios";
const state = reactive({
  peopleData: [],
  searchQuery: "",
  sortDirection: "asc",
  sortColumn: "name",
});
axios.get("https://swapi.dev/api/people/").then((response) => {
  state.peopleData = response.data.results.map((person) => ({
    name: person.name,
    height: person.height,
    mass: person.mass,
    created: person.created,
    edited: person.edited,
    homeworld: person.homeworld,
  }));
});
const callbackMethod = async () => {
  axios.get("https://swapi.dev/api/people/").then((response) => {
    state.peopleData = response.data.results.map((person) => ({
      name: person.name,
      height: person.height,
      mass: person.mass,
      created: person.created,
      edited: person.edited,
      homeworld: person.homeworld,
    }));
  });
};
const filteredPeople = computed(() => {
  let filteredData = state.peopleData.filter((person) =>
    person.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );
  if (state.sortDirection === "asc") {
    filteredData.sort((a, b) =>
      a[state.sortColumn] > b[state.sortColumn] ? 1 : -1
    );
  } else {
    filteredData.sort((a, b) =>
      a[state.sortColumn] < b[state.sortColumn] ? 1 : -1
    );
  }
  return filteredData;
});
function sortBy(column) {
  if (state.sortColumn === column) {
    state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
  } else {
    state.sortDirection = "asc";
    state.sortColumn = column;
  }
}
</script>
