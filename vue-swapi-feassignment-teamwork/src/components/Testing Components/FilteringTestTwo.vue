<template>
  <div>
    <v-text-field v-model="search" label="Search" @input="searchPeople" />

    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="person in paginatedPeople" :key="person.name">
          <p><strong>Name:</strong> {{ person.name }}</p>
          <p><strong>Height:</strong> {{ person.height }}</p>
          <p><strong>Mass:</strong> {{ person.mass }}</p>
          <p><strong>Created:</strong> {{ person.created }}</p>
          <p><strong>Edited:</strong> {{ person.edited }}</p>
          <p><strong>Home World:</strong> {{ person.homeworld }}</p>
        </li>
      </ul>

      <v-pagination
        class="pagination-button"
        @update:modelValue="changePage"
        v:model="changePage"
        :length="totalPages"
        :total-visible="totalPages"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive, computed } from "vue";

const data = reactive({
  peopleData: [],
  filteredPeopleData: [],
  search: "",
  isLoading: false,
  page: 1,
  limit: 10,
  changePage: 1,
});

const searchPeople = async () => {
  const query = data.search.toLowerCase().trim();

  data.filteredPeopleData = data.peopleData.filter(
    (person) =>
      person.name.toLowerCase().includes(query) ||
      person.homeworld.toLowerCase().includes(query)
  );
  data.page = 1;
};

const loadPeopleData = async () => {
  data.isLoading = true;

  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    data.peopleData = response.data.results.map((person) => ({
      name: person.name,
      height: person.height,
      mass: person.mass,
      created: person.created,
      edited: person.edited,
      homeworld: person.homeworld,
    }));

    const homeworldRequests = data.peopleData.map((person) =>
      axios.get(person.homeworld)
    );
    const homeworldResponses = await Promise.all(homeworldRequests);
    data.peopleData.forEach(
      (person, index) =>
        (person.homeworld = homeworldResponses[index].data.name)
    );

    searchPeople();
  } catch (error) {
    console.log(error);
  }

  data.isLoading = false;
};

const totalPages = computed(() =>
  Math.ceil(data.filteredPeopleData.length / data.limit)
);

const paginatedPeople = computed(() => {
  const startIndex = (data.page - 1) * data.limit;
  const endIndex = startIndex + data.limit;
  return data.filteredPeopleData.slice(startIndex, endIndex);
});

const changePage = (page) => {
  data.changePage = page;
};

loadPeopleData();
</script>
