// Initial cars shown in the catalog when the application is opened for the first time.
const SEED_CARS = [
  {
    id: 1,
    name: "Toyota Camry",
    category: "Sedan",
    pricePerDay: 50,
    seats: 5,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80",
    description: "Comfortable sedan for city and long trips.",
    features: ["Automatic", "Air conditioning", "Bluetooth"],
  },
  { id: 2, name: "Honda Civic", category: "Sedan", pricePerDay: 45, seats: 5, rating: 4.4, image: "https://di-uploads-pod1.dealerinspire.com/hondaoflincoln/uploads/2016/11/Honda_Civic_Type_R_Prototype_01-1.jpg", description: "Efficient and easy to drive, ideal for everyday city travel.", features: ["Automatic", "Rear camera", "Apple CarPlay"] },
  { id: 3, name: "Hyundai Tucson", category: "SUV", pricePerDay: 75, seats: 5, rating: 4.7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGei8GNuvLRqbl3M4SUnE5tsisGF72UUlsYHdzZxsWK1eN_oKTryixfYm7&s=10", description: "A versatile SUV with room for passengers, luggage, and weekend plans.", features: ["Automatic", "Cruise control", "Parking sensors"] },
  { id: 4, name: "Kia Sportage", category: "SUV", pricePerDay: 72, seats: 5, rating: 4.6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkpkPJkmCH8XIYIbDydpl_qMRDS9Mx8DjESXJi24ZLgQIXhYR2JnT-TUEX&s=10", description: "Comfortable, modern, and ready for every kind of road.", features: ["Automatic", "Navigation", "Heated seats"] },
  { id: 5, name: "Tesla Model 3", category: "Electric", pricePerDay: 95, seats: 5, rating: 4.8, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80", description: "A quiet electric sedan with responsive performance and smart features.", features: ["Electric", "Autopilot", "Fast charging"] },
  { id: 6, name: "Toyota RAV4", category: "SUV", pricePerDay: 80, seats: 5, rating: 4.7, image: "https://toyota.com.ua/assets/cache_image/var/www/toyotaS/toyota.com.ua/rav4-2026-small_800x948_0fb.png.webp", description: "A dependable SUV for family trips and more luggage.", features: ["Automatic", "All-wheel drive", "Bluetooth"] },
  { id: 7, name: "Chevrolet Camaro", category: "Pony car", pricePerDay: 52, seats: 5, rating: 4.5, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80", description: "An iconic American sports car celebrated for its powerful performance.", features: ["High-Performance V8", "Track-Ready", "Driver-Centric Design"] },
  { id: 8, name: "Ford Mustang", category: "Sports", pricePerDay: 120, seats: 4, rating: 4.9, image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=900&q=80", description: "An iconic sports car for memorable drives and special occasions.", features: ["Automatic", "Convertible", "Premium sound"] },
];
