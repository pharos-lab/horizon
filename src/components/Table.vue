<template>
    <div class="horizon-table-wrapper">
        <div class="horizon-options ">
            <input type="text" v-model="searchTerm" v-if="search" class="horizon-search border" placeholder="search...">

            <Filters :filters="props.filters" :activeFilters="activeFilters" @reset-filters="resetFilters"/>

            <Badges :filters="props.filters" :activeFilters="activeFilters" @clear-select-filter="clearSelectFilter" @clear-checkbox-filter="clearCheckboxFilter"/>
        </div>

        <p v-if="props.data.length === 0">no data available</p>
        <table v-else class="horizon-table w-full">
            <thead class="horizon-thead">
                <tr class="horizon-tr bg-slate-200">
                    <th 
                        v-for="(label, indexLabel) in (labels || Object.keys(props.data[0]))"
                        :key="indexLabel"
                        class="horizon-th text-left px-4 py-2"
                        :class="{'cursor-pointer': hasSort(label)}"
                        @click="sortLabel(label)"
                        >
                        <div class="flex gap-2 items-center">
                            {{ label }}
                            <SortIcon :label="label" :sortableData="sortableData" :tableProps="props" />
                        </div>
                    </th>

                    <th v-if="props.actions"></th>
                </tr>
            </thead>


            <tbody class="horizon-tbody">
                <tr class="horizon-tr divide-x" v-for="(row, indexRow) in sortedData" :key="indexRow">
                    <td class="horizon-td text-left px-4 py-2" 
                        v-for="(item, indexItem) in row" :key="indexItem"
                        :class="Utils.getColorFromColumn(indexItem, item, props)"
                        > 
                        <template v-if="Utils.getColumnType(indexItem, props) === 'icon'">
                            <component :is="Heroicons[Utils.getIconFromColumn(indexItem, item, props) + 'Icon']" class="horizon-td-icon size-5"/>
                        </template>

                        <template v-else-if="Utils.getColumnType(indexItem, props) === 'image'">
                            <img :src="Utils.getImageUrl(indexItem, item, props)" 
                                class="horizon-td-image size-5" 
                                :alt="item" 
                                :style="Utils.getImageSize(indexItem, props)" 
                                :class="Utils.getImageShape(indexItem, props)">
                        </template>

                        <template v-else-if="Utils.getColumnType(indexItem, props) === 'select'">
                            <select class="horizon-td-select" @change="event => $emit('selectChange', {row: row,[indexItem]: event.target.value})">
                                <option 
                                    v-for="option in Utils.getSelectOptions(indexItem, props)" 
                                    :key="option.value" 
                                    :value="option.value"
                                    :selected="option.value == item"
                                >
                                    {{ option.label }}
                                </option>
                            </select>
                        </template>

                        <template v-else-if="Utils.getColumnType(indexItem, props) === 'toggle'">
                            <label class="switch relative w-10 h-5 inline-block">
                                <input type="checkbox"
                                    class="opacity-0 w-0 h-0 peer"
                                    :checked="item === Utils.getToggleValues(indexItem, props).on"
                                    @change="event => $emit('toggleChange', {row: row, [indexItem]: event.target.checked ? Utils.getToggleValues(indexItem, props).on : Utils.getToggleValues(indexItem, props).off})">
                                <span class="slider round absolute cursor-pointer inset-0 bg-slate-300 transition-transform duration-500 rounded-full peer-checked:bg-sky-500"></span>
                            </label>
                        </template>

                        <template v-else-if="Utils.getColumnType(indexItem, props) === 'checkbox'">
                            <label class="relative">
                                <input type="checkbox"
                                    class=""
                                    :checked="item"
                                    @change="event => $emit('checkboxChange', {row: row, [indexItem]: event.target.checked })">
                            </label>
                        </template>
                        
                        <template v-else>
                            {{ item }}
                        </template>
                    </td>

                    <td class="horizon-td text-left px-4 py-2 " v-if="props.actions">
                        <div class="flex gap-3">
                            <ActionButton 
                                :action="action" 
                                :row="row" v-for="action in props.actions" 
                                :key="action.event"
                                @action="handleAction({action, row})"
                                ></ActionButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <Teleport to="body">
            <div v-if="modal.isOpen" class="horizon-table-modal absolute inset-0 bg-slate-300/70 flex items-center justify-center">
               
                    <div class="modal-content bg-white p-8 shadow rounded-md flex flex-col gap-8">
                        
                        <template v-if="modal.action">
                            <p class="flex justify-center">
                                <component :is="Heroicons[modal.action.icon + 'Icon']" class="horizon-td-icon size-12 p-3 border rounded-full" v-if="modal.action.icon"/>
                            </p>

                            <p v-if="modal.action.modalContent">
                                {{ modal.action.modalContent }}
                            </p>

                            <p v-else>
                                Are you sure you want to perform the <span class="capitalize">"{{ modal.action.label }}"</span> action?
                            </p>
                        </template>
                        <div class="flex justify-end gap-3 mt-5">
                            <button class="btn bg-slate-400 text-white px-4 py-2 rounded" @click="closeModal">Cancel</button>
                            <button class="btn bg-sky-500 text-white px-4 py-2 rounded" @click="confirmAction">Confirm</button>
                        </div>
                    </div>
          
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue';

import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { ChevronUpIcon } from '@heroicons/vue/24/solid'
import * as Heroicons  from '@heroicons/vue/24/outline'

import Filters from './Filters.vue'
import Badges from './Badges.vue'
import SortIcon from './SortIcon.vue'
import ActionButton from './ActionButton.vue';
import * as Utils  from './utils.js'
import { useTableSorting } from './composables/tableSorting.js';
import { useTableFilters } from './composables/tableFiltering.js';
import { useTableSearch } from './composables/tableSearching.js';
import { useTableModal } from './composables/tableModal.js';

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
        required: true
    },
    labels: {
        type: Array,
        default: null, 
    },
    sortable: {
        type: Array,
        default: () => [], 
    },
    search: {
        type: Array,
        default: () => [], 
    },
    filters: {
        type: Array,
        default: () => []
    },
    columnTypes: {
        type: Array,
        default: () => [] 
    },
    actions: {
        type: Array,
        default: () => [] 
    },
})

const emit = defineEmits(['action', 'selectChange', 'checkboxChange', 'toggleChange'])

const sortKey = ref(null)

const { activeFilters, filteredData, resetFilters, clearSelectFilter, clearCheckboxFilter } = useTableFilters(props);
const { searchTerm, searchedData } = useTableSearch(props, filteredData);
const { sortedData, sortableData, sortLabel, hasSort } = useTableSorting(props, searchedData);
const { modal, handleAction, confirmAction, closeModal } = useTableModal(emit);


</script>

<style scoped>

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider:before {
  transform: translateX(16px);
}

</style>