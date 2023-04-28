import { reactive } from "vue";
import axios from "axios";
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
  characterFilterData: [],
  sortBy: "asc",
  sortColumn: "name",
  searchQueryParam: "",
});

const getUsers = async () => {
  try {
    let initRequest = await axios.get(CHARACTER_PEOPLE_URL);
    initRequest.data.results.forEach((person) =>
      data.characterFilterData.push({
        name: person.name,
        height: person.height,
        weight: person.weight,
        created: person.created,
        edited: person.edited,
        homeworld: person.homeworld,
      })
    );
    let pagesCount = initRequest.data.count;
    let dataPages = Math.ceil(pagesCount / 10);
    data.isLoading = true;
    for (let i = 2; i <= dataPages; i++) {
      const response = await axios.get(CHARACTER_PAGES_URL + i);
      response.data.results.forEach((result) => {
        data.characterData.push({
          name: result.name,
          height: result.height,
          weight: result.weight,
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
};

const getCharacterData = async () => {
  try {
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

    if (charDataResults.length > 0) {
      data.selectedCharacter = charDataResults[0];
      data.characterPlanetName = await getPlanetName(
        data.selectedCharacter.homeworld
      );
    } else {
      data.selectedCharacter = null;
      data.characterPlanetName = "";
    }
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

const columnSorting = (colName) => {
  if (data.sortColumn === colName) {
    data.sortBy = data.sortBy === "asc" ? "desc" : "asc";
  } else {
    data.sortBy = "asc";
    data.sortColumn = colName;
  }
};

export default {
  data: data,
  getUsers,
  getCharacterData,
  getPlanetName,
  getPlanetData,
  columnSorting,
};
