import { ref, computed } from 'vue';
import { sortData, getKeyFromLabel } from '../utils'; // Assure-toi que ta fonction de tri est importée depuis ton fichier utils.

export function useTableSorting(props, searchedData) {
  const sortKey = ref(null); // Clé de tri actuelle
  const sortableData = ref(
    props.sortable.reduce((obj, value) => {
      obj[value] = null; // Initialiser toutes les clés triables à null (pas de tri)
      return obj;
    }, {})
  );

  const sortedData = computed(() => {
    // Copie des données filtrées à trier
    const dataToSort = [...searchedData.value];
    return sortData(dataToSort, sortKey.value, sortableData.value[sortKey.value]);
  });

  const sortLabel = (label) => {
    const key = getKeyFromLabel(label, props);
    
    if (!sortableData.value.hasOwnProperty(key)) return;

    sortKey.value = key; // Définir la clé de tri
    sortableData.value[key] = sortableData.value[key] === 'asc' ? 'desc' : 'asc'; // Basculer entre asc et desc
  };

  const hasSort = (label) => {
    return props.sortable.includes(getKeyFromLabel(label, props));
  };

  return { sortedData, sortLabel, hasSort };
}
