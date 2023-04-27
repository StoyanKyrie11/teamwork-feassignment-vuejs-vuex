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
      <tr>
        <td class="text-center">{{ planetName }}</td>
        <td class="text-center">{{ diameter }}</td>
        <td class="text-center">{{ climate }}</td>
        <td class="text-center">{{ population }}</td>
      </tr>
    </tbody>
  </v-table>
  <button style="align-self: flex-start" @click="$emit('close')">X</button>
</template>

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
