<template>
    <div class="horizon-table-wrapper">
        <p v-if="props.data.length === 0">no data available</p>

        <table v-else class="horizon-table w-full">
            <thead class="horizon-thead">
                <tr class="horizon-tr bg-slate-200">
                    <th 
                        class="horizon-th text-left px-4 py-2" 
                        v-for="(label, indexLabel) in (labels || Object.keys(props.data[0]))"
                        :key="indexLabel"
                        @click="sortLabel(label)"
                        >
                        <div class="flex gap-2 items-center">
                            {{ label }}
                            <ChevronDownIcon v-if="hasSort(label) && (sortableData[getKeyFromLabel(label)] == 'asc' || sortableData[getKeyFromLabel(label)] == null)" class="size-4"></ChevronDownIcon>
                            <ChevronUpIcon v-if="hasSort(label) && sortableData[getKeyFromLabel(label)] == 'desc'" class="size-4"></ChevronUpIcon>
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
import { ref } from 'vue';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    labels: Array,
    sortable: Array
})

const sortedData = ref([...props.data])

const sortableData = props.sortable.reduce((obj, value) => {
    obj[value] = null;
    return obj;
}, {})

const sortLabel = (label) => {
    const key = getKeyFromLabel(label)

    sortableData[key] = sortableData[key] == 'asc' ? 'desc' : 'asc'
    
    sortedData.value.sort((a, b) => {
        const comparison = a[key] > b[key] ? 1 : -1;
        return sortableData[key] === 'asc' ? comparison : -comparison;
    });
}

const getKeyFromLabel = (label) => {
    if (props.labels && props.data.length > 0) {
        return Object.keys(props.data[0])[props.labels.indexOf(label)]
    }
    return label
};

const hasSort = (label) => {
    return props.sortable.includes(getKeyFromLabel(label))
}
</script>