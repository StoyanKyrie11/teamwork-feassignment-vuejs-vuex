<script setup>
import { watch, onMounted, inject } from "vue";

import CharacterTable from "../components/Table/CharacterTable.vue";

const store = inject("store");

watch(
  () => store.data.selectedName,
  () => {
    store.getCharacterData();
  }
);

onMounted(() => {
  try {
    store.getCharacterData();
  } catch (error) {
    console.log("Error: ", error);
  }
});
</script>

<template>
  <!-- Extract each component into a separate one and import it -->
  <v-container class="main-container" fluid>
    <v-row cols="12">
      <v-img
        class="star-wars-svg"
        src="https://cdn.worldvectorlogo.com/logos/star-wars-4.svg"
        width="150"
        height="150"
        alt="star-wars-icon"
      />
    </v-row>

    <v-text-field
      class="star-wars-text-field"
      @change="store.getCharacterData()"
      v-model="store.data.selectedName"
      :items="store.data.characterNames"
      :debounce="2000"
      type="text"
      placeholder="ex: Luke Skywalker"
      hide-no-data
      clearable
      color="orange"
      bg-color="white"
    />

    <v-progress-circular
      class="loader"
      v-if="store.data.isLoading"
      size="40"
      bg-color="white"
      indeterminate
    ></v-progress-circular>
    <CharacterTable class="star-wars-table" v-else="store.data.isLoading" />

    <!-- TODO: Would love to discuss the v-data-table implementation! 
    Header values do NOT get populated in table as per 
    default behavior. :headers does not work! 
    Link to resource: https://vuetifyjs.com/en/components/data-tables/headers/ 
     -->
    <!-- <v-data-table
      v-else="!store.data.isLoading"
      :items-per-page="5"
      :headers="store.data.headers"
      :items="store.data.characterData"
      loading-text="Patient you must be, young padawan!"
      must-sort
      class="elevation-1"
    /> -->
    <!-- Add styles for it -->
    <!-- Remove magic numbers with store data -->
    <v-pagination
      class="pagination-button"
      @update:modelValue="store.changePage"
      v:model="store.data.changePage"
      :length="store.data.totalDataPageCount"
      :total-visible="store.data.totalDataPageCount"
    ></v-pagination>
  </v-container>
</template>
