<template>
  <v-data-table :items="items" :headers="headers">
    <template v-slot:header.name>
      <span>Name (first, last)</span>
    </template>
    <template v-slot:header.email>
      <span>Email Address</span>
    </template>
    <template v-slot:header.age>
      <span>Age (in years)</span>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { name: "John Doe", email: "john@example.com", age: 30 },
        { name: "Jane Smith", email: "jane@example.com", age: 25 },
        { name: "Bob Johnson", email: "bob@example.com", age: 40 },
      ],
    };
  },
};
</script>
