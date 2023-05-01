<template>
  <v-container>
    <v-row cols="12">
      <ImageComponent />
      <!-- <ThemeSwitchComponent /> -->
    </v-row>
    <v-text-field
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
    <table>
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
                @click.prevent="
                  store.getPlanetData();
                  store.data.isModalOpen = true;
                "
              >
                {{ person.homeworld }}
              </button>
              <PlanetsDataModal />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

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
import PlanetsDataModal from "./Modal/PlanetsDataModal.vue";

const store = inject("store");

const page = ref(1);
const people = reactive([]);
const numPages = ref(1);

const getPeopleData = async () => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?page=${page.value}`
    );
    numPages.value = Math.ceil(response.data.count / 10);
    const peopleData = await Promise.all(
      response.data.results.map(async (person) => {
        const planetResponse = await axios.get(person.homeworld);
        return {
          name: person.name,
          height: person.height,
          mass: person.mass,
          created: person.created,
          edited: person.edited,
          homeworld: planetResponse.data.name,
        };
      })
    );
    people.length = 0;
    people.push(...peopleData);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getPeopleData();
});

watch(page, () => {
  getPeopleData();
});
</script>
