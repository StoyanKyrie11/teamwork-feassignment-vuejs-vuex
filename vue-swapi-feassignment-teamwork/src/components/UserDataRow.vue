<script setup>
/* Import the data for the character name, height, weight, created, edited */
</script>
<template>
  <li class="li-sw-character">
    <div class="sw-character">
      <span>{{ character.name }}</span>
      <span>{{ characater.height }}</span>
      <span>{{ character.weight }}</span>
      <span>{{ character.created }}</span>
      <span>{{ character.edited }}</span>
    </div>
  </li>
</template>

<style lang="scss" scoped>
/* Add the styles for each character row in the table */
</style>
