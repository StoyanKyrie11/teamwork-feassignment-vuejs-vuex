<script setup>
import axios from "axios";
import _ from "lodash";
import { watch, ref, reactive, onMounted, inject, computed } from "vue";
import {
  CHARACTER_PEOPLE_URL,
  CHARACTER_PAGES_URL,
} from "../constants/constants.js";
import PlanetsDataModal from "./Modal/PlanetsDataModal.vue";

const store = inject("store");

const search = ref("");
const loading = ref(false);
const options = ref({ itemsPerPage: 10 });
const state = reactive({
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
  sortColumn: "name",
  sortingKey: "",
  sortDirection: "asc",
});

/* const sort = (key) => {
  if (state.sortingKey === key) {
    state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
  } else {
    state.sortingKey = key;
    state.sortDirection = "asc";
  }

  store.data.characterData = _.orderBy(
    store.data.characterData,
    key,
    state.sortDirection
  );
}; */

/* Add sorted people array to v-for in tr */
/* const sortedPeople = computed(() => {
  return store.data.characterData;
}); */

const getAllChars = async () => {
  try {
    let initRequest = await axios.get(CHARACTER_PEOPLE_URL);
    initRequest.data.results.forEach((person) =>
      store.data.characterFilterData.push({
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
    store.data.isLoading = true;
    for (let i = 2; i <= pages; i++) {
      const response = await axios.get(CHARACTER_PAGES_URL + i);
      response.data.results.forEach((result) => {
        store.data.characterData.push({
          name: result.name,
          height: result.height,
          mass: result.mass,
          created: result.created,
          edited: result.edited,
          homeworld: result.homeworld,
        });
        store.data.characterNames.push(result.name);
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    store.data.isLoading = false;
  }
};

/* watch(
  () => store.data.selectedName,
  () => {
    store.getCharacterData();
  }
); */
onMounted(() => {
  try {
    store.fetchPeople();
    /* const usersData = await axios.get(CHARACTER_PEOPLE_URL);
    store.data.names = usersData.data.results.map((person) => person.name); */
  } catch (error) {
    console.log("Error: ", error);
  }
});
</script>

<template>
  <v-container>
    <v-autocomplete
      @change="store.getAllChars()"
      v-model="store.data.selectedName"
      :items="store.data.characterNames"
      label="Search a character you must"
      color="info"
      bg-color="white"
      hide-no-data
      clearable
    ></v-autocomplete>

    <v-container>
      <button :disabled="store.data.currPage === 1" @click="store.prevPage()">
        Prev
      </button>
      <button
        :disabled="store.data.currPage === store.getAllPages"
        @click="store.nextPage()"
      >
        Next
      </button>
      <v-table
        style="border-radius: 10px"
        :search="search"
        :loading="loading"
        :options.sync="options"
      >
        <thead>
          <tr>
            <th class="text-center" @click="store.columnSorting('name')">
              {{ store.data.headers[0].text }}
            </th>
            <th class="text-center" @click="store.columnSorting('height')">
              {{ store.data.headers[1].text }}
            </th>
            <th class="text-center" @click="store.columnSorting('mass')">
              {{ store.data.headers[2].text }}
            </th>
            <th class="text-center" @click="store.columnSorting('created')">
              {{ store.data.headers[3].text }}
            </th>
            <th class="text-center" @click="store.columnSorting('edited')">
              {{ store.data.headers[4].text }}
            </th>
            <th class="text-center" @click="store.columnSorting('homeworld')">
              {{ store.data.headers[5].text }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="char in store.handlePagination" :key="char.name">
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
                    store.getPlanetData();
                    store.data.isModalOpen = true;
                  "
                >
                  {{ store.data.characterPlanetName }}
                </button>
                <PlanetsDataModal />
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </v-container>
</template>
