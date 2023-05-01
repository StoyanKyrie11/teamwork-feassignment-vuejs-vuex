<script setup>
import { inject } from "vue";

const store = inject("store");
</script>

<template>
  <th
    class="text-center"
    v-for="(header, index) in store.data.headers"
    :key="index"
  >
    {{ header.text }}
  </th>
</template>
