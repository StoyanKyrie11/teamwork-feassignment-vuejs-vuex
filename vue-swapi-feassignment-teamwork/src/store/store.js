import axios from "axios";
import { ref, reactive, computed, toRefs } from "vue";
import { CHARACTER_PAGES_URL } from "../constants/constants.js";

//TODO: Implement Global store approach of managing state
// TODO: Re-do the project using SFCs composition API and reusability of components
const page = ref(1);
const people = reactive([]);
const numPages = ref(1);
const search = ref("");
const data = reactive({
  homeworldData: { planetName: "", diameter: "", climate: "", population: "" },
  planetUrl: [],
  headers: [
    { text: "Name", value: "name" },
    { text: "Height", value: "height" },
    { text: "Mass", value: "mass" },
    { text: "Created", value: "created" },
    { text: "Edited", value: "edited" },
    { text: "Homeworld", value: "homeworld" },
  ],
  modalTableHeaders: [
    { text: "Planet name", value: "planet name" },
    { text: "Diameter", value: "diameter" },
    { text: "Climate", value: "climate" },
    { text: "Population", value: "population" },
  ],
});

const isModalOpen = ref(false);
const closeModal = () => {
  isModalOpen.value = false;
};

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
    const results = await Promise.all(promises);
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
}, 2000);

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

const debouncedSearch = () => {
  getPeopleData();
};

export default {
  data: data,
  isModalOpen: isModalOpen,
  numPages: numPages,
  page: page,
  people: people,
  search: search,
  changeTheme: changeTheme,
  getPeopleData,
  getPlanetData,
  closeModal,
  debouncedSearch,
};
