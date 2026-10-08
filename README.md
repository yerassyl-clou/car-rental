# DriveGo: Car Rental Website

Web Programming midterm project.

## Run

Open `index.html` (or use VS Code Live Server).

## Admin account

admin@drivego.com / admin123

## Data contract (localStorage)

| Key      | Fields                                                                                 |
| -------- | -------------------------------------------------------------------------------------- |
| users    | id, firstName, lastName, email, password, phone, role (user/admin)                     |
| cars     | id, name, category, pricePerDay, seats, rating, image, description, features[]         |
| bookings | id, userId, carId, pickupDate, returnDate, notes, status (Pending/Confirmed/Cancelled) |
| session  | id of the current user                                                                 |

Dates are stored as `YYYY-MM-DD`. Booking ids start at 10001.
Use the functions from `js/storage.js`, never `localStorage` directly.

## Rules

- **Do not push directly to main**: all feature work should be done in feature branches
- **Each team member edits only their own `<main>` content and their assigned files**
- **All data operations must use functions from `js/storage.js`**: never access `localStorage` directly
- **Data contract changes must be agreed upon with the team** before implementation

## Page-specific JavaScript

`main.js` is loaded on 5 pages (index, cars, car-details, booking, confirmation). To prevent conflicts, wrap page-specific code in conditionals:

```javascript
if (document.body.dataset.page === 'cars') {
  // cars page code
}

if (document.body.dataset.page === 'booking') {
  // booking page code
}
```

## Testing tips

- **Login as admin**: In the browser console, run `setSession(1)` then refresh
- **Clear data after seed changes**: Run `localStorage.clear()` in console, then refresh
- **Check current user**: Run `getCurrentUser()` in console

## Security note

**This is a learning project.** Passwords are stored in plain text in localStorage. This would never be acceptable in a production application.

## Team

- Yerassyl: auth, base, styles
- Danaya: catalog and booking
- Sabit: admin and profile
