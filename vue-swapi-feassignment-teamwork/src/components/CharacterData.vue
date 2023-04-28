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
      @change="getPeopleData()"
      v-model="data.selectedName"
      :items="data.characterNames"
      color="info"
      bg-color="white"
      hide-no-data
      clearable
      label="Search a character you must"
    />
    <!-- <v-progress-circular
      color="grey-lighten-4"
      indeterminate
    ></v-progress-circular> -->
    <v-table>
      <thead>
        <tr>
          <th class="text-center" @click="sortingFunction('name')">
            {{ data.headers[0].text }}
          </th>
          <th class="text-center" @click="sortingFunction('height')">
            {{ data.headers[1].text }}
          </th>
          <th class="text-center" @click="sortingFunction('mass')">
            {{ data.headers[2].text }}
          </th>
          <th class="text-center" @click="sortingFunction('created')">
            {{ data.headers[3].text }}
          </th>
          <th class="text-center" @click="sortingFunction('edited')">
            {{ data.headers[4].text }}
          </th>
          <th class="text-center" @click="sortBy('homeworld')">
            {{ data.headers[5].text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Write into a separate component -->
        <tr v-for="char in data.peopleData" :key="char.name">
          <td class="text-center">{{ char.name }}</td>
          <td class="text-center">{{ char.height + " cm" }}</td>
          <td class="text-center">
            {{ char.mass + " kg" }}
          </td>
          <td class="text-center">
            {{ char.created.substring(0, 10).replaceAll("-", "/") }}
          </td>
          <td class="text-center">
            {{ char.edited.substring(0, 10).replaceAll("-", "/") }}
          </td>
          <td class="text-center">
            <div class="root">
              <button
                style="text-decoration: underline"
                class="modal-btn"
                @click.prevent="
                  getPlanetData();
                  data.isModalOpen = true;
                "
              >
                {{ data.characterPlanetName }}
              </button>
              <Teleport to="body">
                <div class="modal" v-if="data.isModalOpen">
                  <planets-data-modal-content
                    @close="data.isModalOpen = false"
                    :show="data.isModalOpen"
                    :planetName="data.homeworldData.planetName"
                    :diameter="data.homeworldData.diameter"
                    :climate="data.homeworldData.climate"
                    :population="data.homeworldData.population"
                  >
                    <template #header>
                      <h3>custom header</h3>
                    </template>
                  </planets-data-modal-content>
                </div>
              </Teleport>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
<script setup>
import axios from "axios";
import { reactive, watch, onMounted, computed } from "vue";
import {
  CHARACTER_PEOPLE_URL,
  CHARACTER_PAGES_URL,
} from "../constants/constants.js";
import PlanetsDataModalContent from "./PlanetsDataModalContent.vue";
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
  characterFilterData: [],
  sortBy: "asc",
  sortColumn: "name",
  searchQueryParam: "",
});
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
      weight: person.weight,
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
const getPeopleData = async () => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?search=${data.selectedName}`
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
    data.peopleData = charDataResults;
    if (charDataResults.length > 0) {
      data.selectedCharacter = charDataResults[0];
      data.characterPlanetName = await getPlanetName(
        data.selectedCharacter.homeworld
      );
    } else {
      data.selectedCharacter = null;
      data.characterPlanetName = "";
    }
  } catch (error) {
    console.log(error);
  }
};
const getPlanetName = async (homeworld) => {
  try {
    const response = await axios.get(homeworld);
    return response.data.name;
  } catch (error) {
    console.log(error);
    return "";
  }
};
const getPlanetData = async () => {
  try {
    const response = await axios.get(data.peopleData[0].homeworld);
    data.homeworldData = {
      planetName: response.data.name,
      diameter: response.data.diameter,
      climate: response.data.climate,
      population: response.data.population,
    };
  } catch (error) {
    console.log(error);
  }
};
const filterCharacters = computed(() => {
  let filterCharacterData = data.peopleData.filter((character) => {
    character.name.toLowerCase().includes(data.searchQueryParam.toLowerCase());
  });
  if (data.sortBy === "asc") {
    /* ASC sorting */
    filterCharacterData.sort((j, k) =>
      j[data.sortColumn] > k[data.sortColumn] ? 1 : -1
    );
  } else {
    /* DESC sorting */
    filterCharacterData.sort((j, k) =>
      j[data.sortColumn] < k[data.sortColumn] ? 1 : -1
    );
  }
  return filterCharacterData;
});
const sortingFunction = (colName) => {
  if (data.sortColumn === colName) {
    data.sortBy = data.sortBy === "asc" ? "desc" : "asc";
  } else {
    data.sortBy = "asc";
    data.sortColumn = colName;
  }
};
watch(
  () => data.selectedName,
  () => {
    getPeopleData();
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
<style lang="scss" scoped>
.modal {
  display: flex;
}
.modal-btn {
  align-self: flex-start;
}
</style>
