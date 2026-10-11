// ===== Личный кабинет =====
// Подключён только на profile.html

// ===== Просмотр профиля =====
function renderProfile(user) {
  const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  document.getElementById("profileAvatar").textContent = initials;
  document.getElementById("profileName").textContent =
    user.firstName + " " + user.lastName;
  document.getElementById("profileEmail").textContent = user.email;
  // Телефон необязательный: если его нет, показываем прочерк
  document.getElementById("profilePhone").textContent = user.phone || "—";
  document.getElementById("profileRole").textContent =
    user.role === "admin" ? "Administrator" : "Customer";
}

// ===== Edit Profile =====
function openEditForm() {
  const user = getCurrentUser();
  if (!user) return;

  const form = document.getElementById("profileForm");
  clearErrors(form);
  document.getElementById("editFirstName").value = user.firstName;
  document.getElementById("editLastName").value = user.lastName;
  document.getElementById("editPhone").value = user.phone || "";

  document.getElementById("editProfileBox").hidden = false;
  document.getElementById("editProfileBtn").hidden = true;
  document.getElementById("editFirstName").focus();
}

function closeEditForm() {
  document.getElementById("editProfileBox").hidden = true;
  document.getElementById("editProfileBtn").hidden = false;
}

function handleProfileSubmit(e) {
  e.preventDefault();
  const form = e.target;
  clearErrors(form);

  const firstName = document.getElementById("editFirstName");
  const lastName = document.getElementById("editLastName");
  const phone = document.getElementById("editPhone");

  let valid = true;

  // Имя и фамилия обязательны
  if (isEmpty(firstName.value)) {
    showError(firstName, "First name is required");
    valid = false;
  }
  if (isEmpty(lastName.value)) {
    showError(lastName, "Last name is required");
    valid = false;
  }
  // Телефон проверяем, только если он заполнен
  if (!isEmpty(phone.value) && !isValidPhone(phone.value.trim())) {
    showError(phone, "Please enter a valid phone number (10–12 digits, optional +)");
    valid = false;
  }

  if (!valid) return;

  // Обновляем только три поля, email, password и role не трогаем
  const users = getUsers();
  const user = users.find((u) => u.id === getSession());
  if (!user) return;

  user.firstName = firstName.value.trim();
  user.lastName = lastName.value.trim();
  user.phone = phone.value.trim();
  saveUsers(users);

  renderProfile(user);
  closeEditForm();

  const message = document.getElementById("profileMessage");
  message.textContent = "Profile updated successfully.";
  message.hidden = false;
  setTimeout(() => {
    message.hidden = true;
  }, 3000);
}

// ===== История броней =====
function renderBookingHistory(user) {
  const tbody = document.getElementById("bookingsTableBody");
  const wrapper = document.getElementById("bookingsTableWrapper");
  const empty = document.getElementById("noBookings");
  tbody.innerHTML = "";

  // Только брони текущего пользователя, свежие сверху
  const bookings = getBookings()
    .filter((b) => b.userId === user.id)
    .sort((a, b) => b.id - a.id);

  if (!bookings.length) {
    wrapper.hidden = true;
    empty.hidden = false;
    return;
  }
  wrapper.hidden = false;
  empty.hidden = true;

  bookings.forEach((booking) => {
    const car = getCarById(booking.carId);
    const tr = document.createElement("tr");

    const cells = [
      "#" + booking.id,
      car ? car.name : "Deleted car",
      booking.pickupDate,
      booking.returnDate,
    ];
    cells.forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });

    const statusTd = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "status-badge status-" + booking.status.toLowerCase();
    badge.textContent = booking.status;
    statusTd.appendChild(badge);
    tr.appendChild(statusTd);

    tbody.appendChild(tr);
  });
}

// ===== Запуск =====
function initProfile() {
  requireLogin();
  // requireLogin только запускает переход, поэтому проверяем и останавливаемся
  const user = getCurrentUser();
  if (!user) return;

  renderProfile(user);
  renderBookingHistory(user);

  document.getElementById("editProfileBtn").addEventListener("click", openEditForm);
  document.getElementById("cancelEditBtn").addEventListener("click", closeEditForm);
  document.getElementById("profileForm").addEventListener("submit", handleProfileSubmit);
}

initProfile();
