<template>
  <h1>test table</h1>

  <div class="p-8">

    <Table :data="data" :labels="labels" :sortable="['name', 'active']" :search="['name', 'age']" :filters="filters" :columnTypes="columnTypes" @select-change="event => console.log(event)"></Table>
  </div>
</template>

<script setup>
import Table from './components/Table.vue';

const data = [
  {
    name: 'mth',
    lastName: 'dht',
    age: '24',
    imgS: '/pathok/to/img.png', 
    active: true,
    status: 'success'
  },
  {
    name: 'mickey',
    lastName: 'edjdkje',
    age: '35',
    imgS: '/path/to/img.png', 
    active: false,
    status: 'fail'
  },
  {
    name: 'eruiruei',
    lastName: 'vbdfvkdkm',
    age: 35,
    imgS: '/path/to/img.png', 
    active: false,
    status: 'success'
  },
  {
    name: 'paozaka',
    lastName: 'kkqsjazi',
    age: 35,
    imgS: '/path/to/img.png', 
    active: true,
    status: 'pending'
  },
  {
    name: 'lsdklz',
    lastName: 'azlieo',
    age: 35,
    imgS: '/path/to/img.png', 
    active: false,
    status: 'fail'
  },
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    imgS: '/path/to/img.png', 
    active: true,
    status: 'success'
  },
  {
    name: 'mth',
    lastName: 'dht',
    age: 35,
    imgS: '/path/to/img.png', 
    active: true,
    status: 'success'
  }
]

const labels = ['Prénom', 'Nom', 'Age', 'avatar', 'Actif', 'status']

const filters= [
  {
    type: 'checkbox',
    label: 'actif', // Nom du filtre
    column: 'active', // Colonne à filtrer
    value: true // Valeur à filtrer
  },
  {
    type: 'select',
    label: 'Age',
    column: 'age',
    options: [24, 35] // Options possibles pour le select
  }
]

const columnTypes = [
  {
    column: 'active',
    type: 'icon',
    icons: {
      true: 'CheckCircle',
      false: 'XCircle'
    },
    colors: {
      true: 'text-emerald-500',
      false: 'text-red-500'
    }
  },
  {
    column: 'imgS',
    type: 'image',
    basePath: '/uploads/',
    size: {
      width: '100px',
      height: '50px',
      ratio: '16/9'
    },
    shape: 'circle'
  },
  {
    column: 'name',
    colors: 'text-sky-500'
  },
  {
    column: 'status', 
    type: 'select',  
    options: [       
        { value: 'success', label: 'Success' },
        { value: 'fail', label: 'Fail' },
        { value: 'pending', label: 'Pending' }
    ]
}
]
</script>



<style scoped>

</style>
