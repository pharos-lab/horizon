import { ref, computed } from 'vue';

export function useTableSearch(props, filteredData) {
  const searchTerm = ref('');

  const searchedData = computed(() => {
    if (!searchTerm.value) {
      return filteredData.value; // Pas de recherche, retourner toutes les données
    }

    return filteredData.value.filter(row => {
      return props.search.some(key => {
        const cellValue = String(row[key] || '').toLowerCase();
        return cellValue.includes(searchTerm.value.toLowerCase());
      });
    });
  });

  return { searchTerm, searchedData };
}
