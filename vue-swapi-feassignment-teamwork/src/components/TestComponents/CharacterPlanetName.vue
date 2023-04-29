<template>
  <v-container>
    <v-combobox
      v-model="selectedName"
      :items="names"
      label="Select a name"
    ></v-combobox>
    <v-card v-if="selectedPerson">
      <v-card-title>Planet for {{ selectedPerson.name }}</v-card-title>
      <v-card-text>{{ planetName }}</v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import axios from "axios";
import { ref, watch, onMounted } from "vue";
const selectedName = ref("");
const names = ref([]);
const selectedPerson = ref(null);
const planetName = ref("");
const getPersonData = async () => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?search=${selectedName.value}`
    );
    const peopleData = response.data.results.map((person) => {
      return {
        name: person.name,
        planetUrl: person.homeworld,
      };
    });
    if (peopleData.length > 0) {
      selectedPerson.value = peopleData[0];
      planetName.value = await getPlanetName(selectedPerson.value.planetUrl);
    } else {
      selectedPerson.value = null;
      planetName.value = "";
    }
  } catch (error) {
    console.log(error);
  }
};
const getPlanetName = async (planetUrl) => {
  try {
    const response = await axios.get(planetUrl);
    return response.data.name;
  } catch (error) {
    console.log(error);
    return "";
  }
};
const getNames = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    names.value = response.data.results.map((person) => person.name);
  } catch (error) {
    console.log(error);
  }
};
watch(selectedName, () => {
  getPersonData();
});
onMounted(() => {
  getNames();
});
</script>
