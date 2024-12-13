<template>
    <div class="horizon-filters-wrapper relative" v-if="props.filters">
        <div class="horizon-filters-icon cursor-pointer" @click="isOpenFilter = !isOpenFilter">
            <component :is="Heroicons[horizon.options.filters.icon + 'Icon']" class="horizon-td-icon size-6 text-slate-500"/>
        </div>
        <div class="horizon-filters absolute right-0 top-10 min-w-52 z-50 p-4 bg-white shadow" v-show="isOpenFilter">
            <h3 class="font-semibold mb-4">Filters</h3>
            <template v-for="filter in props.filters" :key="filter.label">
                <div class="horizon-filter-checkbox mb-4" v-if="filter.type === 'checkbox'">
                    <label class="flex gap-4">
                        <input type="checkbox" v-model="activeFilters.checkbox[filter.column]" :value="filter.value">
                        {{ filter.label }}
                    </label>
                </div>

                <div class="horizon-filter-select mb-4" v-if="filter.type === 'select'">
                    <label class="mr-4">{{ filter.label }}</label>
                    <select v-model="activeFilters.select[filter.column]" class="border p-1">
                        <option value="">All</option>
                        <option v-for="option in filter.options" :key="option" :value="option">{{ option }}</option>
                    </select>
                </div>
            </template>

            <button @click="resetFilters" class="rounded bg-slate-300 py-2 px-3">Reset Filters</button>
        </div>
    </div>

    <div class="horizon-filters-column relative">
        <div class="horizon-filters-icon cursor-pointer" @click="isOpenColumn = !isOpenColumn">
            <component :is="Heroicons['ViewColumnsIcon']" class="horizon-td-icon size-6 text-slate-500"/>
        </div>

        <div class="horizon-filters absolute right-0 top-10 min-w-52 z-50 p-4 bg-white shadow flex flex-col gap-4" v-show="isOpenColumn">
            <h3 class="font-semibold mb-4">Columns visibility</h3>
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
import { ref, inject } from 'vue';
import * as Heroicons  from '@heroicons/vue/24/solid';

const props = defineProps({
  filters: Array,
  activeFilters: Object
})

const horizon = inject('horizon')

const isOpenFilter = ref(false)
const isOpenColumn = ref(false)

const emit = defineEmits(['reset-filters'])

const resetFilters = () => {
  emit('reset-filters')
}
</script>