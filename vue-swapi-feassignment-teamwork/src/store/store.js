import axios from "axios";
import { ref, reactive, computed, toRefs } from "vue";
import { CHARACTER_PAGES_URL } from "../constants/constants.js";

//TODO: Implement Global store approach of managing state -- Pinia
// TODO: Re-do the project using SFCs composition API and reusability of components

// TODO: Make the app mobile responsive
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

export default {
  data: data,
};
