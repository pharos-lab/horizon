const initializeFilters = (filters, activeFilters) => {
    filters.forEach(filter => {
        if (filter.type === 'checkbox') {
            activeFilters.checkbox[filter.column] = false; // Par défaut, décoché
        }
        if (filter.type === 'select') {
            activeFilters.select[filter.column] = ''; // Par défaut, aucune sélection
        }
    });
};


const checkFilters = (row, activeFilters) => {
    for (const [column, value] of Object.entries(activeFilters.checkbox)) {
        if (value && row[column] !== value) {
            return false; // Si la case est cochée et ne correspond pas, on exclut la ligne
        }
    }

    for (const [column, selectedValue] of Object.entries(activeFilters.select)) {
        if (selectedValue && row[column] !== selectedValue) {
            return false; // Si une option est sélectionnée et ne correspond pas, on exclut la ligne
        }
    }

    return true;
};

const sortData = (dataToSort, sortKey, sortOrder) => {
    if (!sortKey) return dataToSort;
    const final = dataToSort.sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        return sortOrder === 'asc' ? compareValues(aVal, bVal) : compareValues(bVal, aVal);
    });
    return final
};

const compareValues = (aVal, bVal) => {
    if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal);
    }

    return aVal - bVal;
};

const getKeyFromLabel = (label, props) => {
    if (props.labels && props.data.length > 0) {
      return Object.keys(props.data[0])[props.labels.indexOf(label)];
    }
    return label;
};
  

export {initializeFilters, checkFilters, sortData, compareValues, getKeyFromLabel}