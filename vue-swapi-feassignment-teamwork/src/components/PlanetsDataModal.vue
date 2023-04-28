<script setup>
import { ref } from "vue";
import PlanetsDataModalContent from "./PlanetsDataModalContent.vue";
const isOpen = ref(false);
</script>
<template>
  <div class="root">
    <button @click="isOpen = true">Homeworld data</button>
    <teleport to="body">
      <div class="modal" v-if="isOpen">
        <planets-data-modal-content
          @close="isOpen = false"
          title="This is some title"
          content="This is some content"
        />
      </div>
    </teleport>
  </div>
</template>
<style lang="scss" scoped>
.root {
  position: relative;
}
.modal {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
  }
}
</style>
