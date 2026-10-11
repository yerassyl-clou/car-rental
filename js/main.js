// Создаёт HTML-элемент, задаёт ему класс и безопасно добавляет текст.
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

// Создаёт изображение машины. Если фото не загрузилось, вместо него покажется логотип.
function createCarImage(car, className) {
  const image = document.createElement("img");
  image.className = className;
  image.alt = car.name;
  image.src = car.image;
  image.addEventListener("error", () => {
    image.src = "images/logo.svg";
  }, { once: true });
  return image;
}

// Показывает рейтинг машины или подпись, если рейтинг ещё не задан.
function formatRating(rating) {
  return Number(rating) > 0 ? `★ ${Number(rating).toFixed(1)}` : "No rating";
}

// Показывает информационный блок и, при необходимости, кнопку-ссылку.
function showNotice(container, title, message, linkHref, linkText) {
  const panel = createElement("section", "info-panel");
  panel.append(createElement("h1", "", title), createElement("p", "", message));
  if (linkHref) {
    const link = createElement("a", "btn btn-primary", linkText);
    link.href = linkHref;
    panel.append(link);
  }
  container.replaceChildren(panel);
}

// На главной странице приветствует пользователя, если он вошёл в аккаунт.
function initHomePage() {
  const welcome = document.getElementById("welcomeMessage");
  const user = getCurrentUser();
  if (!welcome || !user) return;
  welcome.textContent = `Welcome back, ${user.firstName}! Your next journey starts here.`;
  welcome.hidden = false;
}

// Строит карточки машин для каталога или показывает сообщение, если результатов нет.
function renderCars(cars) {
  const grid = document.getElementById("carsGrid");
  const count = document.getElementById("resultsCount");
  if (!grid || !count) return;
  count.textContent = `${cars.length} car${cars.length === 1 ? "" : "s"} available`;
  grid.replaceChildren();
  if (!cars.length) {
    const empty = createElement("div", "empty-state");
    empty.append(createElement("h2", "", "No cars found"), createElement("p", "", "Try changing your search or filters."));
    grid.append(empty);
    return;
  }
  cars.forEach((car) => {
    const card = createElement("article", "card");
    const body = createElement("div", "card-body");
    const title = createElement("h3", "", car.name);
    const meta = createElement("p", "card-meta", `${car.category} · ${car.seats} seats`);
    const rating = createElement("p", "rating", formatRating(car.rating));
    const actions = createElement("div", "card-actions");
    const price = createElement("span", "price", `$${car.pricePerDay} / day`);
    const link = createElement("a", "btn btn-primary", "View details");
    link.href = `car-details.html?id=${car.id}`;
    actions.append(price, link);
    body.append(title, meta, rating, actions);
    card.append(createCarImage(car, ""), body);
    grid.append(card);
  });
}

// Настраивает поиск и фильтры каталога и обновляет список при изменении полей.
function initCarsPage() {
  const search = document.getElementById("searchInput");
  const category = document.getElementById("categoryFilter");
  const price = document.getElementById("priceFilter");
  const button = document.getElementById("searchBtn");
  if (!search || !category || !price || !button) return;

  [...new Set(getCars().map((car) => car.category))].sort().forEach((name) => {
    const option = createElement("option", "", name);
    option.value = name;
    category.append(option);
  });

  const applyFilters = () => {
    const query = search.value.trim().toLowerCase();
    const maximum = Number(price.value);
    const cars = getCars().filter((car) => {
      const matchesSearch = car.name.toLowerCase().includes(query);
      const matchesCategory = category.value === "All" || car.category === category.value;
      const matchesPrice = maximum === 0 || Number(car.pricePerDay) <= maximum;
      return matchesSearch && matchesCategory && matchesPrice;
    });
    renderCars(cars);
  };

  [search, category, price].forEach((input) => input.addEventListener("input", applyFilters));
  button.addEventListener("click", applyFilters);
  applyFilters();
}

// Находит машину по параметру id в адресе и выводит её описание и характеристики.
function initCarDetailsPage() {
  const container = document.getElementById("carDetails");
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const car = getCarById(id);
  if (!car) {
    showNotice(container, "Car not found", "This car is unavailable or the link is incorrect.", "cars.html", "Back to cars");
    return;
  }
  const layout = createElement("section", "details-layout");
  const content = createElement("div", "details-content");
  const category = createElement("p", "details-category", `${car.category} · ${car.seats} seats · ${formatRating(car.rating)}`);
  const featuresTitle = createElement("h2", "", "Features");
  const features = createElement("ul", "features-list");
  car.features.forEach((feature) => features.append(createElement("li", "", feature)));
  const price = createElement("p", "details-price");
  price.append("Daily price: ", createElement("span", "price", `$${car.pricePerDay} / day`));
  const booking = createElement("a", "btn btn-primary", "Book now");
  booking.href = `booking.html?carId=${car.id}`;
  content.append(createElement("h1", "", car.name), category, createElement("p", "", car.description), featuresTitle, features, price, booking);
  layout.append(createCarImage(car, "details-image"), content);
  container.replaceChildren(layout);
}

// Возвращает сегодняшнюю дату по местному времени в формате ГГГГ-ММ-ДД.
function todayLocal() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Считает количество дней аренды и примерную стоимость выбранных дат.
function calculateTotal(car, pickup, returnDate) {
  if (!pickup || !returnDate || returnDate <= pickup) return null;
  const days = Math.round((new Date(`${returnDate}T00:00:00`) - new Date(`${pickup}T00:00:00`)) / 86400000);
  return { days, total: days * Number(car.pricePerDay) };
}

// Проверяет вход пользователя, показывает форму и сохраняет новую бронь.
function initBookingPage() {
  requireLogin();
  const user = getCurrentUser();
  const container = document.getElementById("bookingContent");
  if (!user || !container) return;
  const car = getCarById(new URLSearchParams(window.location.search).get("carId"));
  if (!car) {
    showNotice(container, "Car not found", "Choose an available car before starting your booking.", "cars.html", "Browse cars");
    return;
  }

  const title = createElement("div", "page-intro");
  title.append(createElement("p", "eyebrow", "Reserve your ride"), createElement("h1", "", "Complete your booking"), createElement("p", "", "Select your dates and we will save your booking as pending."));
  const layout = createElement("section", "booking-layout");
  const summary = createElement("aside", "booking-summary");
  summary.append(createCarImage(car, ""), createElement("h2", "", car.name), createElement("p", "", `${car.category} · ${car.seats} seats`), createElement("p", "price", `$${car.pricePerDay} / day`));
  const form = createElement("form", "form-box booking-form");
  form.id = "bookingForm";
  form.noValidate = true;
  form.append(createElement("h2", "", "Booking details"));
  const pickupGroup = createElement("div", "form-group");
  const pickupLabel = createElement("label", "", "Pickup date"); pickupLabel.htmlFor = "pickupDate";
  const pickup = createElement("input", "form-input"); pickup.id = "pickupDate"; pickup.type = "date"; pickup.min = todayLocal();
  pickupGroup.append(pickupLabel, pickup);
  const returnGroup = createElement("div", "form-group");
  const returnLabel = createElement("label", "", "Return date"); returnLabel.htmlFor = "returnDate";
  const returnDate = createElement("input", "form-input"); returnDate.id = "returnDate"; returnDate.type = "date"; returnDate.min = todayLocal();
  returnGroup.append(returnLabel, returnDate);
  const notesGroup = createElement("div", "form-group");
  const notesLabel = createElement("label", "", "Notes (optional)"); notesLabel.htmlFor = "bookingNotes";
  const notes = createElement("textarea", "form-input"); notes.id = "bookingNotes"; notes.rows = 4; notes.placeholder = "Add pickup preferences or questions";
  notesGroup.append(notesLabel, notes);
  const estimate = createElement("p", "total-estimate", "Choose dates to see your estimate."); estimate.id = "totalEstimate";
  const submit = createElement("button", "btn btn-primary btn-block", "Confirm booking"); submit.type = "submit";
  form.append(pickupGroup, returnGroup, notesGroup, estimate, submit);
  layout.append(summary, form);
  container.replaceChildren(title, layout);

  // Пересчитывает примерную стоимость при изменении даты получения или возврата.
  const updateEstimate = () => {
    const estimateData = calculateTotal(car, pickup.value, returnDate.value);
    estimate.textContent = estimateData ? `${estimateData.days} day${estimateData.days === 1 ? "" : "s"} · Estimated total: $${estimateData.total}` : "Choose dates to see your estimate.";
  };
  pickup.addEventListener("input", updateEstimate);
  returnDate.addEventListener("input", updateEstimate);
  // Проверяет даты, сохраняет бронь и открывает страницу подтверждения.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);
    let valid = true;
    const today = todayLocal();
    if (isEmpty(pickup.value)) { showError(pickup, "Please select a pickup date."); valid = false; }
    else if (pickup.value < today) { showError(pickup, "Pickup date cannot be in the past."); valid = false; }
    if (isEmpty(returnDate.value)) { showError(returnDate, "Please select a return date."); valid = false; }
    else if (pickup.value && returnDate.value <= pickup.value) { showError(returnDate, "Return date must be at least one day after pickup."); valid = false; }
    if (!valid) return;
    const bookings = getBookings();
    const booking = { id: nextId(bookings, 10001), userId: user.id, carId: car.id, pickupDate: pickup.value, returnDate: returnDate.value, notes: notes.value.trim(), status: "Pending" };
    bookings.push(booking);
    saveBookings(bookings);
    window.location.href = `confirmation.html?id=${booking.id}`;
  });
}

// Проверяет доступ к брони и показывает её данные на странице подтверждения.
function initConfirmationPage() {
  requireLogin();
  const user = getCurrentUser();
  const container = document.getElementById("confirmationContent");
  if (!user || !container) return;
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const booking = getBookings().find((item) => item.id === id);
  if (!booking || (booking.userId !== user.id && user.role !== "admin")) {
    showNotice(container, "Booking not found", "We could not find a booking you are allowed to view.", "cars.html", "Browse cars");
    return;
  }
  const car = getCarById(booking.carId);
  const card = createElement("section", "confirmation-card");
  const success = createElement("p", "success", "✓ Your booking is confirmed!");
  const details = createElement("div", "booking-details");
  [["Car", car ? car.name : "Deleted car"], ["Pickup", booking.pickupDate], ["Return", booking.returnDate], ["Status", booking.status]].forEach(([label, value]) => {
    const row = createElement("div", "");
    row.append(createElement("span", "", label), createElement("strong", label === "Status" ? "status-badge" : "", value));
    details.append(row);
  });
  const link = createElement("a", "btn btn-primary", "View my bookings"); link.href = "profile.html";
  card.append(success, createElement("h1", "", "Thank you for choosing DriveGo"), createElement("p", "booking-id", `Booking #${booking.id}`), details, link);
  container.replaceChildren(card);
}

// Запускает только ту логику, которая относится к текущей странице сайта.
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "index") initHomePage();
  if (page === "cars") initCarsPage();
  if (page === "car-details") initCarDetailsPage();
  if (page === "booking") initBookingPage();
  if (page === "confirmation") initConfirmationPage();
});
