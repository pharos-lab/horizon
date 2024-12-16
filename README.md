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
import { horizon } from '@pharos-labo/horizon';

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

### Configuration

#### 1. Filters

Filters allow users to narrow down data by specific columns.

##### Checkbox Filter:
```javascript
{ type: 'checkbox', label: 'Active', column: 'active', value: true }
```

##### Select Filter:
```javascript
{ type: 'select', label: 'Age', column: 'age', options: [25, 30] }
```

##### Column Visibility Filter:
```javascript
{ type: 'column', columns: ['name', 'admin'] }
```

##### Filter Properties:
| Property |	Type | Description |
|--------- | ----- | ----------- |
| type	| String | The filter type (checkbox, select).|
| label |	String |	Label displayed to the user.
| column |	String | Column to which the filter applies.
| options |	Array |	(For select) List of values the user can select from.
| value |	Mixed |	(For checkbox) the value the column will be filtered.


#### 2. Search
Enable searching across specific columns by passing an array of column keys to the search prop:

```javascript
:search="['name', 'age']"
```

##### Search Features:
- Multi-Column Search: Users can search across all enabled columns simultaneously.
- Case Insensitivity: Search queries are case-insensitive by default.


#### 3. Sorting
Make columns sortable by specifying their keys in the sortable prop:

```javascript
:sortable="['name', 'age']"
```

#### 4. Column Types
Customize the behavior of columns using the columnTypes prop.

Examples:

- Icons:

```javascript
{ column: 'active', type: 'icon', icons: { true: 'CheckCircle', false: 'XCircle' }, colors: {true: 'text-emerald-500', false: 'text-red-500'} }
```

- Images:

```javascript
{ column: 'avatar', type: 'image', basePath: '/uploads/images.png', size: { width: '100px', height: '50px' } }
```

- Select Dropdown:

```javascript
{ column: 'status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] }
```

- Toggle:

```javascript
{ column: 'admin', type: 'toggle', toggleValues: { on: true, off: false } }
```

##### Column Type Properties:

| Property | Type |	Description |
| -------- | ---- | ----------- |
| column | String |	The column name in the dataset. |
| type | String	| The type of column (icon, toggle, dropdown, image).
| icons |	Object |	(For icon) Map of values to icons.
| options |	Array |	(For dropdown) Array of selectable options.
| baseUrl |	String |	(For image) Base URL for image paths.
| colors | String | Map of values to colors
| size | Object | (for image) An object with `width` and `height` property
| shape | String | (for image) the shape of the image ('circle' or 'square')

#### 5. Actions

Define custom actions for rows using the actions prop.

Example:

```javascript
const actions = {
  label: 'Actions',
  group: true,
  icon: 'EllipsisVertical',
  items: [
    { label: 'Edit', icon: 'PencilSquare', event: 'edit', colors: 'text-yellow-500' },
    { label: 'Delete', icon: 'Trash', event: 'delete', confirm: true },
  ],
};
```

##### Actions Properties:

| Property | Type |	Description |
| -------- | ---- | ----------- |
| label | String |	The label for the action in the header |
| group | Boolean	| Regroup all actions into Menu to click
| icon |	String |	(For group) The icon to display for group actions
| items |	Array |	A list of actions
| items label |	String |	The label of action
| items icon |	String |	The icon for the action
| items event |	String |	The name of the event the action will trigger
| items confirm |	Boolean |	Open a modal for confirmation before trigger the event

### Events

Horizon Table emits events for various user actions:

| Event |	Description |
| ----- | ----------- |
| @action |	Triggered when a user performs an action (e.g., Edit/Delete).
| @select-change |	Triggered when a select value changes in a row.
| @toggleChange |	Triggered when a toggle value changes in a row.
| @checkboxChange |	Triggered when a checkbox value changes in a row.

### Style Customization
Horizon Table allows you to customize the appearance of table headers, rows, and cells through plugin options. Provide an options object during plugin initialization to override default styles.

#### Example

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import { horizon } from './horizon.js';

const options = {
  header: {
    background: 'bg-slate-200', // Header background color
    text: 'text-slate-900',     // Header text color
    hover: 'hover:bg-slate-300', // Header hover effect
    cellPadding: 'px-5 py-2',   // Header cell padding
    fontSize: 'text-xl',        // Header font size
  },
  row: {
    background: 'bg-slate-200', // Row background color
    text: 'text-slate-900',     // Row text color
    hover: 'hover:bg-red-100',  // Row hover effect
    cellPadding: 'px-4 py-2',   // Row cell padding
  },
};

createApp(App).use(horizon, options).mount('#app');
```

> Note: The provided options will be merged with Horizon's default configuration.