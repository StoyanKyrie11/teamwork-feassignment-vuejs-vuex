<script setup>
import { reactive, ref, onMounted, inject } from "vue";
import axios from "axios";
import {
  CHARACTER_PEOPLE_URL,
  CHARACTER_PAGES_URL,
} from "../constants/constants.js";
import CharacterTableHead from "../components/Table/CharacterTableHead.vue";
import CharacterTableBody from "../components/Table/CharacterTableBody.vue";

const store = inject("store");

const search = ref("");
const loading = ref(false);
const options = ref({ itemsPerPage: 10 });

/* const getAllChars = async () => {
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
 */
onMounted(async () => {
  try {
    store.getPeople();
    const usersData = await axios.get(CHARACTER_PEOPLE_URL);
    store.data.names = usersData.data.results.map((person) => person.name);
  } catch (error) {
    console.log("Error: ", error);
  }
});
</script>

<template>
  <v-container>
    <v-autocomplete
      @change="store.getCharacterData()"
      v-model="store.data.selectedName"
      :items="store.data.characterNames"
      label="Search a character you must"
      color="info"
      bg-color="white"
      hide-no-data
      clearable
    ></v-autocomplete>
    <v-table :search="search" :loading="loading" :options.sync="options">
      <thead>
        <CharacterTableHead />
      </thead>

      <tbody>
        <tr v-for="char in store.data.characterData" :key="char.name">
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
</template>
