<script setup>
import { watch, onMounted, inject } from "vue";

import CharacterTable from "../components/Table/CharacterTable.vue";
import CharacterTablePagination from "../components/Table/CharacterTablePagination.vue";
import LoadingStateComponent from "../components/LoadingStateComponent/LoadingStateComponent.vue";
import ImageComponent from "../components/ImageComponent/ImageComponent.vue";
import TextFieldComponent from "../components/TextFieldComponent/TextFieldComponent.vue";

const store = inject("store");

watch(
  () => store.inputValue,
  () => {
    store.debouncedSearch();
  },
  () => {}
);

/* watch(
  () => store.inputValue,
  () => {
    store.debouncedSearch();
  }
); */

onMounted(async () => {
  try {
    store.getPagesData();
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
      <ImageComponent />
    </v-row>
    <v-responsive class="mx-auto">
      <TextFieldComponent />

      <!-- <InputField /> -->
    </v-responsive>

    <LoadingStateComponent v-if="store.data.isLoading" />
    <CharacterTable v-else="store.data.isLoading" />

    <!-- Would love to discuss the v-data-table implementation! 
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

    <CharacterTablePagination />
  </v-container>
</template>
