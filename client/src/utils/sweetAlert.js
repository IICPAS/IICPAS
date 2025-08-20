import Swal from "sweetalert2";

// Reusable SweetAlert configurations
export const sweetAlertConfig = {
  // Delete confirmation
  deleteConfirmation: (itemName = "item") => ({
    title: "Are you sure?",
    text: `You will not be able to recover this ${itemName}!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "modern-swal",
      confirmButton: "swal2-confirm",
      cancelButton: "swal2-cancel",
    },
  }),

  // Success message
  success: (title = "Success!", message = "Operation completed successfully.") => ({
    title,
    text: message,
    icon: "success",
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "modern-swal",
    },
  }),

  // Error message
  error: (title = "Error!", message = "Something went wrong.") => ({
    title,
    text: message,
    icon: "error",
    customClass: {
      popup: "modern-swal",
    },
  }),

  // Warning message
  warning: (title = "Warning!", message = "Please check your input.") => ({
    title,
    text: message,
    icon: "warning",
    customClass: {
      popup: "modern-swal",
    },
  }),
};

// Helper functions
export const showDeleteConfirmation = async (itemName = "item") => {
  const result = await Swal.fire(sweetAlertConfig.deleteConfirmation(itemName));
  return result.isConfirmed;
};

export const showSuccess = (title, message) => {
  return Swal.fire(sweetAlertConfig.success(title, message));
};

export const showError = (title, message) => {
  return Swal.fire(sweetAlertConfig.error(title, message));
};

export const showWarning = (title, message) => {
  return Swal.fire(sweetAlertConfig.warning(title, message));
};

export default Swal;
