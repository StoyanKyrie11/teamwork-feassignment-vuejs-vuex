<script setup>
import axios from "axios";
import { reactive, onMounted, onUpdated } from "vue";
import { RouterLink } from "vue-router";
import {
  CHARACTER_PEOPLE_URL,
  CHARACTER_PAGES_URL,
} from "../constants/constants";

const state = reactive({
  selectedCharacter: "",
  // Store character names ONLY
  characterNames: [],
  // Store all character data - name, height, weight, created, edited
  characterData: [],
  tableHeaders: [
    { text: "Name", value: "name" },
    { text: "Height", value: "height" },
    { text: "Mass", value: "mass" },
    { text: "Created", value: "created" },
    { text: "Edited", value: "edited" },
  ],
  isLoading: false,
  sortBy: [{ key: "name", order: "asc" }],
});

const getUsers = async () => {
  /* Transfer method in store */
  /* Import the default Star Wars Icon as v-icon */
  /* Work on the Router + v-modal for the planets data */
  /* Style the application */
  /* Write a method to query data only for one person */
  let initRequest = await axios.get(CHARACTER_PEOPLE_URL);
  let count = initRequest.data.count;
  let pages = Math.ceil(count / 10);
  state.isLoading = true;
  try {
    for (let i = 2; i <= pages; i++) {
      const response = await axios.get(CHARACTER_PAGES_URL + i);
      response.data.results.forEach((result) => {
        state.characterData.push({
          name: result.name,
          height: result.height,
          weight: result.weight,
          created: result.created,
          edited: result.edited,
        });
        state.characterNames.push(result.name);
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    state.isLoading = false;
  }
};

onMounted(() => {
  getUsers();
  //   store.dispatch("fetchUsers");
});
</script>

<template>
  <div class="container">
    <h3 class="user-title">Character Data</h3>
    <v-container fluid>
      <v-combobox
        color="success"
        bg-color="white"
        clearable
        label="Select a character you should..."
        filled
        :items="state.characterNames"
        v-model="state.selectedCharacter"
      ></v-combobox>
    </v-container>
    <!-- Style and position the logo -->
    <!-- <v-img 
    src="../assets/star-wars-logo-main.jpg" 
    contain 
    width="50" 
    alt="star-wars-icon" /> -->
    <!-- <v-data-table
      v-else
      dark
      dense
      :loading="isLoading"
      :headers="state.tableHeaders"
      :items="state.characterData"
      :key="state.characterData.name"
      loading-text="Loading it is. Patient you must be!"
      must-sort
      hide-default-footer
    ></v-data-table> -->
    <ul>
      <span v-if="state.isLoading">Loading data...</span>
      <li v-else v-for="user in state.characterData" :key="user.name">
        <p>Character name: {{ user.name }}</p>
        <p>Character Height: {{ user.height + " cm" }}</p>
        <p>Character Weight (kg): {{ user.mass + " kg" }}</p>
        <p>
          Date Created: {{ user.created.substring(0, 10).replaceAll("-", "/") }}
        </p>
        <p>
          Date Last Edited:
          {{ user.edited.substring(0, 10).replaceAll("-", "/") }}
        </p>
        Character Home World:
        <a href="#" target="_blank" alt="home-planet" src="{{user.homeworld}}"
          >Click here for more info...</a
        >
      </li>
    </ul>
  </div>
</template>
