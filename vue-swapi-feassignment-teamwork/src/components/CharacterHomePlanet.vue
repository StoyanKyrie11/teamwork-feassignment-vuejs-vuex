<template>
  <div>
    <h1>{{ characterName }}</h1>
    <div>Name: {{ planet.name }}</div>
    <div>Diameter: {{ planet.diameter }}</div>
    <div>Climate: {{ planet.climate }}</div>
    <div>Population: {{ planet.population }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "CharacterHomePlanet",
  setup(props) {
    const planet = ref(null);
    const characterName = ref("");

    onMounted(async () => {
      const response = await axios.get(
        `https://swapi.dev/api/people/${props.params.id}/`
      );
      const planetResponse = await axios.get(response.data.homeworld);

      planet.value = {
        name: planetResponse.data.name,
        diameter: planetResponse.data.diameter,
        climate: planetResponse.data.climate,
        population: planetResponse.data.population,
      };
      characterName.value = response.data.name;
    });

    return {
      planet,
      characterName,
    };
  },
};
</script>
