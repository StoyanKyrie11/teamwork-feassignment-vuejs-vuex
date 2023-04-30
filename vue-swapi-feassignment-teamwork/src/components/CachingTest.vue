<template>
  <div>
    <h1>Star Wars Characters</h1>
    <v-pagination v-model="page" :length="pageCount" />
    <ul>
      <li v-for="character in characters" :key="character.name">
        {{ character.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, watchEffect } from "vue";

const characters = ref([]);
const pageCount = ref(0);
const page = ref(1);
const cacheKey = "characters";

watchEffect(async () => {
  const cache = localStorage.getItem(cacheKey);
  if (cache) {
    const cachedData = JSON.parse(cache);
    characters.value = cachedData[page.value - 1];
    pageCount.value = cachedData.length;
  } else {
    const allCharacters = [];
    let response = await axios.get(
      `https://swapi.dev/api/people/?page=${page.value}`
    );

    while (response.data.next) {
      allCharacters.push(response.data.results);
      response = await axios.get(response.data.next);
    }

    allCharacters.push(response.data.results);
    characters.value = allCharacters[page.value - 1];
    localStorage.setItem(cacheKey, JSON.stringify(allCharacters));
    pageCount.value = allCharacters.length;
  }
});
</script>
