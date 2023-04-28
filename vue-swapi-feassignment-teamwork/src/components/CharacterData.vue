<template>
  <v-container style="height: 500px" fluid>
    <v-row
      cols="12"
      class="center header-text"
      style="display: flex; justify-content: center"
    >
      <img
        src="../assets/StarWarsLogo.jpeg"
        cover
        width="150"
        alt="star-wars-icon"
      />
    </v-row>

    <v-autocomplete
      @change="store.getCharacterData()"
      v-model="store.data.selectedName"
      :items="store.data.characterNames"
      color="info"
      bg-color="white"
      hide-no-data
      clearable
      label="Search a character you must"
    />
    <v-progress-circular
      v-if="store.data.isLoading"
      size="40"
      bg-color="white"
      indeterminate
      style="position: absolute; top: 50%; left: 50%"
    ></v-progress-circular>
    <v-table v-else="store.data.isLoading">
      <thead>
        <tr>
          <th class="text-center" @click="store.columnSorting('name')">
            {{ store.data.headers[0].text }}
          </th>
          <th class="text-center" @click="store.columnSorting('height')">
            {{ store.data.headers[1].text }}
          </th>
          <th class="text-center" @click="store.columnSorting('mass')">
            {{ store.data.headers[2].text }}
          </th>
          <th class="text-center" @click="store.columnSorting('created')">
            {{ store.data.headers[3].text }}
          </th>
          <th class="text-center" @click="store.columnSorting('edited')">
            {{ store.data.headers[4].text }}
          </th>
          <th class="text-center" @click="store.columnSorting('homeworld')">
            {{ store.data.headers[5].text }}
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- Write into a separate component -->
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
                  >
                    <template #header>
                      <h3>custom header</h3>
                    </template>
                  </planets-data-modal-content>
                </div>
              </Teleport>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
<script setup>
import axios from "axios";
import { reactive, watch, onMounted, computed, inject } from "vue";
import { CHARACTER_PEOPLE_URL } from "../constants/constants.js";

import PlanetsDataModalContent from "./PlanetsDataModalContent.vue";

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
    console.log("Erro: ", error);
  }
});
</script>
<style lang="scss" scoped>
.modal {
  display: flex;
}
.modal-btn {
  align-self: flex-start;
}
</style>
