<script setup>
import { inject } from "vue";

const store = inject("store");
</script>

<template>
  <!-- <v-text-field
        class="star-wars-text-field"
        @keydown.enter.prevent
        @input="store.debouncedSearch()"
        v-model="store.data.selectedName"
        :items="store.data.people"
        :search-input.sync="store.data.selectedName"
        prepend-inner-icon="mdi-magnify"
        placeholder="ex: Luke Skywalker"
        maxlength="50"
        type="text"
        autofocus
        hide-no-data
        clearable
        color="orange"
        bg-color="white"
      /> -->
  <!-- Working field -->
  <!-- <v-text-field
    class="star-wars-text-field"
    @keydown.enter.prevent
    @input="store.debouncedSearch"
    @keyup.enter="store.debouncedSearch"
    :search-input.sync="store.inputValue"
    prepend-inner-icon="mdi-magnify"
    placeholder="ex: Luke Skywalker"
    maxlength="50"
    type="text"
    autofocus
    hide-no-data
    clearable
    color="orange"
    bg-color="white"
  /> -->
  <v-text-field
    v-model="store.search"
    @input="store.debouncedSearch"
    prepend-inner-icon="mdi-magnify"
    placeholder="ex: Luke Skywalker"
    maxlength="50"
    type="text"
    autofocus
    hide-no-data
    clearable
    color="orange"
    bg-color="white"
  />
</template>

<style lang="scss" scoped></style>
