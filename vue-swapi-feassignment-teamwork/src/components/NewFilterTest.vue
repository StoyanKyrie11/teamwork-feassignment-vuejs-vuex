<template>
  <div>
    <v-text-field label="Search" v-model="search" @input="debouncedSearch" />
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
        <tr v-for="person in store.data.people" :key="person.name">
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
      density="comfortable"
      show-first-last-page
      class="pagination-button"
      @input="loadPeople()"
      @update:modelValue="store.changePage"
      v:model="page"
      :length="9"
      :total-visible="9"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
    />
  </div>
</template>

<script setup>
import { inject } from "vue";

const store = inject("store");
import { ref, onMounted, watch } from "vue";
import axios from "axios";
// import debounce from "lodash/debounce";

const PAGE_SIZE = 10;
const characters = ref([]);
const people = ref([]);
const totalPeople = ref(0);
const totalPages = ref(0);
const page = ref(1);
const search = ref("");
// const debouncedLoadPeople = debounce(loadPeople, 500);

// Debouncing - 2 seconds delay
const debounce = (fn, timeout) => {
  let timeOutId;
  return (...args) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
};

const loadPeople = async (value) => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?page=${page.value}&search=${value}`
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
};

/* function changePage(newPage) {
  page.value = newPage;
  loadPeople();
} */

const changePage = (page) => {
  data.changePage = page;
  getCharacterData();
};

/* function changePage(newPage) {
  if (newPage > page.value) {
    // increment the page value only when going forward
    page.value += 1;
    loadPeople();
  } else {
    // set the new page value and update the paginatedPeople
    page.value = newPage;
    const start = (page.value - 1) * PAGE_SIZE;
    paginatedPeople.value = people.value.slice(start, start + PAGE_SIZE);
  }
} */

function loadNextPage() {
  const nextPage = page.value + 1;
  if (nextPage <= totalPages.value) {
    page.value = nextPage;
    loadPeople();
  }
}

const loadFirstBatch = debounce(async () => {
  const dataResponse = await axios.get(
    `https://swapi.dev/api/people/?search=${search.value}`
  );
  store.data.people = [...characters.value, ...dataResponse.data.results];
  console.log(characters.value);
}, 2000);

const debouncedSearch = () => {
  loadFirstBatch();
};

// const paginatedPeople = ref([]);
watch([people, page], () => {
  const start = (page.value - 1) * PAGE_SIZE;
  store.data.people = store.data.people.slice(start, start + PAGE_SIZE);
  // console.log(paginatedPeople.value);
});

onMounted(() => {
  loadFirstBatch();
  loadPeople();
});
</script>
