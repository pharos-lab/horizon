<template>
    <div class="active-filters mb-4">
        <template v-for="(value, key) in activeFilters.select">
            <span v-if="value" :key="key" class="badge">
                {{ getFilterLabel(key) }} {{ value }}
                <button @click="clearSelectFilter(key)">x</button>
            </span>
        </template>
        
        <template v-for="(value, key) in activeFilters.checkbox">
            <span v-if="value" :key="key" class="badge">
                {{ getFilterLabel(key) }}
                <button @click="clearCheckboxFilter(key)">x</button>
            </span>
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
  activeFilters: Object,
  filters: Array
})

const emit = defineEmits(['clear-select-filter', 'clear-checkbox-filter'])

const clearSelectFilter = (key) => emit('clear-select-filter', key)
const clearCheckboxFilter = (key) => emit('clear-checkbox-filter', key)

const getFilterLabel = (column) => {
  const filter = props.filters.find(f => f.column === column);
  return filter ? filter.label : column;
}
</script>