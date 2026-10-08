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

## Team

- Yerassyl: auth, base, styles
- Danaya: catalog and booking
- Sabit: admin and profile
