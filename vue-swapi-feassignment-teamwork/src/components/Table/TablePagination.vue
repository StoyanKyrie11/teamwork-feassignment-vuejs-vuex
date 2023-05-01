<script setup>
import { inject } from "vue";

const store = inject("store");
</script>

<template>
  <v-pagination
    density="comfortable"
    show-first-last-page
    class="pagination-button"
    @input="store.getCharacterData()"
    @update:modelValue="store.changePage"
    v:model="store.data.currPage"
    :length="9"
    :total-visible="9"
    prev-icon="mdi-menu-left"
    next-icon="mdi-menu-right"
  />
</template>
