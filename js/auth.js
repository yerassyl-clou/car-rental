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

// ===== ФОРМЫ РЕГИСТРАЦИИ И ЛОГИНА: добавить в ветке feature/auth =====
