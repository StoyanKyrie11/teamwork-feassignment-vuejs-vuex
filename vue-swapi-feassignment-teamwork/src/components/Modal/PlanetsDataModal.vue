<script setup>
import { inject } from "vue";
import PlanetsDataModalContent from "./PlanetsDataModalContent.vue";

const store = inject("store");
</script>

<template>
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
</template>
