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
                            <ChevronDownIcon v-if="hasSort(label) && (sortableData[getKeyFromLabel(label, props)] == 'asc' || sortableData[getKeyFromLabel(label, props)] == null)" 
                                class="size-4" />
                            <ChevronUpIcon v-if="hasSort(label) && (sortableData[getKeyFromLabel(label, props)] == 'desc')" 
                                class="size-4" />
                        </div>
                    </th>

                    <th v-if="props.actions"></th>
                </tr>
            </thead>


            <tbody class="horizon-tbody">
                <tr class="horizon-tr divide-x" v-for="(row, indexRow) in sortedData" :key="indexRow">
                    <td class="horizon-td text-left px-4 py-2" 
                        v-for="(item, indexItem) in row" :key="indexItem"
                        :class="getColorFromColumn(indexItem, item)"
                        > 
                        <template v-if="getColumnType(indexItem) === 'icon'">
                            <component :is="Heroicons[getIconFromColumn(indexItem, item) + 'Icon']" class="horizon-td-icon size-5"/>
                        </template>

                        <template v-else-if="getColumnType(indexItem) === 'image'">
                            <img :src="getImageUrl(indexItem, item)" 
                                class="horizon-td-image size-5" 
                                :alt="item" 
                                :style="getImageSize(indexItem)" 
                                :class="getImageShape(indexItem)">
                        </template>

                        <template v-else-if="getColumnType(indexItem) === 'select'">
                            <select class="horizon-td-select" @change="event => $emit('selectChange', {row: row,[indexItem]: event.target.value})">
                                <option 
                                    v-for="option in getSelectOptions(indexItem)" 
                                    :key="option.value" 
                                    :value="option.value"
                                    :selected="option.value == item"
                                >
                                    {{ option.label }}
                                </option>
                            </select>
                        </template>

                        <template v-else-if="getColumnType(indexItem) === 'toggle'">
                            <label class="switch relative w-10 h-5 inline-block">
                                <input type="checkbox"
                                    class="opacity-0 w-0 h-0 peer"
                                    :checked="item === getToggleValues(indexItem).on"
                                    @change="event => $emit('toggleChange', {row: row, [indexItem]: event.target.checked ? getToggleValues(indexItem).on : getToggleValues(indexItem).off})">
                                <span class="slider round absolute cursor-pointer inset-0 bg-slate-300 transition-transform duration-500 rounded-full peer-checked:bg-sky-500"></span>
                            </label>
                        </template>

                        <template v-else-if="getColumnType(indexItem) === 'checkbox'">
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
                            <template v-for="action in props.actions" :key="action.event">
                                <button 
                                @click="handleAction({action: action, row: row})" 
                                class="horizon-td-button flex gap-1 items-center"
                                >
                                    <component :is="Heroicons[action.icon + 'Icon']" class="horizon-td-icon size-5" v-if="action.icon"/>
                                    <template v-if="action.label">
                                        {{ action.label }}
                                    </template>
                                </button>
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
import { computed, ref, reactive } from 'vue';

import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { ChevronUpIcon } from '@heroicons/vue/24/solid'
import * as Heroicons  from '@heroicons/vue/24/outline'

import Filters from './Filters.vue'
import Badges from './Badges.vue'
import { getKeyFromLabel  } from './utils.js'
import { useTableSorting } from './composables/tableSorting.js';
import { useTableFilters } from './composables/tableFiltering.js';
import { useTableSearch } from './composables/tableSearching.js';
import { useTableModal } from './composables/tableModal.js';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    labels: Array,
    sortable: Array,
    search: Array,
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

const getColumnType = (column) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);
    return columnInfo ? columnInfo.type : 'text'; // Retourne 'text' par défaut si aucun type n'est spécifié
};

const getIconFromColumn = (column, value) => {
    const columnInfo = props.columnTypes.find(type => type.column === column)

    return columnInfo ? columnInfo.icons?.[value] : ''
}

const getColorFromColumn = (column, value) => {
    // Cherche dans 'columnTypes' l'entrée pour cette colonne
    const columnInfo = props.columnTypes.find(type => type.column === column);
    
    // Si une couleur est définie pour la valeur de la cellule, la renvoyer, sinon utiliser une couleur par défaut
    return columnInfo ? columnInfo.colors?.[value] || columnInfo.colors : '';
};

const getImageSize = (column) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);

    if (!columnInfo.size) return;

    return {
        width: columnInfo.size.width || 'auto',
        height: columnInfo.size.height || 'auto',
        aspectRatio: columnInfo.size.ratio || ''
    }
    
}

const getImageUrl = (column, value) => {
  const columnInfo = props.columnTypes.find(type => type.column === column);

  if (!columnInfo || columnInfo.type !== 'image') return '';

  const basePath = columnInfo.basePath || ''; // Utiliser basePath s'il est défini

  return basePath + value;
}

const getImageShape = (column) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);

    switch (columnInfo.shape) {
        case 'circle':
            return 'rounded-full'
            break;
        case 'square':
            return 'aspect-square'
        default:
            return ''
    }
}

const getSelectOptions = (column) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);
    return columnInfo ? columnInfo.options : [];
}

const getToggleValues = (column) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);
    return columnInfo?.toggleValues || { on: true, off: false };
}
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