# Inkwell Backend

## Overview

The Stationery Shop Application is a web-based API built with Node.js, Express, TypeScript, and MongoDB using Mongoose. It manages stationery users, products, cart and orders, offering robust CRUD functionality and additional inventory management features.

---

## Features

- Express.js for building web servers and APIs
- TypeScript for type safety and maintainability
- Mongoose for MongoDB interaction
- Zod for schema validation
- JSON Web Tokens (JWT) for secure authentication
- Prettier and ESLint for code formatting and linting
- Development and production environments
- Error handling and logging

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
git clone https://github.com/JuborajSujon/inkwell-backend
```

2. Navigate to the project directory:

```bash
cd inkwell-backend
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
BCRYPT_SALT_ROUNDS=8
JWT_ACCESS_SECRET= your-very-secure-jwt-secret
JWT_REFRESH_SECRET= your-very-secure-refresh-token-secret
JWT_ACCESS_EXPIRES_IN=10d
JWT_REFRESH_EXPIRES_IN=365d
RESET_PASSWORD_UI_LINK=http://localhost:5000 (your-client-home-url)

SP_ENDPOINT=https://sandbox.shurjopayment.com
SP_USERNAME=sp_sandbox
SP_PASSWORD=pyyk97hu&6u6
SP_PREFIX=SP
SP_RETURN_URL=http://localhost:5173/dashboard/orders/verify-order (replace with your-client-home-url)
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

## Dependencies

### Core Dependencies

- [axios](https://www.npmjs.com/package/axios)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [joi](https://www.npmjs.com/package/joi)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [zod](https://www.npmjs.com/package/zod)

### Development Dependencies

- [TypeScript](https://www.npmjs.com/package/typescript)
- [ESLint](https://www.npmjs.com/package/eslint)
- [Prettier](https://www.npmjs.com/package/prettier)
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev)

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

## Contact

If you have any questions or suggestions, feel free to reach out:

- **Email**: mdSujon72@gmail.com
- **GitHub**: [Juboraj Sujon](https://github.com/JuborajSujon)

---

### Happy Coding! ✨
