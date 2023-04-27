<script setup></script>
<template>
  <div class="vue-modal">
    <div class="vue-modal-inner">
      <div class="vue-modal-content">
        <slot />
        <button type="button" @click="$emits('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
