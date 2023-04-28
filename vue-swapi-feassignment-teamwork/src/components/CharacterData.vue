<template>
  <v-container style="height: 500px" fluid>
    <v-row
      cols="12"
      class="center header-text"
      style="display: flex; justify-content: center"
    >
      <img
        src="../assets/StarWarsLogo.jpeg"
        cover
        width="150"
        alt="star-wars-icon"
      />
    </v-row>

    <v-autocomplete
      @change="store.getCharacterData()"
      v-model="store.data.selectedName"
      :items="store.data.characterNames"
      color="info"
      bg-color="white"
      hide-no-data
      clearable
      label="Search a character you must"
    />
    <v-progress-circular
      v-if="store.data.isLoading"
      size="40"
      bg-color="white"
      indeterminate
      style="position: absolute; top: 50%; left: 50%"
    ></v-progress-circular>
    <CharacterTable v-else="store.data.isLoading" />
  </v-container>
</template>
<script setup>
import axios from "axios";
import { watch, onMounted, inject } from "vue";
import { CHARACTER_PEOPLE_URL } from "../constants/constants.js";

import CharacterTable from "../components/Table/CharacterTable.vue";

const store = inject("store");

watch(
  () => store.data.selectedName,
  () => {
    store.getCharacterData();
  }
);
onMounted(async () => {
  try {
    store.getUsers();
    const usersData = await axios.get(CHARACTER_PEOPLE_URL);
    store.data.names = usersData.data.results.map((person) => person.name);
  } catch (error) {
    console.log("Error: ", error);
  }
});
</script>
<style lang="scss" scoped>
.modal {
  display: flex;
}
.modal-btn {
  align-self: flex-start;
}
</style>
