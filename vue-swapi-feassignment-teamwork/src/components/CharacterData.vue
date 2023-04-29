<script setup>
import axios from "axios";
import { watch, onMounted, inject } from "vue";
import { CHARACTER_PEOPLE_URL } from "../constants/constants.js";

import CharacterTable from "../components/Table/CharacterTable.vue";

const store = inject("store");

watch(
  () => store.data.selectedName,
  () => {
    store.getCharacterData();
  }
);
onMounted(async () => {
  try {
    store.getUsers();
    const usersData = await axios.get(CHARACTER_PEOPLE_URL);
    store.data.names = usersData.data.results.map((person) => person.name);
  } catch (error) {
    console.log("Error: ", error);
  }
});
</script>

<template>
  <v-container style="height: 500px" fluid>
    <v-row
      cols="12"
      class="center header-text"
      style="display: flex; justify-content: center"
    >
      <v-img
        class="star-wars-svg"
        src="https://cdn.worldvectorlogo.com/logos/star-wars-4.svg"
        width="150"
        height="150"
        alt="star-wars-icon"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 15px 0;
        "
      />
    </v-row>

    <v-autocomplete
      class="star-wars-autocomplete"
      @change="store.getCharacterData()"
      v-model="store.data.selectedName"
      :items="store.data.characterNames"
      label="Search a character you must"
      color="info"
      bg-color="white"
      hide-no-data
      clearable
    />

    <v-progress-circular
      v-if="store.data.isLoading"
      size="40"
      bg-color="white"
      indeterminate
      style="position: absolute; top: 50%; left: 50%"
    ></v-progress-circular>
    <CharacterTable class="star-wars-table" v-else="store.data.isLoading" />

    <!-- TODO: Would love to discuss the v-data-table implementation! 
    Header values do NOT get populated in table as per 
    default behavior. :headers does not work! 
    Link to resource: https://vuetifyjs.com/en/components/data-tables/headers/ 
     -->
    <!-- <v-data-table
      v-else="!store.data.isLoading"
      :items-per-page="5"
      :headers="store.data.headers"
      :items="store.data.characterData"
      loading-text="Patient you must be, young padawan!"
      must-sort
      class="elevation-1"
    /> -->
  </v-container>
</template>
<style lang="scss" scoped>
.modal {
  display: flex;
}
.modal-btn {
  align-self: flex-start;
}

.star-wars-svg {
  transition: transform 0.5s ease-in-out;
  animation: pulse 2s infinite;
  &:hover {
    transform: scale(1.2);
  }
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(228, 204, 204, 0.678);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.star-wars-autocomplete {
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top: 75%;
    left: -50%;
    width: 200%;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent 0%,
      #ffe81f 25%,
      #ffe81f 75%,
      transparent 100%
    );
    animation: move 3s infinite;
  }
  &:focus-within {
    &:before {
      animation-play-state: paused;
    }
  }
  @keyframes move {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  @keyframes glow {
    0% {
      text-shadow: 0 0 10px #ffe81f;
    }
    50% {
      text-shadow: 0 0 15px #ffe81f;
    }
    100% {
      text-shadow: 0 0 10px #ffe81f;
    }
  }
}
</style>
