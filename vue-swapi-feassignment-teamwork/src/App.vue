<script setup>
import CachingTest from "./components/CachingTest.vue";
import CharacterData from "./components/CharacterData.vue";
import DebouncedSearch from "./components/DebouncedSearch.vue";
import LoadingCustomData from "./components/LoadingCustomData.vue";
import MainComponent from "./components/MainComponent.vue";
import CharacterPlanetName from "./components/CharacterPlanetName.vue";
import PlanetNameTestData from "./components/PlanetNameTestData.vue";
</script>
<template>
  <div class="main">
    <!-- <CharacterData /> -->
    <!-- <DebouncedSearch /> -->
    <!-- <CachingTest /> -->
    <MainComponent />
    <!-- <CharacterPlanetName /> -->
    <!-- <PlanetNameTestData /> -->
  </div>
</template>
<style>
@font-face {
  font-family: "Distant Galaxy";
  src: local("Distant Galaxy"),
    url(./fonts/sf-distant-galaxy.regular.ttf) format("truetype");
}
</style>
