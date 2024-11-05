<template>
    <div class="horizon-filters-wrapper relative" v-if="props.filters">
        <div class="horizon-filters-icon" @click="isOpenFilter = !isOpenFilter">
            <FunnelIcon class="horizon-td-icon size-6 text-slate-500"/>
        </div>
        <div class="horizon-filters absolute bg-red-100 right-0 top-10 min-w-52 z-50" v-show="isOpenFilter">
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
    </div>

    <div class="horizon-filters-column relative">
        <div class="horizon-filters-icon" @click="isOpenColumn = !isOpenColumn">
            <ViewColumnsIcon class="horizon-td-icon size-6 text-slate-500"/>
        </div>

        <div class="horizon-filters absolute bg-red-100 right-0 top-10 min-w-52 z-50" v-show="isOpenColumn">
            <template v-for="columnFilter in props.filters.find(filter => filter.type === 'column').columns ">
                <label>
                    <input type="checkbox" v-model="activeFilters.column[columnFilter]">
                    {{ columnFilter }}
                </label>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { FunnelIcon, ViewColumnsIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  filters: Array,
  activeFilters: Object
})

const isOpenFilter = ref(false)
const isOpenColumn = ref(false)

const emit = defineEmits(['reset-filters'])

const resetFilters = () => {
  emit('reset-filters')
}
</script>