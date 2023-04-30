<template>
  <v-container>
    <v-text-field
      v-model="search"
      label="Search"
      outlined
      @input="updateFilteredPeople"
    />

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Height</th>
          <th>Mass</th>
          <th>Created</th>
          <th>Edited</th>
          <th>Homeworld</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(person, index) in pagedPeople" :key="index">
          <td>{{ person.name }}</td>
          <td>{{ person.height }}</td>
          <td>{{ person.mass }}</td>
          <td>{{ new Date(person.created).toLocaleString() }}</td>
          <td>{{ new Date(person.edited).toLocaleString() }}</td>
          <td>{{ person.homeworld.name }}</td>
        </tr>
      </tbody>
    </table>

    <v-pagination v-model="currentPage" :length="totalPages" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const API_URL = "https://swapi.dev/api/people/";

const people = ref([]);
const search = ref("");
const currentPage = ref(1);

const filteredPeople = computed(() => {
  return people.value.filter((person) =>
    person.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredPeople.value.length / 10);
});

const pagedPeople = computed(() => {
  const startIndex = (currentPage.value - 1) * 10;
  const endIndex = startIndex + 10;
  return filteredPeople.value.slice(startIndex, endIndex);
});

const updateFilteredPeople = () => {
  currentPage.value = 1;
};

onMounted(async () => {
  const response = await axios.get(API_URL);
  people.value = response.data.results.map((person) => {
    return {
      name: person.name,
      height: person.height,
      mass: person.mass,
      created: person.created,
      edited: person.edited,
      homeworld: person.homeworld,
    };
  });
  const homeworldRequests = people.value.map((person) =>
    axios.get(person.homeworld)
  );

  const homeworldResponses = await axios.all(homeworldRequests);
  homeworldResponses.forEach((response, index) => {
    people.value[index].homeworld = response.data;
  });
});
</script>
