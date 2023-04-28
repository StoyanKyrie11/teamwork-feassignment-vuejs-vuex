<template>
  <div>
    <v-combobox
      v-model="selectedPerson"
      :items="peopleList"
      label="Select a person"
    ></v-combobox>
    <button @click="getAllPeople">All</button>
    <div v-if="allPeopleList.length">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Created</th>
            <th>Edited</th>
            <th>Homeworld</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in allPeopleList" :key="person.name">
            <td>{{ person.name }}</td>
            <td>{{ person.height }}</td>
            <td>{{ person.mass }}</td>
            <td>{{ person.created }}</td>
            <td>{{ person.edited }}</td>
            <td>{{ person.homeworld }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import axios from "axios";
export default {
  setup() {
    const state = reactive({
      peopleList: [],
      allPeopleList: [],
      selectedPerson: null,
    });
    axios.get("https://swapi.dev/api/people/").then((response) => {
      state.peopleList = response.data.results.map((person) => ({
        name: person.name,
        height: person.height,
        mass: person.mass,
        created: person.created,
        edited: person.edited,
        homeworld: person.homeworld,
      }));
    });
    const getAllPeople = () => {
      axios.get("https://swapi.dev/api/people/").then((response) => {
        state.allPeopleList = response.data.results.map((person) => ({
          name: person.name,
          height: person.height,
          mass: person.mass,
          created: person.created,
          edited: person.edited,
          homeworld: person.homeworld,
        }));
      });
    };
    return {
      ...toRefs(state),
      getAllPeople,
    };
  },
};
</script>
