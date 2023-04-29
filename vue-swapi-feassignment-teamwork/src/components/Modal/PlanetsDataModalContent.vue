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

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.9s ease;
}

.modal-container {
  width: 80vw;
  margin: auto;
  padding: 3vh 2vw;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 1.3s ease-in-out;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 3vh 0;
}

.modal-default-button {
  position: relative;
  float: right;
  bottom: 13.5vh;
  left: 1vw;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
