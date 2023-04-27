<script setup>
import { reactive } from "vue";

const dataState = reactive({
  headers: [
    {
      title: "Dessert (100g serving)",
      align: "start",
      sortable: false,
      key: "name",
    },
    { title: "Calories", align: "end", key: "calories" },
    { title: "Fat (g)", align: "end", key: "fat" },
    { title: "Carbs (g)", align: "end", key: "carbs" },
    { title: "Protein (g)", align: "end", key: "protein" },
    { title: "Iron (%)", align: "end", key: "iron" },
  ],
  desserts: [
    {
      name: "Frozen Yogurt",
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      iron: "1",
    },
    {
      name: "Jelly bean",
      calories: 375,
      fat: 0.0,
      carbs: 94,
      protein: 0.0,
      iron: "0",
    },
    {
      name: "KitKat",
      calories: 518,
      fat: 26.0,
      carbs: 65,
      protein: 7,
      iron: "6",
    },
    {
      name: "Eclair",
      calories: 262,
      fat: 16.0,
      carbs: 23,
      protein: 6.0,
      iron: "7",
    },
    {
      name: "Gingerbread",
      calories: 356,
      fat: 16.0,
      carbs: 49,
      protein: 3.9,
      iron: "16",
    },
    {
      name: "Ice cream sandwich",
      calories: 237,
      fat: 9.0,
      carbs: 37,
      protein: 4.3,
      iron: "1",
    },
  ],
});
</script>
<template>
  <v-table theme="dark">
    <thead>
      <tr>
        <th class="text-center">Name</th>
        <th class="text-center">Calories</th>
        <th class="text-center">Fat</th>
        <th class="text-center">Carbs</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in dataState.desserts"
        :key="item.name"
        class="text-center"
      >
        <td>{{ item.name }}</td>
        <td>{{ item.calories }}</td>
        <td>{{ item.fat }}</td>
        <td>{{ item.carbs }}</td>
      </tr>
      <v-row>
        <v-col cols="10" class="center header-text">
          <br />
          Browse Star Wars Characters!
        </v-col>
        <br /><br />
      </v-row>
      <v-row>
        <v-col cols="10" class="center">
          <v-autocomplete
            @change="callback()"
            v-model="selectedCharName"
            :items="characters"
            item-text=".name"
            filled
            dark
            label="Search or select character"
            hide-no-data
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </tbody>
  </v-table>
</template>

<style lang="scss" scoped></style>
