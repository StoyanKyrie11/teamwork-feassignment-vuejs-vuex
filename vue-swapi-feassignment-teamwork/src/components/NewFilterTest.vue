<template>
  <div>
    <input
      v-model="searchQuery"
      @input="debounceSearch"
      type="text"
      placeholder="Search..."
    />
    <ul>
      <li v-for="item in filteredData" :key="item.name">
        {{ item.name }}
      </li>
    </ul>
    <div>
      <button @click="previousPage" :disabled="!previous">Previous</button>
      <button @click="nextPage" :disabled="!next">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import axios from "axios";

const searchQuery = ref("");
const currentPage = ref(1);
const data = reactive({
  results: [],
  count: 0,
  previous: null,
  next: null,
});

const fetchData = async () => {
  const response = await axios.get(
    `https://swapi.dev/api/people/?page=${currentPage.value}`
  );
  data.results = response.data.results;
  data.count = response.data.count;
  data.previous = response.data.previous;
  data.next = response.data.next;
};

const filteredData = computed(() => {
  return data.results.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const debounceSearch = () => {
  // Debounce search query input by 500ms
  setTimeout(() => {
    fetchData();
  }, 500);
};

const previousPage = () => {
  currentPage.value--;
  fetchData();
};

const nextPage = () => {
  currentPage.value++;
  fetchData();
};

watch([currentPage, searchQuery], () => {
  fetchData();
});

onMounted(() => {
  fetchData();
});
</script>
