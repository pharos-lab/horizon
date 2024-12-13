import Table from "./components/Table.vue";
import { defaultOptions } from './config/options.js'
import { merge } from 'lodash-es';

const horizon = {
  install(Vue, options = {}) {
    const finalOptions = merge(defaultOptions, options)

    const getHeaderClass = () => {
      return [
          finalOptions.header.background,
          finalOptions.header.text,
          finalOptions.header.hover,
          finalOptions.header.fontSize,
      ].join(' ')
    }
  
    const getHeaderCellPadding = () => finalOptions.header.cellPadding
  
    const getRowClass = () => {
      return [
          finalOptions.row.background,
          finalOptions.row.text,
          finalOptions.row.hover,
          finalOptions.row.fontSize,
      ].join(' ')
    }
  
    const getRowCellPadding = () => finalOptions.row.cellPadding
    // components
    Vue.provide('horizon', {
      options: finalOptions,
      getHeaderCellPadding,
      getHeaderClass,
      getRowClass,
      getRowCellPadding
    })
    Vue.component('Table', Table);
  },
};

export { horizon };