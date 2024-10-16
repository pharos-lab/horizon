<template>
    <ChevronDownIcon v-if="isAscending" class="size-4" />
    <ChevronUpIcon v-if="isDescending" class="size-4" />
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
  import { getKeyFromLabel } from './utils.js'
  
  const props = defineProps({
    label: String,
    sortableData: Object,
    tableProps: Object // Ajout des props de la table pour utiliser `getKeyFromLabel`
  });
  
  // On récupère la clé associée au label
  const columnKey = computed(() => {
    return getKeyFromLabel(props.label, props.tableProps);
  });
  
  // Calcul si le tri est ascendant ou descendant
  const isAscending = computed(() => {
    return props.sortableData[columnKey.value] === 'asc' || props.sortableData[columnKey.value] === null;
  });
  
  const isDescending = computed(() => {
    return props.sortableData[columnKey.value] === 'desc';
  });
  </script>
  