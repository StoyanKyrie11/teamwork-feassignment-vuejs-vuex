<template>
  <v-container style="height: 500px" fluid>
    <img
      src="../assets/StarWarsLogo.jpeg"
      cover
      width="150"
      alt="star-wars-icon"
    />
    <v-combobox
      color="success"
      bg-color="white"
      v-model="data.selectedName"
      :items="data.names"
      label="Choose a character"
    ></v-combobox>
    <!-- <v-progress-circular
      color="grey-lighten-4"
      indeterminate
    ></v-progress-circular> -->
    <v-table>
      <thead>
        <!-- Rewrite this using a v-for -->
        <tr>
          <th class="text-center">{{ data.headers[0].text }}</th>
          <th class="text-center">{{ data.headers[1].text }}</th>
          <th class="text-center">{{ data.headers[2].text }}</th>
          <th class="text-center">{{ data.headers[3].text }}</th>
          <th class="text-center">{{ data.headers[4].text }}</th>
          <th class="text-center">{{ data.headers[5].text }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="char in data.peopleData" :key="char.name">
          <td class="text-center">{{ char.name }}</td>
          <td class="text-center">{{ char.height }}</td>
          <td class="text-center">{{ char.mass }}</td>
          <td class="text-center">
            {{ char.created.substring(0, 10).replaceAll("-", "/") }}
          </td>
          <td class="text-center">
            {{ char.edited.substring(0, 10).replaceAll("-", "/") }}
          </td>
          <td class="text-center">
            <a
              href="#"
              target="_blank"
              alt="home-planet"
              src="${char.homeworld}"
              >Get some planet data</a
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { reactive, watch, onMounted } from "vue";

const data = reactive({
  selectedName: "",
  names: [],
  peopleData: [],
  headers: [
    { text: "Name", value: "name" },
    { text: "Height", value: "height" },
    { text: "Mass", value: "mass" },
    { text: "Created", value: "created" },
    { text: "Edited", value: "edited" },
    { text: "Homeworld", value: "homeworld" },
  ],
});

const getPeopleData = () => {
  axios
    .get(`https://swapi.dev/api/people/?search=${data.selectedName}`)
    .then((response) => {
      data.peopleData = response.data.results.map((person) => {
        return {
          name: person.name,
          height: person.height,
          mass: person.mass,
          created: person.created,
          edited: person.edited,
          homeworld: person.homeworld,
        };
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(
  () => data.selectedName,
  () => {
    getPeopleData();
  }
);

onMounted(() => {
  axios
    .get("https://swapi.dev/api/people/")
    .then((response) => {
      data.names = response.data.results.map((person) => person.name);
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>
