<template>
    <div class="table-wrapper">
        <p v-if="props.data.length === 0">no data available</p>

        <table v-else>
            <thead>
                <tr>
                    <th v-for="label in Object.keys(props.data[0])">{{ label }}</th>
                </tr>
            </thead>


            <tbody>
                <tr v-for="row in props.data">
                    <td v-for="item in row"> {{ item }}</td>
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

})
</script>