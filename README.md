# DriveGo — Car Rental Website

Web Programming midterm project built with HTML, CSS, and JavaScript. The application uses browser `localStorage` to manage users, cars, bookings, and the current session.

## Run the Project

1. Clone the repository and open the project folder in VS Code.
2. Open `index.html` using Live Server.
3. Use the demo admin account below or register a new user.

## Demo Admin Account

- **Email:** `admin@drivego.com`
- **Password:** `admin123`

## Project Pages

| Page | Purpose |
|---|---|
| `index.html` | Home page |
| `cars.html` | Car catalog, search, and filters |
| `car-details.html` | Details of a selected car |
| `booking.html` | Booking form |
| `confirmation.html` | Booking confirmation |
| `login.html` | User login |
| `register.html` | User registration |
| `profile.html` | User profile and booking history |
| `admin.html` | Admin dashboard and car management |
| `about.html` | Project information |
| `contact.html` | Contact form |

## Shared Data Contract

All pages must use the shared functions in `js/storage.js` to read and save data. Do not access the `users`, `cars`, or `bookings` localStorage keys directly from page scripts.

### Users — `users`

Each user is stored as an object with the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | Number | Unique user ID |
| `firstName` | String | User's first name |
| `lastName` | String | User's last name |
| `email` | String | Unique email address; trim spaces and convert to lowercase |
| `password` | String | Demo password; never display it in the UI |
| `phone` | String | Optional phone number; may be empty |
| `role` | String | `admin` or `user` |

### Cars — `cars`

Each car must follow this structure:

| Field | Type | Description |
|---|---|---|
| `id` | Number | Unique car ID |
| `name` | String | Car name, for example `Toyota Camry` |
| `category` | String | Category used by filters, for example `Sedan`, `SUV`, or `Electric` |
| `pricePerDay` | Number | Rental price per day; must be greater than zero |
| `seats` | Number | Number of seats; must be at least one |
| `rating` | Number | Rating from 1 to 5; use `0` for a car without a rating |
| `image` | String | Relative image path, for example `images/cars/camry.jpg` |
| `description` | String | Description displayed on the car details page |
| `features` | Array of strings | List of car features |

Initial car data is defined in `SEED_CARS` in `js/seed.js`. The data is copied to `localStorage` only when the `cars` key does not exist. If seed data changes during testing, clear the browser's local data and reload the site to initialize it again.

### Bookings — `bookings`

Each booking must follow this structure:

| Field | Type | Description |
|---|---|---|
| `id` | Number | Unique booking ID; create it with `nextId(bookings, 10001)` |
| `userId` | Number | ID of the user who created the booking; references `users[].id` |
| `carId` | Number | ID of the booked car; references `cars[].id` |
| `pickupDate` | String | Pickup date in `YYYY-MM-DD` format |
| `returnDate` | String | Return date in `YYYY-MM-DD` format; must be later than the pickup date |
| `notes` | String | Optional booking notes; may be empty |
| `status` | String | `Pending`, `Confirmed`, or `Cancelled` |

New bookings must use the `Pending` status by default.

### Session — `session`

The `session` key stores the numeric ID of the currently signed-in user. If nobody is signed in, the session can be absent or `null`.

Use these functions from `js/storage.js` to manage the session:

- `getSession()` — get the current session ID.
- `setSession(id)` — set the current user ID.
- `clearSession()` — clear the current session.
- `getCurrentUser()` — get the current user object or `null`.

## Shared Data Rules

1. Use `getUsers()` / `saveUsers(list)`, `getCars()` / `saveCars(list)`, and `getBookings()` / `saveBookings(list)` for data operations.
2. After adding, editing, or deleting an item, save the updated array using the corresponding `save...()` function.
3. Keep IDs numeric and preserve the exact field names defined in this document.
4. Do not add, rename, or change data fields without discussing the change with the team first and updating this contract.
5. A booking may reference a car that was later deleted. The admin table and booking history must handle a missing car gracefully, for example by displaying `Deleted car`.
6. When rendering user-provided names or booking notes, use safe text output such as `textContent` rather than inserting untrusted values with `innerHTML`.
7. Dates must use the `YYYY-MM-DD` format. When validating whether a date is in the past, use the local date rather than relying on UTC date conversion.
8. This is an educational frontend demo. Passwords are stored as plain text in browser storage, so do not use real passwords or sensitive personal data.

## Team

| Member | Responsibility |
|---|---|
| Yerassyl | Authentication, project foundation, shared styles |
| Danaya | Car catalog, seed data, and booking |
| Sabit | Admin panel, user profile, and README maintenance |
