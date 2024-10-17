<template>
    <div class="wrapper relative">
        <component :is="Heroicons[props.actions.icon + 'Icon']" 
        class="size-8 cursor-pointer p-1 hover:bg-slate-100 rounded-full"
        :class="props.actions.color"
        @click="isOpen = !isOpen"></component>
        
        <div class="content absolute right-0 top-10 shadow-md border rounded z-20 bg-white min-w-52" v-show="isOpen">
            <div class="px-3 py-2 hover:bg-slate-100" v-for="action in props.actions.items" >
                <ActionButton 
                :action="action" 
                :row="row" 
                :key="action.event"
                @action="handleAction({action: action, row: row})"
                ></ActionButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as Heroicons from '@heroicons/vue/24/outline'
import { ref } from 'vue';

import ActionButton from './ActionButton.vue';

const emit = defineEmits(['action'])

const props = defineProps({
    actions: Object,
    row: Object
})

const isOpen = ref(false)

const handleAction = (event) => {
    emit('action', event)
    isOpen.value = !isOpen.value
}
</script>