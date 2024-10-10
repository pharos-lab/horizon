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
                            <ChevronDownIcon v-if="hasSort(label) && (sortableData[getKeyFromLabel(label)] == 'asc' || sortableData[getKeyFromLabel(label)] == null)" class="size-4"></ChevronDownIcon>
                            <ChevronUpIcon v-if="hasSort(label) && (sortableData[getKeyFromLabel(label)] == 'desc')" class="size-4"></ChevronUpIcon>
                        </div>
                    </th>
                </tr>
            </thead>


            <tbody class="horizon-tbody">
                <tr class="horizon-tr" v-for="(row, indexRow) in sortedData" :key="indexRow">
                    <td class="horizon-td text-left px-4 py-2" 
                        v-for="(item, indexItem) in row" :key="indexItem"
                        > 
                        {{ item }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { ChevronUpIcon } from '@heroicons/vue/24/solid'
import { computed, ref, reactive, onMounted } from 'vue';
import Filters from './Filters.vue'
import Badges from './Badges.vue'
import { initializeFilters, checkFilters, sortData, compareValues } from './utils.js'

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
    }
})

const sortKey = ref(null)
const searchTerm = ref('')

const activeFilters = reactive({
    checkbox: {},
    select: {}
});

onMounted(() => {
    initializeFilters(props.filters, activeFilters);

    props.filters.forEach(filter => {
        if (filter.type === 'checkbox') {
            activeFilters.checkbox[filter.column] = false; // Par défaut, décoché
        }
        if (filter.type === 'select') {
            activeFilters.select[filter.column] = ''; // Par défaut, aucune sélection
        }
    });
    
})

const sortableData = reactive(
    props.sortable.reduce((obj, value) => {
        obj[value] = null
        return obj;
    }, {})
)

const filteredData = computed(() => {
    return props.data.filter(row => checkFilters(row, activeFilters));
});

const searchedData = computed(() => {
    if (!searchTerm.value) {
        return filteredData.value; // Pas de recherche, retourner toutes les données
    }

    return filteredData.value.filter(row => {
        return props.search.some(key => {
            const cellValue = String(row[key] || '').toLowerCase();
            return cellValue.includes(searchTerm.value.toLowerCase());
        });
    });
})

const sortedData = computed(() => {
    const dataToSort = [...searchedData.value];

    if (!sortKey.value) return dataToSort;

    return dataToSort.sort((a, b) => {
        const aVal = a[sortKey.value] ?? ''; // Gérer null/undefined
        const bVal = b[sortKey.value] ?? '';

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortableData[sortKey.value] === 'asc' ? aVal - bVal : bVal - aVal;
        }

        // Tri des dates
        if (aVal instanceof Date && bVal instanceof Date) {
            return sortableData[sortKey.value] === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const comparison = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
        return sortableData[sortKey.value] === 'asc' ? comparison : -comparison;
    });
})


const sortLabel = (label) => {
    const key = getKeyFromLabel(label)

    if(!sortableData.hasOwnProperty(key)) return 

    sortKey.value = key

    sortableData[key] = sortableData[key] == 'asc' ? 'desc' : 'asc'
}

const resetFilters = () => {
    // Réinitialiser les filtres
    Object.keys(activeFilters.checkbox).forEach(key => {
        activeFilters.checkbox[key] = false;
    });

    Object.keys(activeFilters.select).forEach(key => {
        activeFilters.select[key] = '';
    });
    //searchTerm.value = ''; // Réinitialiser le champ de recherche
};

const clearSelectFilter = (key) => {
    activeFilters.select[key] = ''; // Réinitialiser le filtre select
};

const clearCheckboxFilter = (key) => {
    activeFilters.checkbox[key] = false; // Décocher la checkbox
};

const getKeyFromLabel = (label) => {
    if (props.labels && props.data.length > 0) {
        return Object.keys(props.data[0])[props.labels.indexOf(label)]
    }
    return label
};

const getFilterLabel = (column) => {
    const filter = props.filters.find(f => f.column === column);
    return filter ? filter.label : column;
};

const hasSort = computed(() => {
    return (label) => props.sortable.includes(getKeyFromLabel(label))
})
</script>