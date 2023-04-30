<template>
  <div>
    <label for="input-field">Enter a Star Wars character name:</label>
    <input id="input-field" v-model="inputValue" @input="getCharacter" />
    <p v-if="character">The character's name is {{ character.name }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const inputValue = ref("");
const character = ref(null);

const getCharacter = async () => {
  const response = await axios.get(
    `https://swapi.dev/api/people/?search=${inputValue.value}`
  );
  character.value = response.data.results[0];
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 8px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #ccc;
}
</style>
