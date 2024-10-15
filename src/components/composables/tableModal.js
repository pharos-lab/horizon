import { reactive } from 'vue';

export function useTableModal(emit) {
  const modal = reactive({
    isOpen: false,
    row: null,
    action: null
  });

  const handleAction = ({ action, row }) => {
    if (action.confirm) {
      modal.isOpen = true;
      modal.action = action;
      modal.row = row;
    } else {
      emit('action', { event: action.event, row });
    }
  };

  const confirmAction = () => {
    emit('action', { event: modal.action.event, row: modal.row });
    closeModal();
  };

  const closeModal = () => {
    modal.isOpen = false;
    modal.action = null;
    modal.row = null;
  };

  return { modal, handleAction, confirmAction, closeModal };
}
