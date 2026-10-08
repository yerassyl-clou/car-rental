// ===== Функции валидации =====
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(v) {
  return /^\+?[0-9]{10,12}$/.test(v);
}

function isEmpty(v) {
  return !v.trim();
}

// ===== Функции отображения ошибок =====
// Показывает ошибку под полем
function showError(input, message) {
  input.classList.add("input-error");
  const el = document.createElement("small");
  el.className = "error";
  el.textContent = message;
  input.insertAdjacentElement("afterend", el);
}

// Убирает все ошибки в форме (вызывать в начале проверки)
function clearErrors(form) {
  form.querySelectorAll(".error").forEach((e) => e.remove());
  form
    .querySelectorAll(".input-error")
    .forEach((e) => e.classList.remove("input-error"));
}
