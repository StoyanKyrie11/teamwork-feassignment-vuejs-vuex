<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>Birth Year</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in displayedPeople" :key="person.url">
          <td>{{ person.name }}</td>
          <td>{{ person.gender }}</td>
          <td>{{ person.birth_year }}</td>
        </tr>
      </tbody>
    </table>
    <v-pagination
      v-model="page"
      :length="totalPages"
      @input="changePage"
    ></v-pagination>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const PAGE_SIZE = 10;
const people = ref([]);
const totalPages = ref(0);
const page = ref(1);

async function fetchPeople() {
  const response = await axios.get("https://swapi.dev/api/people");
  people.value = response.data.results;
  totalPages.value = Math.ceil(response.data.count / PAGE_SIZE);
}

function changePage(newPage) {
  page.value = newPage;
}

const displayedPeople = computed(() => {
  const startIndex = (page.value - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  return people.value.slice(startIndex, endIndex);
});

onMounted(() => {
  fetchPeople();
});
</script>
