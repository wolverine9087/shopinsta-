# ShopInsta 🛍️

**ShopInsta** is a MERN-stack ecommerce platform inspired by Instagram Reels. It allows sellers to showcase their products through short videos, while customers can explore products, discover independent shops, and place orders.

## ✨ Features

* 🔐 **User Authentication** – Register and log in securely using JWT-based authentication.
* 🛍️ **Product Listings** – Browse products with descriptions, prices, images, and categories.
* 🎥 **Product Reels** – Discover products through short promotional videos.
* 🏪 **Seller Accounts** – Create a shop and manage products and reels.
* ❤️ **Save Products** – Save favourite products for later.
* 🛒 **Shopping Cart** – Add products to the cart and manage quantities.
* 📦 **Order Management** – Place orders and track their status.
* 💵 **Cash on Delivery** – Place orders using COD.
* 🔎 **Product Search** – Search and explore products by category and keywords.
* 📱 **Responsive Design** – Browse the platform on mobile, tablet, and desktop.

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary

## 📁 Project Structure

```text
shopinsta/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shopinsta.git
cd shopinsta
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the placeholder values with your own credentials. Never commit your `.env` file.

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🔑 User Roles

### Customer

* Explore products and reels.
* Save favourite products.
* Add products to the shopping cart.
* Place COD orders.
* View their orders.

### Seller

* Set up a shop profile.
* Add and manage products.
* Publish product reels.
* Manage stock and view orders.

## 🔌 API Routes

The backend uses REST API endpoints under `/api`.

| Route             | Purpose                                 |
| ----------------- | --------------------------------------- |
| `/api/auth`       | Registration, login, and authentication |
| `/api/users`      | User profiles and seller registration   |
| `/api/sellers`    | Seller information                      |
| `/api/products`   | Product management                      |
| `/api/reels`      | Product reels                           |
| `/api/orders`     | Order management                        |
| `/api/comments`   | Reel comments                           |
| `/api/categories` | Product categories                      |

## 💳 Payments

ShopInsta currently supports **Cash on Delivery (COD)** for orders. Online payment integration is not included in the current version.

## 🔒 Security

* JWT-based authentication using HTTP-only cookies.
* Role-based access for seller functionality.
* Environment variables for sensitive credentials.
* Server-side validation for incoming requests.

## 🚀 Future Improvements

* Online payment gateway integration.
* Personalized product recommendations.
* Advanced product filtering and sorting.
* Seller analytics dashboard.
* Product reviews and ratings.
* Notifications for order updates.
* Improved video upload and optimization.

## 👨‍💻 Author

**Ayush Kumar Singh**

B.Tech CSE | MERN Stack Developer

## 📄 License

This project is created for learning and portfolio purposes. Add a license if you plan to distribute or reuse it under specific terms.

# shopinsta-
ShopInsta is a MERN-stack ecommerce platform inspired by Instagram Reels, where sellers can showcase products through short videos and customers can discover, explore, and shop for their favourite finds. It features product listings, seller accounts, reels, a shopping cart, and Cash on Delivery (COD) orders, with a responsive interface for mobile 

## Deploy to Render

This repository includes a Render Blueprint in `render.yaml`. In Render, create a new Blueprint and connect this GitHub repository. Render will create the `shopinsta-api` Node web service and the `shopinsta-web` static site.

During setup, provide `MONGO_URI` using a reachable MongoDB Atlas connection string. The Blueprint generates `JWT_SECRET`. Cloudinary values can be left empty if media uploads are not needed; configure all three Cloudinary values to enable uploads. After both services deploy, use the `shopinsta-web` URL to open the app.

The API allows the web site origin through `CLIENT_URL`, and the frontend receives the API URL from the Blueprint. If you rename either service in Render, update the matching service references in `render.yaml`.
