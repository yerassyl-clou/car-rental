// ===== Админ-панель =====
// Подключён только на admin.html

const STATUSES = ["Pending", "Confirmed", "Cancelled"];

// ===== Вспомогательные функции =====
// Ячейка таблицы с безопасным текстом (textContent, не innerHTML)
function createCell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

// Бейдж статуса брони
function createStatusBadge(status) {
  const span = document.createElement("span");
  span.className = "status-badge status-" + status.toLowerCase();
  span.textContent = status;
  return span;
}

// Короткое сообщение об успехе, скрывается через 3 секунды
function showMessage(el, text) {
  el.textContent = text;
  el.hidden = false;
  clearTimeout(el.hideTimer);
  el.hideTimer = setTimeout(() => {
    el.hidden = true;
  }, 3000);
}

// ===== Счётчики =====
function updateCounters() {
  document.getElementById("statUsers").textContent = getUsers().length;
  document.getElementById("statCars").textContent = getCars().length;
  document.getElementById("statBookings").textContent = getBookings().length;
}

// ===== Пользователи (только просмотр) =====
function renderUsers() {
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = "";

  getUsers().forEach((user) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(user.id));
    tr.appendChild(createCell(user.firstName + " " + user.lastName));
    tr.appendChild(createCell(user.email));
    tr.appendChild(createCell(user.role));
    // Пароль не выводим
    tbody.appendChild(tr);
  });
}

// ===== Машины: Read =====
function renderCars() {
  const tbody = document.getElementById("carsTableBody");
  tbody.innerHTML = "";

  const cars = getCars();
  if (!cars.length) {
    const tr = document.createElement("tr");
    const td = createCell("No cars yet");
    td.colSpan = 6;
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  cars.forEach((car) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(car.id));
    tr.appendChild(createCell(car.name));
    tr.appendChild(createCell(car.category));
    tr.appendChild(createCell("$" + car.pricePerDay));
    tr.appendChild(createCell(car.seats));

    const actionsTd = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "table-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-secondary btn-small";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEditCar(car.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-danger btn-small";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteCar(car.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actionsTd.appendChild(actions);
    tr.appendChild(actionsTd);
    tbody.appendChild(tr);
  });
}

// ===== Машины: форма Add / Edit =====
function resetCarForm() {
  const form = document.getElementById("carForm");
  form.reset();
  clearErrors(form);
  document.getElementById("carId").value = "";
  document.getElementById("carFormTitle").textContent = "Add Car";
  document.getElementById("carSubmitBtn").textContent = "Add Car";
  document.getElementById("carCancelBtn").hidden = true;
}

// Update: подставляем данные машины в форму
function startEditCar(id) {
  const car = getCarById(id);
  if (!car) return;

  const form = document.getElementById("carForm");
  clearErrors(form);

  // Если категории нет в списке, добавляем её, чтобы не потерять значение
  const category = document.getElementById("carCategory");
  if (![...category.options].some((o) => o.value === car.category)) {
    category.add(new Option(car.category, car.category));
  }

  document.getElementById("carId").value = car.id;
  document.getElementById("carName").value = car.name;
  category.value = car.category;
  document.getElementById("carPrice").value = car.pricePerDay;
  document.getElementById("carSeats").value = car.seats;
  document.getElementById("carImage").value = car.image;
  document.getElementById("carFeatures").value = (car.features || []).join(", ");
  document.getElementById("carDescription").value = car.description;

  document.getElementById("carFormTitle").textContent = "Edit Car #" + car.id;
  document.getElementById("carSubmitBtn").textContent = "Save Changes";
  document.getElementById("carCancelBtn").hidden = false;

  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Валидация формы машины, возвращает true, если всё корректно
function validateCarForm(form) {
  const name = document.getElementById("carName");
  const category = document.getElementById("carCategory");
  const price = document.getElementById("carPrice");
  const seats = document.getElementById("carSeats");
  const image = document.getElementById("carImage");
  const description = document.getElementById("carDescription");

  let valid = true;

  // 1. Пустые поля
  if (isEmpty(name.value)) {
    showError(name, "Car name is required");
    valid = false;
  }
  if (isEmpty(category.value)) {
    showError(category, "Please select a category");
    valid = false;
  }
  if (isEmpty(image.value)) {
    showError(image, "Image path is required");
    valid = false;
  }
  if (isEmpty(description.value)) {
    showError(description, "Description is required");
    valid = false;
  }

  // 2. Цена: число больше нуля
  const priceValue = Number(price.value);
  if (isEmpty(price.value)) {
    showError(price, "Price is required");
    valid = false;
  } else if (isNaN(priceValue) || priceValue <= 0) {
    showError(price, "Price must be a number greater than 0");
    valid = false;
  }

  // 3. Места: целое число, минимум 1
  const seatsValue = Number(seats.value);
  if (isEmpty(seats.value)) {
    showError(seats, "Number of seats is required");
    valid = false;
  } else if (!Number.isInteger(seatsValue) || seatsValue < 1) {
    showError(seats, "Seats must be a whole number, at least 1");
    valid = false;
  }

  return valid;
}

// Create / Update
function handleCarSubmit(e) {
  e.preventDefault();
  const form = e.target;
  clearErrors(form);

  if (!validateCarForm(form)) return;

  // Поля из формы (цена и места приводим к числам)
  const data = {
    name: document.getElementById("carName").value.trim(),
    category: document.getElementById("carCategory").value,
    pricePerDay: Number(document.getElementById("carPrice").value),
    seats: Number(document.getElementById("carSeats").value),
    image: document.getElementById("carImage").value.trim(),
    description: document.getElementById("carDescription").value.trim(),
    features: document
      .getElementById("carFeatures")
      .value.split(",")
      .map((f) => f.trim())
      .filter((f) => f),
  };

  const cars = getCars();
  const editId = Number(document.getElementById("carId").value);
  const message = document.getElementById("carMessage");

  if (editId) {
    // Update: меняем только поля формы, id и rating остаются прежними
    const car = cars.find((c) => c.id === editId);
    if (!car) {
      resetCarForm();
      return;
    }
    Object.assign(car, data);
    saveCars(cars);
    showMessage(message, "Car \"" + car.name + "\" updated.");
  } else {
    // Create: полный контракт, rating по умолчанию 0
    const newCar = { id: nextId(cars), ...data, rating: 0 };
    cars.push(newCar);
    saveCars(cars);
    showMessage(message, "Car \"" + newCar.name + "\" added.");
  }

  resetCarForm();
  renderCars();
  renderBookings();
  updateCounters();
}

// ===== Машины: Delete =====
function deleteCar(id) {
  if (!confirm("Delete this car?")) return;

  const cars = getCars().filter((c) => c.id !== id);
  saveCars(cars);

  // Если удалили машину, которую сейчас редактируем, сбрасываем форму
  if (Number(document.getElementById("carId").value) === id) {
    resetCarForm();
  }

  showMessage(document.getElementById("carMessage"), "Car deleted.");
  renderCars();
  renderBookings();
  updateCounters();
}

// ===== Брони =====
function renderBookings() {
  const tbody = document.getElementById("bookingsTableBody");
  const wrapper = document.getElementById("bookingsTableWrapper");
  const empty = document.getElementById("noBookings");
  tbody.innerHTML = "";

  const bookings = getBookings();
  if (!bookings.length) {
    wrapper.hidden = true;
    empty.hidden = false;
    return;
  }
  wrapper.hidden = false;
  empty.hidden = true;

  const users = getUsers();

  bookings.forEach((booking) => {
    const user = users.find((u) => u.id === booking.userId);
    const car = getCarById(booking.carId);

    const tr = document.createElement("tr");
    tr.appendChild(createCell("#" + booking.id));
    tr.appendChild(
      createCell(user ? user.firstName + " " + user.lastName : "Deleted user")
    );
    tr.appendChild(createCell(car ? car.name : "Deleted car"));
    tr.appendChild(createCell(booking.pickupDate));
    tr.appendChild(createCell(booking.returnDate));

    const statusTd = document.createElement("td");
    statusTd.appendChild(createStatusBadge(booking.status));
    tr.appendChild(statusTd);

    // Смена статуса: select + Save
    const actionTd = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "table-actions";

    const select = document.createElement("select");
    select.className = "form-input status-select";
    STATUSES.forEach((status) => {
      const option = new Option(status, status);
      option.selected = status === booking.status;
      select.add(option);
    });

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn btn-primary btn-small";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () =>
      saveBookingStatus(booking.id, select.value)
    );

    actions.appendChild(select);
    actions.appendChild(saveBtn);
    actionTd.appendChild(actions);
    tr.appendChild(actionTd);
    tbody.appendChild(tr);
  });
}

// Поиск брони по id, а не по номеру строки
function saveBookingStatus(id, status) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return;

  booking.status = status;
  saveBookings(bookings);

  showMessage(
    document.getElementById("bookingMessage"),
    "Booking #" + id + " status saved: " + status + "."
  );
  renderBookings();
}

// ===== Запуск =====
function initAdmin() {
  requireAdmin();
  // requireAdmin только запускает переход, поэтому проверяем и останавливаемся
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return;

  updateCounters();
  renderUsers();
  renderCars();
  renderBookings();

  document.getElementById("carForm").addEventListener("submit", handleCarSubmit);
  document.getElementById("carCancelBtn").addEventListener("click", resetCarForm);
}

initAdmin();
