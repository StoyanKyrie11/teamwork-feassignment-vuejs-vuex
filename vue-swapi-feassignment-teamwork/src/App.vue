<script setup>
import CharacterData from "./components/DumpLogic.vue";
import CharacterDataTest from "./components/CharacterData.vue";
import CharacterPlanetName from "./components/CharacterPlanetName.vue";
import PlanetsDataModal from "./components/PlanetsDataModal.vue";
import TestComponent from "./components/TestComponent.vue";
</script>

<template>
  <div class="main">
    <!-- <TestComponent /> -->
    <!-- <TestComponent /> -->
    <!-- <PlanetsDataModal /> -->
    <!-- <CharacterData /> -->
    <CharacterData />
    <!-- <CharacterPlanetName /> -->
  </div>
</template>

<style>
@font-face {
  font-family: "Distant Galaxy";
  src: local("Distant Galaxy"),
    url(./fonts/sf-distant-galaxy.regular.ttf) format("truetype");
}
</style>
