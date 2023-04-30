import { reactive, computed } from "vue";
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
  sortingKey: "",
  currPage: 1,
  charPerPage: 10,
  totalDataPageCount: 1,
  people: [],
  totalPeople: 0,
  totalPages: 0,
  totalPeopleCount: 0,
  startLoopCount: 2,
  changePage: 1,
});

/* const getPeople = async () => {
  try {
    let initRequest = await axios.get(CHARACTER_PEOPLE_URL);
    initRequest.data.results.forEach((person) =>
      data.characterFilterData.push({
        name: person.name,
        height: person.height,
        mass: person.mass,
        created: person.created,
        edited: person.edited,
        homeworld: person.homeworld,
      })
    );
    let pagesCount = initRequest.data.count;
    data.dataPages = Math.ceil(pagesCount / 10);

    data.isLoading = true;
    for (let i = 2; i <= dataPages; i++) {
      const response = await axios.get(CHARACTER_PAGES_URL + i);
      response.data.results.forEach((result) => {
        data.characterData.push({
          name: result.name,
          height: result.height,
          mass: result.mass,
          created: result.created,
          edited: result.edited,
          homeworld: result.homeworld,
        });
        data.characterNames.push(result.name);
      });
    }
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    data.isLoading = false;
  }
}; */

const getCharacterData = async () => {
  try {
    // const initRequest = await axios.get(CHARACTER_PEOPLE_URL);
    // data.totalPeopleCount = initRequest.data.count;
    // data.totalDataPageCount = Math.ceil(
    //   initRequest.data.count / initRequest.data.results.length
    // );
    // console.log(data.totalDataPageCount); // 9 pages
    // data.currPage = 1;

    //TODO: Proceed with fixing the pagination requests */
    const dataResponse = await axios.get(CHARACTER_PAGES_URL + data.changePage);
    data.people = dataResponse.data.results.map((person) => ({
      name: person.name,
      height: person.height,
      mass: person.mass,
      created: person.created,
      edited: person.edited,
      homeworld: person.homeworld,
    }));
    data.totalPeople = dataResponse.data.count;
    data.totalDataPageCount = Math.ceil(
      dataResponse.data.count / dataResponse.data.results.length
    );
    data.totalPages = Math.ceil(data.totalPeople / 10);

    data.peopleData = [...data.peopleData, ...dataResponse.data.results];
    // data.currPage = 1;

    // const response = await axios.get(
    //   `${CHARACTER_PEOPLE_SEARCH_URL}${data.selectedName}`
    // );
    // const charDataResults = response.data.results.map((person) => {
    //   return {
    //     name: person.name,
    //     height: person.height,
    //     mass: person.mass,
    //     created: person.created,
    //     edited: person.edited,
    //     homeworld: person.homeworld,
    //   };
    // });

    // data.peopleData = charDataResults;
    // console.log(charDataResults);
    // if (charDataResults.length > 0) {
    //   data.selectedCharacter = charDataResults[0];
    //   /* Fix the planet logic to display planets dynamically */
    //   data.characterPlanetName = await getPlanetName(
    //     data.selectedCharacter.homeworld
    //   );
    // } else {
    //   data.selectedCharacter = null;
    //   data.characterPlanetName = "";
    // }
  } catch (error) {
    console.log("Error: ", error);
  }
};

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

/* const columnSorting = (colName) => {
  if (data.sortingKey === colName) {
    data.sortDirection = data.sortDirection === "asc" ? "desc" : "asc";
  } else {
    data.sortingKey = colName;
    data.sortDirection = "asc";
  }

  data.characterData = _.orderBy(
    data.characterData,
    colName,
    data.sortDirection
  );
}; */

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
  // nextPage,
  // prevPage,
  // getPeople,
  getCharacterData,
  getPlanetName,
  getPlanetData,
  changePage,
  // columnSorting,
};
