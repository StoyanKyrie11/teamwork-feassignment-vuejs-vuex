<template>
  <div>
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
        <tr v-for="person in people" :key="person.name">
          <td>{{ person.name }}</td>
          <td>{{ person.height }}</td>
          <td>{{ person.mass }}</td>
          <td>{{ person.created }}</td>
          <td>{{ person.edited }}</td>
          <td>{{ person.homeworld }}</td>
        </tr>
      </tbody>
    </table>
    <v-pagination
      v-model="page"
      :length="totalPages"
      @update:modelValue="changePage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const PAGE_SIZE = 10;
const people = ref([]);
const totalPeople = ref(0);
const totalPages = ref(0);
const page = ref(1);

async function loadPeople() {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?page=${page.value}`
    );
    people.value = response.data.results.map((person) => ({
      name: person.name,
      height: person.height,
      mass: person.mass,
      created: person.created,
      edited: person.edited,
      homeworld: person.homeworld,
    }));
    totalPeople.value = response.data.count;
    totalPages.value = Math.ceil(totalPeople.value / PAGE_SIZE);
  } catch (error) {
    console.error(error);
  }
}

function changePage(newPage) {
  page.value = newPage;
  loadPeople();
}

onMounted(() => {
  loadPeople();
});
</script>
