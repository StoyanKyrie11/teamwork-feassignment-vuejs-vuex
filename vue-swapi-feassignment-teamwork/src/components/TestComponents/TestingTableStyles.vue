<script setup>
const headers = [
  {
    text: "Name",
    value: "name",
  },
  {
    text: "Email",
    value: "email",
  },
  {
    text: "Age",
    value: "age",
  },
];
const items = [
  { name: "John", email: "john@example.com", age: 30 },
  { name: "Jane", email: "jane@example.com", age: 25 },
  { name: "Bob", email: "bob@example.com", age: 40 },
];
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :rows-per-page-items="[5, 10, 20]"
    hide-default-footer
    class="cool-table"
  >
    <template #header="{ props }">
      <tr>
        <th
          v-for="(header, index) in props.headers"
          :key="index"
          :class="{ 'cool-header': index % 2 === 0 }"
        >
          {{ header.text }}
        </th>
      </tr>
    </template>
  </v-data-table>
</template>

<style lang="scss">
.cool-table {
  tr {
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.1);
      background-color: #ffe81f;
      color: #000;
    }
  }
  .cool-header {
    background-color: #000;
    color: #ffe81f;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #ffe81f;
      color: #000;
    }
  }
}
</style>
