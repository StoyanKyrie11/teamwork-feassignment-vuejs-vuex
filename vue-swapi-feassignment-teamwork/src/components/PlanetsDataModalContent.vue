<script setup>
import { defineProps, defineEmits } from "vue";
/* Transfer to store */
const modalTableHeaders = [
  { text: "Planet name", value: "planet name" },
  { text: "Diameter", value: "diameter" },
  { text: "Climate", value: "climate" },
  { text: "Population", value: "population" },
];
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
                v-for="(header, index) in modalTableHeaders"
                :key="index"
                class="text-center"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody class="modal-body">
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
        <button
          class="modal-default-button"
          style="align-self: flex-start"
          @click="$emit('close')"
        >
          X
        </button>
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
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 3vh 0;
}

.modal-default-button {
  float: right;
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
