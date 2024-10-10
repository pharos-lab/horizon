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

const sortData = (dataToSort, sortKey) => {
    if (!sortKey) return dataToSort;

    return dataToSort.sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        return compareValues(aVal, bVal);
    });
};

const compareValues = (aVal, bVal) => {
    if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
    }
    if (aVal instanceof Date && bVal instanceof Date) {
        return aVal - bVal;
    }
    return aVal.localeCompare(bVal);
};

export {initializeFilters, checkFilters, sortData, compareValues}