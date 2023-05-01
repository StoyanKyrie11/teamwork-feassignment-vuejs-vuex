<template>
  <v-switch v-model="darkTheme" label="Dark mode"></v-switch>
  <v-container :class="themeClasses" style="height: 100vh; max-width: 100vw">
    <!-- Your app content goes here -->
  </v-container>
</template>
<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const darkTheme = ref(false);

    const themeClasses = computed(() => {
      return {
        "theme--light": !darkTheme.value,
        "theme--dark": darkTheme.value,
      };
    });

    return { darkTheme, themeClasses };
  },
};
</script>
<style lang="scss" scoped>
$theme-dark-background: #121212;
$theme-dark-text: #f5f5f5;
$theme-light-background: #f5f5f5;
$theme-light-text: #121212;

.theme--light {
  background-color: $theme-light-background;
  color: $theme-light-text;
}

.theme--dark {
  background-color: $theme-dark-background;
  color: $theme-dark-text;
}
</style>
