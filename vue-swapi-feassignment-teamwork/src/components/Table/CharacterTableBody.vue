<script setup>
import { inject } from "vue";
import PlanetsDataModalContent from "../Modal/PlanetsDataModalContent.vue";

const store = inject("store");
</script>

<template>
  <tr v-for="char in store.data.peopleData" :key="char.name">
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
        <Teleport to="body">
          <div class="modal" v-if="store.data.isModalOpen">
            <planets-data-modal-content
              @close="store.data.isModalOpen = false"
              :show="store.data.isModalOpen"
              :planetName="store.data.homeworldData.planetName"
              :diameter="store.data.homeworldData.diameter"
              :climate="store.data.homeworldData.climate"
              :population="store.data.homeworldData.population"
            />
          </div>
        </Teleport>
      </div>
    </td>
  </tr>
</template>

<style lang="scss" scoped></style>
