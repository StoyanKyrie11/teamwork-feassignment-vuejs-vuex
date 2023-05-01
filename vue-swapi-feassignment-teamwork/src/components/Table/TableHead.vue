<script setup>
import { inject } from "vue";

const store = inject("store");
</script>

<template>
  <tr class="star-wars-table-header">
    <th class="text-center">
      {{ store.data.headers[0].text }}
    </th>
    <th class="text-center">
      {{ store.data.headers[1].text }}
    </th>
    <th class="text-center">
      {{ store.data.headers[2].text }}
    </th>
    <th class="text-center">
      {{ store.data.headers[3].text }}
    </th>
    <th class="text-center">
      {{ store.data.headers[4].text }}
    </th>
    <th class="text-center">
      {{ store.data.headers[5].text }}
    </th>
  </tr>
</template>
