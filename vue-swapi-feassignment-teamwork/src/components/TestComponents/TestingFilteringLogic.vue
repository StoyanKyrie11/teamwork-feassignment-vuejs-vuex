<template>
  <div>
    <table>
      <thead>
        <tr>
          <th @click="sort('name')">Name</th>
          <th @click="sort('height')">Height</th>
          <th @click="sort('mass')">Mass</th>
          <th @click="sort('created')">Created</th>
          <th @click="sort('edited')">Edited</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in paginatedPeople" :key="person.url">
          <td>{{ person.name }}</td>
          <td>{{ person.height }}</td>
          <td>{{ person.mass }}</td>
          <td>{{ person.created }}</td>
          <td>{{ person.edited }}</td>
        </tr>
      </tbody>
    </table>

    <div>
      <button :disabled="page === 1" @click="prevPage">Prev</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button :disabled="page === totalPages" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onUpdated } from "vue";
import axios from "axios";
import _ from "lodash";

const state = reactive({
  people: [],
  nextPeople: [],
  sortKey: "",
  sortDirection: "asc",
  page: 1,
  perPage: 10,
});

const fetchPeople = async () => {
  const response = await axios.get("https://swapi.dev/api/people");
  state.people = response.data.results;
};

const sort = (key) => {
  if (state.sortKey === key) {
    state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
  } else {
    state.sortKey = key;
    state.sortDirection = "asc";
  }

  state.people = _.orderBy(state.people, key, state.sortDirection);
};

const paginatedPeople = computed(() => {
  const startIndex = (state.page - 1) * state.perPage;
  const endIndex = startIndex + state.perPage;
  return state.people.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(state.people.length / state.perPage);
});

const nextPage = () => {
  state.page++;
};

const prevPage = () => {
  state.page--;
};

onMounted(() => {
  fetchPeople();
});
</script>
