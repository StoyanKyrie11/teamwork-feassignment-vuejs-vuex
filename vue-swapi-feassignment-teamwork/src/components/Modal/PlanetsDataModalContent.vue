<script setup>
import { defineProps, defineEmits, inject } from "vue";

const store = inject("store");

defineProps({
  show: Boolean,
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
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <v-table>
          <thead class="modal-header">
            <tr>
              <th
                v-for="(header, index) in store.data.modalTableHeaders"
                :key="index"
                class="text-center"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody class="modal-body">
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
        <button class="modal-default-button" @click="$emit('close')">X</button>
      </div>
    </div>
  </Transition>
</template>
