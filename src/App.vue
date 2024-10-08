<template>
  <h1>test table</h1>

  <div class="p-8">

    <Table :data="data" :labels="labels"></Table>
  </div>
</template>

<script setup>
import Table from './components/Table.vue';

const data = [
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    active: true
  },
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    active: true
  },
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    active: true
  },
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    active: true
  },
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    active: true
  },
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    active: true
  },
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    active: true
  }
]

const labels = ['Prénom', 'Nom', 'Age', 'Actif']
</script>



<style scoped>

</style>
