// ===== Показ/скрытие пунктов меню по статусу пользователя =====
function updateNavbar() {
  const user = getCurrentUser();
  document.querySelectorAll("[data-auth]").forEach((el) => {
    const type = el.dataset.auth;
    let show = false;
    if (type === "guest") show = !user;
    if (type === "user") show = !!user;
    if (type === "admin") show = !!user && user.role === "admin";
    el.style.display = show ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();

  // Бургер-меню (mobile)
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  // Logout
  const logout = document.getElementById("logoutBtn");
  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      clearSession();
      window.location.href = "login.html";
    });
  }
});

// ===== Регистрация =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return; // Форма есть только на register.html

  // Если пользователь уже вошёл, перенаправить на главную
  if (getCurrentUser()) {
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);

    // Получаем значения полей
    const firstName = document.getElementById("regFirstName");
    const lastName = document.getElementById("regLastName");
    const email = document.getElementById("regEmail");
    const phone = document.getElementById("regPhone");
    const password = document.getElementById("regPassword");
    const confirmPassword = document.getElementById("regConfirmPassword");

    let valid = true;

    // 1. Проверка обязательных полей
    if (isEmpty(firstName.value)) {
      showError(firstName, "First name is required");
      valid = false;
    }
    if (isEmpty(lastName.value)) {
      showError(lastName, "Last name is required");
      valid = false;
    }
    if (isEmpty(email.value)) {
      showError(email, "Email is required");
      valid = false;
    } else {
      // 2. Проверка формата email
      if (!isValidEmail(email.value)) {
        showError(email, "Please enter a valid email");
        valid = false;
      }
    }
    if (isEmpty(password.value)) {
      showError(password, "Password is required");
      valid = false;
    } else {
      // 3. Проверка длины пароля
      if (password.value.length < 6) {
        showError(password, "Password must be at least 6 characters");
        valid = false;
      }
    }
    if (isEmpty(confirmPassword.value)) {
      showError(confirmPassword, "Please confirm your password");
      valid = false;
    } else {
      // 4. Проверка совпадения паролей
      if (password.value !== confirmPassword.value) {
        showError(confirmPassword, "Passwords do not match");
        valid = false;
      }
    }

    // Проверка телефона (только если заполнен)
    if (!isEmpty(phone.value) && !isValidPhone(phone.value)) {
      showError(phone, "Please enter a valid phone number");
      valid = false;
    }

    if (!valid) return;

    // 5. Проверка уникальности email
    const normalizedEmail = email.value.trim().toLowerCase();
    const users = getUsers();
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      showError(email, "This email is already registered");
      return;
    }

    // Создание нового пользователя
    const newUser = {
      id: nextId(users),
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: normalizedEmail,
      phone: phone.value.trim(),
      password: password.value,
      role: "user",
    };

    users.push(newUser);
    saveUsers(users);

    // Автоматический вход после регистрации
    setSession(newUser.id);

    // Переход на главную
    window.location.href = "index.html";
  });
});
