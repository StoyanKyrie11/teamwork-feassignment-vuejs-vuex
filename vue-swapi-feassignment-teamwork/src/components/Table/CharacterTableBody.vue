<script setup>
import { inject } from "vue";
import PlanetsDataModal from "../Modal/PlanetsDataModal.vue";

const store = inject("store");
</script>

<template>
  <tr
    class="star-wars-table-body"
    v-for="char in store.data.peopleData"
    :key="char.name"
  >
    <td class="text-center">{{ char.name }}</td>
    <td class="text-center">{{ char.height + " cm" }}</td>
    <td class="text-center">
      {{ char.mass + " kg" }}
    </td>
    <td class="text-center">
      {{ char.created.substring(0, 10).replaceAll("-", "/") }}
    </td>
    <td class="text-center">
      {{ char.edited.substring(0, 10).replaceAll("-", "/") }}
    </td>
    <td class="text-center">
      <div class="root">
        <button
          style="text-decoration: underline"
          class="modal-btn"
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
