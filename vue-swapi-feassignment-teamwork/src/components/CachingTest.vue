<template>
  <v-container class="main-container" fluid>
    <v-row cols="12">
      <ImageComponent />
      <!-- <ThemeSwitchComponent /> -->
    </v-row>
    <v-responsive class="mx-auto">
      <v-text-field
        class="star-wars-text-field"
        v-model="search"
        @input="debouncedSearch"
        prepend-inner-icon="mdi-magnify"
        placeholder="ex: Luke Skywalker"
        maxlength="50"
        type="text"
        autofocus
        hide-no-data
        clearable
        color="orange"
        bg-color="white"
      />
    </v-responsive>
    <v-table class="star-wars-table">
      <thead>
        <TableHead />
      </thead>
      <tbody>
        <tr
          class="star-wars-table-body"
          v-for="person in people"
          :key="person.name"
        >
          <td class="text-center">{{ person.name }}</td>
          <td class="text-center">
            {{ person.height }}
          </td>
          <td class="text-center">{{ person.mass + " kg" }}</td>
          <td class="text-center">
            {{ new Date(person.created).toLocaleString() }}
          </td>
          <td class="text-center">
            {{ new Date(person.edited).toLocaleString() }}
          </td>
          <td class="text-center">
            <div class="root">
              <button
                class="planet-modal-btn"
                @click="
                  getPlanetData(person.homeworld);
                  store.data.isModalOpen = true;
                "
              >
                {{ person.planetName }}
              </button>
              <Teleport to="body">
                <div class="modal" v-if="store.data.isModalOpen">
                  <planets-data-modal-content
                    @close="store.data.isModalOpen = false"
                    :show="store.data.isModalOpen"
                    :planetName="data.homeworldData.planetName"
                    :diameter="data.homeworldData.diameter"
                    :climate="data.homeworldData.climate"
                    :population="data.homeworldData.population"
                  />
                </div>
              </Teleport>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-pagination
      v-model="page"
      :length="numPages"
      @input="getPeopleData"
      :total-visible="5"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      class="pagination-main"
      density="comfortable"
      show-first-last-page
    ></v-pagination>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { watch, ref, reactive, inject, onMounted } from "vue";
import TableHead from "./Table/TableHead.vue";
import PlanetsDataModalContent from "../components/Modal/PlanetsDataModalContent.vue";
import ImageComponent from "../components/ImageComponent/ImageComponent.vue";
import { CHARACTER_PAGES_URL } from "../constants/constants.js";

const store = inject("store");

const page = ref(1);
const people = reactive([]);
const numPages = ref(1);
const search = ref("");
const data = reactive({
  homeworldData: { planetName: "", diameter: "", climate: "", population: "" },
  planetUrl: [],
});

// Debounce util - 2 seconds delay
const debounce = (fn, timeout) => {
  let timeOutId;
  return (...args) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
};

const getPeopleData = debounce(async () => {
  try {
    let cachedData = JSON.parse(
      localStorage.getItem(`${page.value}:${search.value}`)
    );
    if (cachedData) {
      // Use cached data if existing
      numPages.value = cachedData.numPages;
      people.length = 0;
      people.push(...cachedData.peopleData);
    } else {
      const response = await axios.get(
        CHARACTER_PAGES_URL + `${page.value}&search=${search.value}`
      );
      numPages.value = Math.ceil(response.data.count / 10);
      const peopleData = await Promise.all(
        response.data.results.map(async (person, index) => {
          // Extract planet urls from people data
          data.planetUrl.push(response.data.results[index].homeworld);
          const cachedPlanetData = JSON.parse(
            localStorage.getItem(person.homeworld)
          );
          if (cachedPlanetData) {
            // Use cached planet data if existing
            return {
              name: person.name,
              height: person.height,
              mass: person.mass,
              created: person.created,
              edited: person.edited,
              homeworld: person.homeworld,
              planetName: cachedPlanetData.planetName,
              climate: cachedPlanetData.climate,
              population: cachedPlanetData.population,
              diameter: cachedPlanetData.diameter,
            };
          } else {
            // Make an API call to get the planet data
            const planetResponse = await axios.get(person.homeworld);
            const planetData = {
              planetName: planetResponse.data.name,
              diameter: planetResponse.data.diameter,
              climate: planetResponse.data.climate,
              population: planetResponse.data.population,
            };
            localStorage.setItem(person.homeworld, JSON.stringify(planetData));
            return {
              name: person.name,
              height: person.height,
              mass: person.mass,
              created: person.created,
              edited: person.edited,
              homeworld: person.homeworld,
              planetName: planetData.planetName,
              climate: planetData.climate,
              population: planetData.population,
              diameter: planetData.diameter,
            };
          }
        })
      );
      people.length = 0;
      people.push(...peopleData);
      localStorage.setItem(
        `${page.value}:${search.value}`,
        JSON.stringify({
          numPages: numPages.value,
          peopleData: peopleData,
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
}, 2000);

const debouncedSearch = () => {
  getPeopleData();
};

onMounted(() => {
  getPeopleData();
});

watch([page, search], () => {
  getPeopleData();
});
</script>

<style lang="scss" scoped></style>
