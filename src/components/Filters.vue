<template>
    <div class="horizon-filters">
        <template v-for="filter in props.filters" :key="filter.label">
            <div class="horizon-filter-checkbox" v-if="filter.type === 'checkbox'">
                <label>
                    <input type="checkbox" v-model="activeFilters.checkbox[filter.column]" :value="filter.value">
                    {{ filter.label }}
                </label>
            </div>

            <div class="horizon-filter-select" v-if="filter.type === 'select'">
                <label>{{ filter.label }}</label>
                <select v-model="activeFilters.select[filter.column]">
                    <option value="">All</option>
                    <option v-for="option in filter.options" :key="option" :value="option">{{ option }}</option>
                </select>
            </div>
        </template>

        <button @click="resetFilters">Reset Filters</button>
    </div>
</template>

<script setup>
const props = defineProps({
  filters: Array,
  activeFilters: Object
})

const emit = defineEmits(['reset-filters'])

const resetFilters = () => {
  emit('reset-filters')
}
</script>