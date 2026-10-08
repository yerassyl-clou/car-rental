// ===== Базовые функции localStorage =====
function read(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== Данные =====
function getUsers() {
  return read("users");
}
function saveUsers(list) {
  write("users", list);
}
function getCars() {
  return read("cars");
}
function saveCars(list) {
  write("cars", list);
}
function getBookings() {
  return read("bookings");
}
function saveBookings(list) {
  write("bookings", list);
}

function getCarById(id) {
  return getCars().find((c) => c.id === Number(id)) || null;
}

// Следующий id: nextId(getUsers()) или nextId(getBookings(), 10001)
function nextId(list, start = 1) {
  return list.length ? Math.max(...list.map((i) => i.id)) + 1 : start;
}

// ===== Сессия =====
function getSession() {
  return JSON.parse(localStorage.getItem("session") || "null");
}
function setSession(id) {
  localStorage.setItem("session", JSON.stringify(id));
}
function clearSession() {
  localStorage.removeItem("session");
}

function getCurrentUser() {
  const id = getSession();
  if (!id) return null;
  return getUsers().find((u) => u.id === id) || null;
}

// ===== Защита страниц =====
function requireLogin() {
  if (!getCurrentUser()) window.location.href = "login.html";
}
function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") window.location.href = "index.html";
}

// ===== Общие функции валидации и ошибок =====
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

// ===== Первичная инициализация =====
function initData() {
  if (!localStorage.getItem("users")) {
    saveUsers([
      {
        id: 1,
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@drivego.com",
        password: "admin123",
        phone: "",
        role: "admin",
      },
    ]);
  }
  if (!localStorage.getItem("cars")) {
    saveCars(typeof SEED_CARS !== "undefined" ? SEED_CARS : []);
  }
  if (!localStorage.getItem("bookings")) {
    saveBookings([]);
  }
}
initData();
