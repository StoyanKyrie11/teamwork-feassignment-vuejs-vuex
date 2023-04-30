<script setup>
import CharacterData from "./components/CharacterData.vue";
import LoadingCustomData from "./components/LoadingCustomData.vue";
import PaginationTest from "./components/PaginationTest.vue";
</script>
<template>
  <div class="main">
    <CharacterData />
    <!-- <LoadingCustomData /> -->
    <!-- <PaginationTest /> -->
  </div>
</template>
<style>
@font-face {
  font-family: "Distant Galaxy";
  src: local("Distant Galaxy"),
    url(./fonts/sf-distant-galaxy.regular.ttf) format("truetype");
}
</style>
