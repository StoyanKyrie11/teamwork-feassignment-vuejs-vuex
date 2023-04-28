<script setup>
import { defineProps, defineEmits } from "vue";
const modalTableHeaders = [
  { text: "Planet name", value: "planet name" },
  { text: "Diameter", value: "diameter" },
  { text: "Climate", value: "climate" },
  { text: "Population", value: "population" },
];
defineProps({
  planetName: {
    type: String,
    required: true,
  },
  diameter: {
    type: String,
    required: true,
  },
  climate: {
    type: String,
    required: true,
  },
  population: {
    type: String,
    required: true,
  },
});
defineEmits(["close"]);
</script>
<template>
  <v-table>
    <thead>
      <tr>
        <th
          v-for="(header, index) in modalTableHeaders"
          :key="index"
          class="text-center"
        >
          {{ header.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Write into a separate component -->
      <tr>
        <td class="text-center">{{ planetName }}</td>
        <td class="text-center">{{ diameter + " km" }}<sup>2</sup></td>
        <td class="text-center">{{ climate }}</td>
        <td class="text-center">
          {{ Number(population).toLocaleString("en-US") }}
        </td>
      </tr>
    </tbody>
  </v-table>
  <button style="align-self: flex-start" @click="$emit('close')">X</button>
</template>
