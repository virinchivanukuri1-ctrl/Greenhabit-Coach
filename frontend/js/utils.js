const loaderEl = document.getElementById("loader");
const toastEl = document.getElementById("toast");

function showLoader() {
  if (loaderEl) loaderEl.classList.remove("hidden");
}

function hideLoader() {
  if (loaderEl) loaderEl.classList.add("hidden");
}

function showToast(message, duration = 3000) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), duration);
}

function validateForm(form) {
  if (!form) return false;
  return form.checkValidity();
}
