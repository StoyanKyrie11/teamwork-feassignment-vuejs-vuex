<template>
  <div id="page-wrapper" :class="changeTheme">
    <v-responsive class="main-container">
      <v-row>
        <v-col cols="8">
          <ImageComponent />
        </v-col>
      </v-row>
      <v-responsive>
        <v-text-field
          v-model="search"
          class="star-wars-text-field"
          prepend-inner-icon="mdi-magnify"
          placeholder="ex: Luke Skywalker"
          maxlength="50"
          type="text"
          autofocus
          hide-no-data
          clearable
          color="orange"
          bg-color="white"
          @input="debouncedSearch, setInitPage()"
        />
      </v-responsive>

      <v-divider />

      <LoadingStateComponent
        v-if="people.length === 0"
        class="loading-state-component"
      />

      <v-table v-else-if="people.length > 0" class="star-wars-table">
        <thead>
          <TableHead />
        </thead>
        <tbody>
          <tr
            v-for="person in people"
            :key="person.name"
            class="star-wars-table-body"
          >
            <td class="text-center">
              {{ person.name }}
            </td>
            <td class="text-center">
              {{ person.height }}
            </td>
            <td class="text-center">
              {{ person.mass + " kg" }}
            </td>
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
                    isModalOpen = true;
                  "
                >
                  {{ person.planetName }}
                </button>
                <Teleport to="body">
                  <div class="modal">
                    <planets-data-modal-content
                      :show="isModalOpen"
                      :planet-name="data.homeworldData.planetName"
                      :diameter="data.homeworldData.diameter"
                      :climate="data.homeworldData.climate"
                      :population="data.homeworldData.population"
                      @keydown.esc="closeModal"
                      @close="isModalOpen = false"
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
        :total-visible="5"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        class="pagination-main"
        density="comfortable"
        show-first-last-page
        rounded="circle"
        @input="getPeopleData"
      />
      <v-chip
        v-model="darkTheme"
        class="pagination-switcher"
        label="Dark Mode/Light Mode"
        color="orange-darken-3"
        value="orange-darken-3"
        hide-details
      />
    </v-responsive>
  </div>
</template>

<script setup>
import axios from "axios";
import { watch, ref, reactive, inject, onMounted, computed } from "vue";
import TableHead from "./Table/TableHead.vue";
import PlanetsDataModalContent from "../components/Modal/PlanetsDataModalContent.vue";
import ImageComponent from "../components/ImageComponent/ImageComponent.vue";
import { CHARACTER_PAGES_URL } from "../constants/constants.js";
import LoadingStateComponent from "./LoadingStateComponent/LoadingStateComponent.vue";

// Reactive variables
const page = ref(1);
const people = reactive([]);
const numPages = ref(1);
const search = ref("");
const data = reactive({
  homeworldData: { planetName: "", diameter: "", climate: "", population: "" },
  planetUrl: [],
});
const isModalOpen = ref(false);
function closeModal() {
  isModalOpen.value = false;
}
const isLoading = ref(false);

const darkTheme = ref(false);
const changeTheme = computed(() => {
  return {
    "theme--light": !darkTheme.value,
    "theme--dark": darkTheme.value,
  };
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
    isLoading.value = true;
    let response;
    const cacheKey = `peopleDataPage${page.value}Search${search.value}`;

    if (localStorage.getItem(cacheKey)) {
      response = JSON.parse(localStorage.getItem(cacheKey));
    } else {
      response = await axios.get(
        CHARACTER_PAGES_URL + `${page.value}&search=${search.value}`
      );
      localStorage.setItem(cacheKey, JSON.stringify(response));
    }

    numPages.value = Math.ceil(response.data.count / 10);
    const promises = response.data.results.map(async (person, index) => {
      try {
        const cacheKey = `planetData-${person.homeworld}`;
        let planetResponse;

        if (localStorage.getItem(cacheKey)) {
          planetResponse = JSON.parse(localStorage.getItem(cacheKey));
        } else {
          planetResponse = await axios.get(person.homeworld);
          localStorage.setItem(cacheKey, JSON.stringify(planetResponse));
        }

        return {
          name: person.name,
          height: person.height,
          mass: person.mass,
          created: person.created,
          edited: person.edited,
          homeworld: person.homeworld,
          planetName: planetResponse.data.name,
          climate: planetResponse.data.climate,
          population: planetResponse.data.population,
          diameter: planetResponse.data.diameter,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    });
    const results = await Promise.allSettled(promises);
    people.length = 0;
    people.push(
      ...results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)
    );
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}, 500);

const getPlanetData = async (planet) => {
  try {
    // Make an API call to get the planet data
    const response = await axios.get(planet);
    const planetData = {
      planetName: response.data.name,
      diameter: response.data.diameter,
      climate: response.data.climate,
      population: response.data.population,
    };
    data.homeworldData = planetData;
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Resetting to init page if field is emptied
const setInitPage = () => {
  if (!search.value) {
    page.value = 1;
    getPeopleData();
  }
};

// Init debounced people data search
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

:deep .v-pagination__item {
  box-shadow: none;
}
</style>
