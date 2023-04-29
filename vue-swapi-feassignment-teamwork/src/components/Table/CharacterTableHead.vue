<script setup>
import { inject } from "vue";

const store = inject("store");
</script>

<template>
  <tr class="star-wars-table-header">
    <th class="text-center" @click="store.columnSorting('name')">
      {{ store.data.headers[0].text }}
    </th>
    <th class="text-center" @click="store.columnSorting('height')">
      {{ store.data.headers[1].text }}
    </th>
    <th class="text-center" @click="store.columnSorting('mass')">
      {{ store.data.headers[2].text }}
    </th>
    <th class="text-center" @click="store.columnSorting('created')">
      {{ store.data.headers[3].text }}
    </th>
    <th class="text-center" @click="store.columnSorting('edited')">
      {{ store.data.headers[4].text }}
    </th>
    <th class="text-center" @click="store.columnSorting('homeworld')">
      {{ store.data.headers[5].text }}
    </th>
  </tr>
</template>
