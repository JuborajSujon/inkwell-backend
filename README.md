# Stationery Shop Application

## Overview

The Stationery Shop Application is a web-based API built with Node.js, Express, TypeScript, and MongoDB using Mongoose. It manages stationery products and orders, offering robust CRUD functionality and additional inventory management features.

---

## Features

### Stationery Products Management

1. **Create Products:** Add new stationery products with details like name, brand, price, category, description, quantity, and stock status.
2. **View Products:** Retrieve all products or filter by name, brand, or category using query parameters.
3. **View Product by ID:** Fetch detailed information about a specific product.
4. **Update Products:** Modify product details such as price, quantity, or description.
5. **Delete Products:** Remove products from the database.

### Order Management

1. **Place Orders:** Create orders by specifying customer email, product ID, quantity, and total price.

- Automatically updates inventory and stock status.
- Handles insufficient stock with appropriate error messages.

2. **Calculate Revenue:** Aggregates total revenue from all orders using MongoDB's aggregation pipeline.

## Error Handling

- **Validation Errors:** Returns detailed validation messages for invalid inputs.
- **404 Not Found:** Proper handling for nonexistent products or orders.
- **Generic Errors:** Provides descriptive error messages with stack traces for easier debugging.

---

## Technologies Used

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB (via Mongoose)
- **Programming Language:** TypeScript
- **Validation:** Mongoose schema validation
- **API Documentation:** RESTful API

---

## Project Setup

### Prerequisites

Ensure you have the following dependencies installed:

- Node.js (v14 or above)
- npm (v6 or above)
- MongoDB (local or cloud-based)

---

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JuborajSujon/stationery-shop
```

2. Navigate to the project directory:

```bash
cd stationery-shop
```

3. Install dependencies:

```bash
npm install
```

4. Environment Variables Create a .env file in the root directory and add the following:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/stationery-shop
```

5. Run the Application Start the server in development mode:

```bash
npm run build
```

6. Run the Application Start the server in development mode:

```bash
npm run start:dev
```

For production:

```bash
npm run start
```

7. API Testing Use tools like Postman or cURL to test the following endpoints.

---

## API Endpoints

### Stationery Products

| Method | Endpoint                          | Description                                                |
| :----- | :-------------------------------- | :--------------------------------------------------------- |
| POST   | /api/products                     | Create a new product.                                      |
| GET    | /api/products                     | Get all products.                                          |
| GET    | /api/products?searchTerm=category | Get all products.(searchTerm can be name, brand, category) |
| GET    | /api/products/:id                 | Get a specific product.                                    |
| PUT    | /api/products/:id                 | Update a product.                                          |
| DELETE | /api/products/:id                 | Delete a product.                                          |

### Order Management

| Method | Endpoint            | Description        |
| :----- | :------------------ | :----------------- |
| Post   | /api/orders         | Place a new order. |
| Get    | /api/orders/revenue | Get total revenue. |

---

## Contributing

1. Fork the repository.
2. Create a branch for your feature or bug fix.

```bash
git checkout -b my-feature
```

3. Commit changes and push to your branch.

```bash
git add .
git commit -m "Add feature or fix bug"
git push origin my-feature
```

4. Create a pull request and assign it to the main branch.
5. Wait for the review and merge.

---

## License

This project is licensed under the ISC License.
