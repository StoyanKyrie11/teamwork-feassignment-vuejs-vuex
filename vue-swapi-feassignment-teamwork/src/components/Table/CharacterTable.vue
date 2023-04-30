<script setup>
import CharacterTableHead from "./CharacterTableHead.vue";
import CharacterTableBody from "./CharacterTableBody.vue";
</script>

<template>
  <v-table class="star-wars-table">
    <thead>
      <CharacterTableHead />
    </thead>

    <tbody>
      <CharacterTableBody />
    </tbody>
  </v-table>
</template>
