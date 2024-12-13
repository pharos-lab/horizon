<template>
    <div class="horizon-table-wrapper">
        <div class="horizon-options">
            <div class="flex justify-end items-center gap-4">
                <div class="horizon-search relative" v-if="search">
                    <component :is="Heroicons['MagnifyingGlassIcon']" class="horizon-search-icon size-5 absolute top-[7px] left-2 text-slate-400"/>
                    <input type="text" v-model="searchTerm"  class="horizon-search border py-1 pl-9 rounded" placeholder="Search">
                </div>
                
                <Filters :filters="props.filters" :activeFilters="activeFilters" @reset-filters="resetFilters"/>
            </div>


            <Badges :filters="props.filters" :activeFilters="activeFilters" @clear-select-filter="clearSelectFilter" @clear-checkbox-filter="clearCheckboxFilter"/>
        </div>

        <p v-if="props.data.length === 0">no data available</p>
        <table v-else class="horizon-table w-full">
            <thead class="horizon-thead">
                <tr class="horizon-tr" :class="[horizon.getHeaderClass()]">
                    <template v-for="(label, indexLabel) in (labels || Object.keys(props.data[0]))" :key="indexLabel">
                        <th
                            class="horizon-th text-left"
                            :class="[{'cursor-pointer': hasSort(label)}, horizon.getHeaderCellPadding()]"
                            @click="sortLabel(label)"
                            v-if="activeFilters.column[Utils.getKeyFromLabel(label, props)] !== false"
                            >
                            <div class="flex gap-2 items-center" >
                                {{ label }}
                                <SortIcon :label="label" :sortableData="sortableData" :tableProps="props" />
                            </div>
                        </th>
                    </template>

                    <th v-if="props.actions">{{  props.actions?.label }}</th>
                </tr>
            </thead>

            <tbody class="horizon-tbody">
                <tr class="horizon-tr" v-for="(row, indexRow) in sortedData" :key="indexRow" :class="horizon.getRowClass()">
                    <template v-for="(item, indexItem) in row">
                        <td is="vue:TableCell"  v-if="activeFilters.column[indexItem] !== false"
                        :key="indexItem" 
                        :row="row" 
                        :item="item" 
                        :indexItem="indexItem" 
                        :tableProps="props"
                        @change="handleChange"
                        ></td>
                    </template>

                    <td class="horizon-td border-y" v-if="props.actions.items">
                        <div class="flex gap-2">
                            <template v-if="props.actions.group">
                                <DropdownAction :actions="props.actions" :row="row" @action="event => handleAction(event)"></DropdownAction>
                            </template>

                            <template v-else>
                                <ActionButton 
                                :action="action" 
                                :row="row" v-for="action in props.actions.items" 
                                :key="action.event"
                                @action="event => handleAction(event)"
                                ></ActionButton>
                            </template>
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
import { inject } from 'vue'
import * as Heroicons  from '@heroicons/vue/24/outline'

import Filters from './Filters.vue'
import Badges from './Badges.vue'
import SortIcon from './SortIcon.vue'
import ActionButton from './ActionButton.vue';
import TableCell from './TableCell.vue';
import DropdownAction from './DropdownAction.vue';
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
        type: Object,
        default: () => {} 
    },
    columnFilters: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['action', 'selectChange', 'checkboxChange', 'toggleChange'])

const { activeFilters, filteredData, resetFilters, clearSelectFilter, clearCheckboxFilter } = useTableFilters(props);
const { searchTerm, searchedData } = useTableSearch(props, filteredData);
const { sortedData, sortableData, sortLabel, hasSort } = useTableSorting(props, searchedData);
const { modal, handleAction, confirmAction, closeModal } = useTableModal(emit);

const handleChange = event => {
    emit(event.eventName, event.eventData)
}

const horizon = inject('horizon')

</script>

<style scoped>
</style>