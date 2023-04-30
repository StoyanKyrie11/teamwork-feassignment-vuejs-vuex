<script setup>
import { inject } from "vue";

const store = inject("store");
</script>

<template>
  <v-progress-circular
    class="loader"
    size="40"
    bg-color="white"
    indeterminate
  />
</template>
