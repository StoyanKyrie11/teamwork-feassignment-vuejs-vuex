<script setup>
import CharacterTableHead from "./CharacterTableHead.vue";
import CharacterTableBody from "./CharacterTableBody.vue";
/* Add logic for No character data found with v-if */
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
