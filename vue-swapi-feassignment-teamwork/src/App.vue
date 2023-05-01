<script setup>
import CachingTest from "./components/CachingTest.vue";
import MainComponent from "./components/MainComponent.vue";
import ThemingTest from "./components/ThemingTest.vue";
</script>

<template>
  <div class="main">
    <!-- <CharacterData /> -->
    <!-- <CachingTest /> -->
    <MainComponent />
    <!-- <ThemingTest /> -->
  </div>
</template>
<style>
@font-face {
  font-family: "Distant Galaxy";
  src: local("Distant Galaxy"),
    url(./fonts/sf-distant-galaxy.regular.ttf) format("truetype");
}
</style>
