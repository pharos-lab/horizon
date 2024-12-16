# Horizon Table

Horizon Table is a highly customizable, feature-rich Vue.js table component designed to simplify data presentation and enhance user experience. It provides features like sorting, searching, filtering, pagination, column-specific rendering, and actions for each row, making it ideal for building complex, interactive tables with minimal effort.

This component is built to be flexible, allowing users to easily adapt it to their needs by customizing the appearance and behavior using a simple API and plugin-based configuration.

## Features

- **Customizable Columns**: Define column types for icons, images, toggles, and selects.
- **Sorting**: Enable column sorting with simple clicks on the headers.
- **Filtering**: Support for custom filters like checkboxes, selects, and column-based filtering.
- **Search**: Built-in search functionality for quick data lookups.
- **Actions**: Include row-specific actions such as editing, viewing, and deleting.
- **Responsive Design**: The table adapts to various screen sizes.
- **Customizable Styles**: Easily customize styles for headers, rows, and cells.
- **Plugin Options**: Configure default settings globally with options for header, row, and cell styles.

## Usage

### Register the Plugin

Import and register Horizon Table in your Vue 3 app:

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import { horizon } from './horizon.js';

createApp(App).use(horizon).mount('#app');
```

### Basic Example
Use the `<Table>` component in your Vue template:
```javascript
<template>
  <Table 
    :data="data" 
    :labels="labels" 
    :sortable="['name', 'age']"
    :search="['name']"
    :filters="filters"
    :columnTypes="columnTypes"
    :actions="actions"
    @action="handleAction"
    @select-change="handleSelectChange"
  />
</template>

<script setup>
const data = [
  { name: 'Alice', age: 25, active: true, admin: false },
  { name: 'Bob', age: 30, active: false, admin: true },
];

const labels = ['Name', 'Age', 'Active', 'Admin'];

const filters = [
  { type: 'checkbox', label: 'Active', column: 'active', value: true },
  { type: 'select', label: 'Age', column: 'age', options: [25, 30] },
];

const columnTypes = [
  { column: 'active', type: 'icon', icons: { true: 'CheckCircle', false: 'XCircle' } },
  { column: 'admin', type: 'toggle', toggleValues: { on: true, off: false } },
];

const actions = {
  label: 'Actions',
  items: [
    { label: 'Edit', icon: 'PencilSquare', event: 'edit' },
    { label: 'Delete', icon: 'Trash', event: 'delete', confirm: true },
  ],
};

const handleAction = (event) => console.log(event);
const handleSelectChange = (event) => console.log(event);
</script>
```

