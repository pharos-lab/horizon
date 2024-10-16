<template>
    <td class="horizon-td text-left px-4 py-2" 
        :class="Utils.getColorFromColumn(indexItem, item, tableProps)"
        > 
        <template v-if="Utils.getColumnType(indexItem, tableProps) === 'icon'">
            <component :is="Heroicons[Utils.getIconFromColumn(indexItem, item, tableProps) + 'Icon']" class="horizon-td-icon size-5"/>
        </template>

        <template v-else-if="Utils.getColumnType(indexItem, tableProps) === 'image'">
            <img :src="Utils.getImageUrl(indexItem, item, tableProps)" 
                class="horizon-td-image size-5" 
                :alt="item" 
                :style="Utils.getImageSize(indexItem, tableProps)" 
                :class="Utils.getImageShape(indexItem, tableProps)">
        </template>

        <template v-else-if="Utils.getColumnType(indexItem, tableProps) === 'select'">
            <select class="horizon-td-select" @change="event => $emit('change', {eventName: 'selectChange', eventData: { row: row,[indexItem]: event.target.value}})">
                <option 
                    v-for="option in Utils.getSelectOptions(indexItem, tableProps)" 
                    :key="option.value" 
                    :value="option.value"
                    :selected="option.value == item"
                >
                    {{ option.label }}
                </option>
            </select>
        </template>

        <template v-else-if="Utils.getColumnType(indexItem, tableProps) === 'toggle'">
            <label class="switch relative w-10 h-5 inline-block">
                <input type="checkbox"
                    class="opacity-0 w-0 h-0 peer"
                    :checked="item === Utils.getToggleValues(indexItem, tableProps).on"
                    @change="event => $emit('change', {eventName: 'toggleChange', eventData: {row: row, [indexItem]: event.target.checked ? Utils.getToggleValues(indexItem, tableProps).on : Utils.getToggleValues(indexItem, tableProps).off}})">
                <span class="slider round absolute cursor-pointer inset-0 bg-slate-300 transition-transform duration-500 rounded-full peer-checked:bg-sky-500"></span>
            </label>
        </template>

        <template v-else-if="Utils.getColumnType(indexItem, tableProps) === 'checkbox'">
            <label class="relative">
                <input type="checkbox"
                    class=""
                    :checked="item"
                    @change="event => $emit('change', {eventName: 'checkboxChange', eventData: {row: row, [indexItem]: event.target.checked }})">
            </label>
        </template>
        
        <template v-else>
            {{ item }}
        </template>
    </td>
</template>

<script setup>
import * as Utils from './utils.js'
import * as Heroicons from '@heroicons/vue/24/outline'

defineEmits(['change'])

const props = defineProps(['row', 'item', 'indexItem', 'tableProps'])
</script>

<style>
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