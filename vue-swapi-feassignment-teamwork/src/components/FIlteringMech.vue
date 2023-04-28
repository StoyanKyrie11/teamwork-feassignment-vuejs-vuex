<template>
  <v-app>
    <v-container>
      <v-table
        :headers="headers"
        :items="data.peopleData"
        :search="search"
        :loading="loading"
        :options.sync="options"
      >
        <tbody>
          <tr v-for="char in data.peopleData" :key="char.name">
            <td>{{ char.name }}</td>
            <td>{{ char.height }}</td>
            <td>{{ char.mass }}</td>
            <td>{{ char.created }}</td>
            <td>{{ char.edited }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </v-app>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import {
  CHARACTER_PEOPLE_URL,
  CHARACTER_PAGES_URL,
} from "../constants/constants.js";

const headers = [
  { text: "Name", value: "name" },
  { text: "Height", value: "height" },
  { text: "Mass", value: "mass" },
  { text: "Created", value: "created" },
  { text: "Edited", value: "edited" },
];

const data = reactive({
  peopleData: [],
  isLoading: false,
  characterFilterData: [],
  characterData: [],
  characterNames: [],
});
const search = ref("");
const loading = ref(false);
const options = ref({ itemsPerPage: 10 });

const getAllChars = async () => {
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

onMounted(() => {
  getAllChars();
});
</script>
