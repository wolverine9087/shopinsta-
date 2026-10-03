# ShopInsta Backend

## Environment setup

Create a local `.env` file in this `backend` directory by copying `.env.example`, then set the values below. The `.env` file is ignored by Git.

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string. The server exits if it cannot connect. |
| `JWT_SECRET` | Yes | Secret used to sign and verify login tokens. Use a long, random value. |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary cloud name for image and video uploads. |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary API secret. |
| `PORT` | No | HTTP port; defaults to `5000`. |
| `CLIENT_URL` | No | Exact frontend origin allowed by credentialed CORS; defaults to `https://shopinsta-frontend.onrender.com`. |
| `NODE_ENV` | No | Set to `production` in deployment to enable secure, cross-site auth cookies. Use `development` locally. |

For production, set `MONGO_URI` to the connection URI supplied by MongoDB Atlas. Cloudinary variables are only needed when using media upload endpoints, but all three should be configured together.

Seller media forms accept local files: products support up to five images (5 MB each), and reels accept one video (50 MB) plus an optional thumbnail image (5 MB). The backend uploads these files to Cloudinary and saves the resulting URLs.

Start the backend from this directory with `npm run dev` (development) or `npm start`.
