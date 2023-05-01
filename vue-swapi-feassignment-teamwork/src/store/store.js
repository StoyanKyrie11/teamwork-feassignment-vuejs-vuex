import { watch, ref, reactive, computed } from "vue";
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

/* WORKING LOGIC HERE */
const PAGE_SIZE = 10;
const people = ref([]);
const totalPeople = ref(0);
const totalPages = ref(0);
const page = ref(1);

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

const getPeople = async (value) => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?page=${page.value}&search=${value}`
    );
    people.value = response.data.results.map((person) => ({
      name: person.name,
      height: person.height,
      mass: person.mass,
      created: person.created,
      edited: person.edited,
      homeworld: person.homeworld,
    }));
    totalPeople.value = response.data.count;
    totalPages.value = Math.ceil(totalPeople.value / PAGE_SIZE);
  } catch (error) {
    console.error(error);
  }
};

/* For testing of planet data extraction */
const numPages = ref(1);

const loadFirstBatch = async () => {
  try {
    const response = await axios.get(CHARACTER_PAGES_URL + `${search.value}`);
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
    console.log("Error: ", error);
    return "";
  }
};

const getPlanetName = async (planetUrl) => {
  try {
    const response = await axios.get(planetUrl);
    return response.data.name;
  } catch (error) {
    console.log(error);
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

const debouncedSearch = () => {
  loadFirstBatch();
};

const changePage = (page) => {
  data.changePage = page;
  getCharacterData();
};

watch(
  [people, page],
  () => {
    const start = (page.value - 1) * PAGE_SIZE;
    data.people = data.people.slice(start, start + PAGE_SIZE);
  },
  /* [
    selectedName,
    () => {
      loadFirstBatch();
    },
  ] */
);

const inputValue = ref("");
const character = ref(null);

const getPagesData = debounce(async (inputValue) => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?search=${inputValue}`
    );
  } catch (error) {
    console.error(error);
  }
}, 2000);

const getCharacterData = async () => {
  try {
    /* Work on the logic for displaying the planet modal tomorrow */
    const response = await axios.get(
      `${CHARACTER_PEOPLE_SEARCH_URL}${data.selectedName}`
    );
    const charDataResults = response.data.results.map((person) => {
      return {
        name: person.name,
        height: person.height,
        mass: person.mass,
        created: person.created,
        edited: person.edited,
        homeworld: person.homeworld,
      };
    });
    data.peopleData = charDataResults;
    console.log(data.peopleData);
    if (charDataResults.length > 0) {
      data.selectedCharacter = charDataResults[0];
      data.characterPlanetName = await getPlanetName(
        data.selectedCharacter.homeworld
      );
    } else {
      data.selectedCharacter = null;
      data.characterPlanetName = "";
    }

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

// Caching
/* const characters = ref([]);
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
}); */

const filteredPeople = computed(() => {
  return data.peopleData.filter((person) =>
    person.name.toLowerCase().includes(data.selectedName.toLowerCase())
  );
});

/* Pagination */
const handlePagination = computed(() => {
  const startPage = (data.currPage - 1) * data.charPerPage;
  const endPage = startPage + data.charPerPage;
  return data.peopleData.slice(startPage, endPage);
});

const getAllPages = computed(() => {
  return Math.ceil(data.characterData.length / data.charPerPage);
});

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
  filteredPeople,
  getPeople,
  getPagesData,
  // initPageLoadData,
  loadFirstBatch,
  // getCharacterData,
  getPlanetName,
  getPlanetData,
  changePage,
};
