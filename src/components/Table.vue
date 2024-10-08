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
                        >
                        {{ label }}
                    </th>
                </tr>
            </thead>


            <tbody class="horizon-tbody">
                <tr class="horizon-tr" v-for="(row, indexRow) in props.data" :key="indexRow">
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

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    labels: Array

})
</script>