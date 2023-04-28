const filterCharacters = computed(() => {
  let filterCharacterData = store.data.peopleData.filter((character) => {
    character.name.toLowerCase().includes(data.searchQueryParam.toLowerCase());
  });
  if (store.data.sortBy === "asc") {
    /* ASC sorting */
    filterCharacterData.sort((j, k) =>
      j[store.data.sortColumn] > k[store.data.sortColumn] ? 1 : -1
    );
  } else {
    /* DESC sorting */
    filterCharacterData.sort((j, k) =>
      j[store.data.sortColumn] < k[store.data.sortColumn] ? 1 : -1
    );
  }
  return filterCharacterData;
});
