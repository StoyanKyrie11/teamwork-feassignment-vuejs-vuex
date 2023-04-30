import { watchEffect, ref, reactive, computed } from "vue";
import axios from "axios";
import _ from "lodash";
import {
  CHARACTER_PEOPLE_URL,
  CHARACTER_PAGES_URL,
  CHARACTER_PEOPLE_SEARCH_URL,
} from "../constants/constants.js";

const data = reactive({
  selectedName: "",
  selectedCharacter: null,
  characterPlanetName: "",
  characterData: [],
  characterNames: [],
  names: [],
  peopleData: [],
  homeworldData: {
    planetName: "",
    diameter: "",
    climate: "",
    population: "",
  },
  isLoading: false,
  isModalOpen: false,
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
  characterFilterData: [],
  sortBy: "asc",
  sortColumn: "name",
  searchTerm: "",
  currPage: 1,
  charPerPage: 10,
  totalDataPageCount: 0,
  people: [],
  filteredPeople: [],
  totalPeople: 0,
  totalPages: 0,
  totalPeopleCount: 0,
  startLoopCount: 2,
  changePage: 1,
  debounceTimeout: null,
});

const inputValue = ref("");
const character = ref(null);

// Debouncing - 2 seconds delay
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

const getPagesData = debounce(async (inputValue) => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?search=${inputValue}`
    );
    character.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
}, 2000);

const getCharacterData = async () => {
  try {
    /* const cacheKey = "peopleData";
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      data.peopleData = JSON.parse(cache);
      characters.value = data.peopleData[page.value - 1];
      return;
    }
    const allCharacters = []; */
    let dataResponse = await axios.get(CHARACTER_PAGES_URL + data.changePage);

    data.people = dataResponse.data.results.map((person) => ({
      name: person.name,
      height: person.height,
      mass: person.mass,
      created: person.created,
      edited: person.edited,
      homeworld: person.homeworld,
    }));

/*     data.totalPeople = dataResponse.data.count;
    data.totalDataPageCount = Math.ceil(
      dataResponse.data.count / dataResponse.data.results.length
    );
    data.totalPages = Math.ceil(data.totalPeople / 10);

    data.peopleData = [...data.peopleData, ...dataResponse.data.results]; */

    /* while (dataResponse.data.next) {
      allCharacters.push(...dataResponse.data.results);
      dataResponse = await axios.get(dataResponse.data.next);
    }

    allCharacters.push(dataResponse.data.results);
    characters.value = allCharacters[page.value - 1];
    localStorage.setItem(cacheKey, JSON.stringify(allCharacters));
    pageCount.value = allCharacters.length;

    localStorage.setItem("peopleData", JSON.stringify(data.peopleData)); */
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Debounced request
const debouncedSearch = () => {
  getPagesData(inputValue.value);
};

// Caching
const characters = ref([]);
const pageCount = ref(0);
const page = ref(1);
const cacheKey = "characters";

watchEffect(async () => {
  const cache = localStorage.getItem(cacheKey);
  if (cache) {
    const cachedData = JSON.parse(cache);
    characters.value = cachedData[page.value - 1];
    pageCount.value = cachedData.length;
  } else {
    const allCharacters = [];
    let response = await axios.get(
      `https://swapi.dev/api/people/?page=${page.value}`
    );

    while (response.data.next) {
      allCharacters.push(response.data.results);
      response = await axios.get(response.data.next);
    }

    allCharacters.push(response.data.results);
    characters.value = allCharacters[page.value - 1];
    localStorage.setItem(cacheKey, JSON.stringify(allCharacters));
    pageCount.value = allCharacters.length;
  }
});

const filteredPeople = computed(() => {
  return data.peopleData.filter((person) =>
    person.name.toLowerCase().includes(data.selectedName.toLowerCase())
  );
});

const getPlanetName = async (homeworld) => {
  try {
    const response = await axios.get(homeworld);
    return response.data.name;
  } catch (error) {
    console.log("Error: ", error);
    return "";
  }
};

const getPlanetData = async () => {
  try {
    const response = await axios.get(data.peopleData[0].homeworld);
    data.homeworldData = {
      planetName: response.data.name,
      diameter: response.data.diameter,
      climate: response.data.climate,
      population: response.data.population,
    };
  } catch (error) {
    console.log("Error: ", error);
  }
};

/* Pagination */
const handlePagination = computed(() => {
  const startPage = (data.currPage - 1) * data.charPerPage;
  const endPage = startPage + data.charPerPage;
  return data.peopleData.slice(startPage, endPage);
});

const getAllPages = computed(() => {
  return Math.ceil(data.characterData.length / data.charPerPage);
});

const changePage = (page) => {
  data.changePage = page;
  getCharacterData();
};

/* const nextPage = () => {
  data.currPage++;
};

const prevPage = () => {
  data.currPage--;
}; */

export default {
  data: data,
  handlePagination,
  getAllPages,
  debouncedSearch,
  getPagesData,
  filteredPeople,
  getCharacterData,
  getPlanetName,
  getPlanetData,
  changePage,
};
