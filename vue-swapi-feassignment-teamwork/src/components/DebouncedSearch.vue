<template>
  <div>
    <v-text-field
      v-model="searchTerm"
      label="Search for a character"
      @input="debouncedSearch"
    />
    <v-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Created</th>
            <th>Edited</th>
            <th>Home World</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="character in characters" :key="character.name">
            <td>{{ character.name }}</td>
            <td>{{ character.height }}</td>
            <td>{{ character.mass }}</td>
            <td>{{ character.created }}</td>
            <td>{{ character.edited }}</td>
            <td>{{ character.homeworld }}</td>
          </tr>
        </tbody>
      </template>
    </v-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const searchTerm = ref("");
const characters = ref([]);

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const searchCharacters = debounce(async (searchTerm) => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?search=${searchTerm}`
    );
    characters.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
}, 2000);

const debouncedSearch = () => {
  searchCharacters(searchTerm.value);
};
</script>
