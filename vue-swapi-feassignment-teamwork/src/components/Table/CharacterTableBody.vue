<script setup>
import { inject } from "vue";
import PlanetsDataModal from "../Modal/PlanetsDataModal.vue";

const store = inject("store");
</script>

<template>
  <tr
    class="star-wars-table-body"
    v-for="char in store.data.people"
    :key="char.name"
  >
    <!-- Refactor - iterate to pass the utility functions as props to the v-for -->
    <!-- Extract the data into separate components -->
    <td class="text-center">{{ char.name }}</td>
    <td class="text-center">{{ char.height + " cm" }}</td>
    <td class="text-center">
      {{ char.mass + " kg" }}
    </td>
    <td class="text-center">
      {{ new Date(char.created).toLocaleString() }}
    </td>
    <td class="text-center">
      {{ new Date(char.edited).toLocaleString() }}
    </td>
    <td class="text-center">
      <div class="root">
        <button
          class="planet-modal-btn"
          @click.prevent="
            store.getPlanetData();
            store.data.isModalOpen = true;
          "
        >
          {{ store.data.characterPlanetName }}
        </button>
        <PlanetsDataModal />
      </div>
    </td>
  </tr>
</template>
