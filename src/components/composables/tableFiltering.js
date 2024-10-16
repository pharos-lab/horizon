import { reactive, computed } from 'vue';
import { initializeFilters, checkFilters } from '../utils';

export function useTableFilters(props) {
  const activeFilters = reactive({
    checkbox: {},
    select: {},
    column: []
  });

  // Initialiser les filtres à l'initialisation du composant
  initializeFilters(props.filters, activeFilters);

  const filteredData = computed(() => {
    return props.data.filter(row => checkFilters(row, activeFilters));
  });

  const resetFilters = () => {
    // Réinitialiser les filtres
    Object.keys(activeFilters.checkbox).forEach(key => {
      activeFilters.checkbox[key] = false;
    });

    Object.keys(activeFilters.select).forEach(key => {
      activeFilters.select[key] = '';
    });
  };

  const clearSelectFilter = (key) => {
    activeFilters.select[key] = ''; // Réinitialiser le filtre select
  };

  const clearCheckboxFilter = (key) => {
    activeFilters.checkbox[key] = false; // Décocher la checkbox
  };

  return {
    activeFilters,
    filteredData,
    resetFilters,
    clearSelectFilter,
    clearCheckboxFilter
  };
}
