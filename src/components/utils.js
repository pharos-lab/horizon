const initializeFilters = (filters, activeFilters) => {
    filters.forEach(filter => {
        if (filter.type === 'checkbox') {
            activeFilters.checkbox[filter.column] = false; // Par défaut, décoché
        }
        if (filter.type === 'select') {
            activeFilters.select[filter.column] = ''; // Par défaut, aucune sélection
        }
        if(filter.type === 'column') {
            activeFilters.column = filter.columns.reduce((obj, value) => {
                obj[value] = true;
                return obj;
              }, {})
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
  
const getColumnType = (column, props) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);
    return columnInfo ? columnInfo.type : 'text'; // Retourne 'text' par défaut si aucun type n'est spécifié
};

const getIconFromColumn = (column, value, props) => {
    const columnInfo = props.columnTypes.find(type => type.column === column)

    return columnInfo ? columnInfo.icons?.[value] : ''
}

const getColorFromColumn = (column, value, props) => {
    // Cherche dans 'columnTypes' l'entrée pour cette colonne
    const columnInfo = props.columnTypes.find(type => type.column === column);
    
    // Si une couleur est définie pour la valeur de la cellule, la renvoyer, sinon utiliser une couleur par défaut
    return columnInfo ? columnInfo.colors?.[value] || columnInfo.colors : '';
};

const getColorFromAction = (action, value) => {
    return action.colors ? action.colors?.[value] || action.colors : '';
};

const getImageSize = (column, props) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);

    if (!columnInfo.size) return;

    return {
        width: columnInfo.size.width || 'auto',
        height: columnInfo.size.height || 'auto',
        aspectRatio: columnInfo.size.ratio || ''
    }
    
}

const getImageUrl = (column, value, props) => {
  const columnInfo = props.columnTypes.find(type => type.column === column);

  if (!columnInfo || columnInfo.type !== 'image') return '';

  const basePath = columnInfo.basePath || ''; // Utiliser basePath s'il est défini

  return basePath + value;
}

const getImageShape = (column, props) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);

    switch (columnInfo.shape) {
        case 'circle':
            return 'rounded-full'
            break;
        case 'square':
            return 'aspect-square'
        default:
            return ''
    }
}

const getSelectOptions = (column, props) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);
    return columnInfo ? columnInfo.options : [];
}

const getToggleValues = (column, props) => {
    const columnInfo = props.columnTypes.find(type => type.column === column);
    return columnInfo?.toggleValues || { on: true, off: false };
}

export {
    initializeFilters, 
    checkFilters, 
    sortData, 
    compareValues, 
    getKeyFromLabel, 
    getColumnType, 
    getIconFromColumn, 
    getColorFromColumn, 
    getImageShape, 
    getImageSize, 
    getImageUrl, 
    getSelectOptions, 
    getToggleValues,
    getColorFromAction
}