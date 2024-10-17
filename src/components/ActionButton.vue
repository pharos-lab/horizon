<template>
    <button 
      @click="$emit('action', {action: action, row: row})"
      class="horizon-td-button flex gap-1 items-center px-2 py-1">
      <component :is="Heroicons[action.icon + 'Icon']" class="horizon-td-icon size-5" v-if="action.icon" :class="getColorFromAction(action, 'icon')"/>
      <span v-if="action.label" :class="getColorFromAction(action, 'label')">
        {{ action.label }}
      </span>
    </button>
  </template>
  
  <script setup>
  import * as Heroicons from '@heroicons/vue/24/outline'
  import { getColorFromAction } from './utils';

  const props = defineProps({
    action: Object,
    row: Object
  });
  </script>
  