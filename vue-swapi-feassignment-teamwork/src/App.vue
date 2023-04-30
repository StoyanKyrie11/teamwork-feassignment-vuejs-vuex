<script setup>
import CachingTest from "./components/CachingTest.vue";
import CharacterData from "./components/CharacterData.vue";
import DebouncedSearch from "./components/DebouncedSearch.vue";
import FilteringTest from "./components/FilteringTest.vue";
import FilteringTestTwo from "./components/FilteringTestTwo.vue";
import LoadingCustomData from "./components/LoadingCustomData.vue";
import PaginationTest from "./components/PaginationTest.vue";
import NewFilterTest from "./components/NewFilterTest.vue";
</script>
<template>
  <div class="main">
    <!-- <CharacterData /> -->
    <!-- <DebouncedSearch /> -->
    <!-- <CachingTest /> -->
    <NewFilterTest />
  </div>
</template>
<style>
@font-face {
  font-family: "Distant Galaxy";
  src: local("Distant Galaxy"),
    url(./fonts/sf-distant-galaxy.regular.ttf) format("truetype");
}
</style>
