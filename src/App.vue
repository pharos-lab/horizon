<template>
  <h1>test table</h1>

  <div class="p-8">

    <Table :data="data" :labels="labels" :sortable="['name', 'active']" :search="['name', 'age']"></Table>
  </div>
</template>

<script setup>
import Table from './components/Table.vue';

const data = [
  {
    name: 'mth',
    lastName: 'dht',
    age: '24',
    active: true
  },
  {
    name: 'mickey',
    lastName: 'edjdkje',
    age: 35,
    active: false
  },
  {
    name: 'eruiruei',
    lastName: 'vbdfvkdkm',
    age: 35,
    active: false
  },
  {
    name: 'paozaka',
    lastName: 'kkqsjazi',
    age: 35,
    active: true
  },
  {
    name: 'lsdklz',
    lastName: 'azlieo',
    age: 35,
    active: false
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
