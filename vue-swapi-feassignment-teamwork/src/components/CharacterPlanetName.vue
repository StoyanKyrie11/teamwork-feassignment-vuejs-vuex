<template>
  <div>
    <v-container>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Planet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in people" :key="person.name">
            <td>{{ person.name }}</td>
            <td>{{ person.planet }}</td>
          </tr>
        </tbody>
      </table>
      <v-pagination
        v-model="page"
        :length="numPages"
        @input="getPeopleData"
      ></v-pagination>
    </v-container>
  </div>
</template>

<script setup>
import axios from "axios";
import { watch, ref, reactive, onMounted } from "vue";

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
          planet: planetResponse.data.name,
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
