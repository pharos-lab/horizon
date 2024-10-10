<template>
    <div class="horizon-table-wrapper">
        <div class="options ">
            <input type="text" v-model="searchTerm" v-if="search" class="border" placeholder="search...">

            <template v-for="filter in props.filters" :key="filter.label">
                <div class="filter" v-if="filter.type === 'checkbox'">
                    <label>
                        <input type="checkbox" v-model="activeFilters.checkbox[filter.column]" :value="filter.value">
                        {{ filter.label }}
                    </label>
                </div>
            </template>

            <template v-for="filter in props.filters" :key="filter.label">
                <div class="filter" v-if="filter.type === 'select'">
                    <label>{{ filter.label }}</label>
                    <select v-model="activeFilters.select[filter.column]">
                        <option value="">All</option>
                        <option v-for="option in filter.options" :key="option" :value="option">{{ option }}</option>
                    </select>
                </div>
            </template>
            
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
import { computed, ref, reactive } from 'vue';

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

props.filters.forEach(filter => {
    if (filter.type === 'checkbox') {
        activeFilters.checkbox[filter.column] = false; // Par défaut, décoché
    }
    if (filter.type === 'select') {
        activeFilters.select[filter.column] = ''; // Par défaut, aucune sélection
    }
});

const filteredData = computed(() => {
    return props.data.filter(row => {
        // Vérifier les filtres à cocher
        for (const [column, value] of Object.entries(activeFilters.checkbox)) {
            if (value && row[column] !== value) {
                return false; // Si la case est cochée et ne correspond pas, on exclut la ligne
            }
        }
        
        // Vérifier les filtres select
        for (const [column, selectedValue] of Object.entries(activeFilters.select)) {
            if (selectedValue && row[column] !== selectedValue) {
                return false; // Si une option est sélectionnée et ne correspond pas, on exclut la ligne
            }
        }

        return true;
    });
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

const sortableData = reactive(
    props.sortable.reduce((obj, value) => {
        obj[value] = null
        return obj;
    }, {})
)

const sortedData = computed(() => {
    const dataToSort = [...searchedData.value];

    if (!sortKey.value) return dataToSort;

    return dataToSort.sort((a, b) => {
        const aVal = a[sortKey.value] ?? ''; // Gérer null/undefined
        const bVal = b[sortKey.value] ?? '';
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

const getKeyFromLabel = (label) => {
    if (props.labels && props.data.length > 0) {
        return Object.keys(props.data[0])[props.labels.indexOf(label)]
    }
    return label
};

const hasSort = computed(() => {
    return (label) => props.sortable.includes(getKeyFromLabel(label))
})
</script>