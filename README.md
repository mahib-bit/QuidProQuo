# Quid Pro Quo — Client

<p align="center">
  <img src="https://img.shields.io/badge/React-2026-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-Authentication-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/React%20Router-Routing-CA4245?logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel" alt="Vercel" />
</p>

The frontend application for **Quid Pro Quo**, a full-stack platform designed to make lending and exchanging personal belongings easier to manage. Users can explore available items, submit borrowing requests, manage their own listings, and track their borrowing activity.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication and API Requests](#authentication-and-api-requests)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

## Overview

Quid Pro Quo aims to provide a structured way for people to lend, borrow, and exchange items. Instead of relying entirely on informal messages, users can create listings and manage requests through a dedicated interface.

The client communicates with the Quid Pro Quo Express API and uses Firebase Authentication to identify users.

## Features

- **Authentication:** Register, sign in, and sign out using Firebase Authentication.
- **Item listings:** Browse available items and view individual item details.
- **Item management:** Create, edit, and delete personal listings.
- **Item details:** View descriptions, categories, condition, location, and other available item information.
- **Borrowing requests:** Request an item from its owner.
- **My Requests:** View submitted borrowing requests and their statuses.
- **Request management:** Display request information returned by the backend.
- **Protected pages:** Restrict access to selected pages to authenticated users.
- **API integration:** Communicate with the backend through a shared API helper.
- **Responsive interface:** Build an interface suitable for different screen sizes, depending on the implemented page styles.

> Note: The frontend may display or hide controls based on the current user, but the server is responsible for enforcing ownership and authorization.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and production build |
| React Router | Client-side navigation |
| Firebase Authentication | User authentication |
| Fetch API | HTTP communication with the backend |
| Vercel | Frontend deployment |

## Project Structure

The following is a representative structure. Keep the actual folder and file names from your repository.

```text
client/
├── public/
├── src/
│   ├── api/
│   │   └── api.js
│   ├── components/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── firebase/
│   │   └── firebase.innit.js
│   ├── pages/
│   │   ├── Items.jsx
│   │   ├── ItemDetails.jsx
│   │   ├── MyRequests.jsx
│   │   └── ...
│   ├── routes/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vercel.json
```

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm
- Git
- A Firebase project with Authentication configured
- A running Quid Pro Quo backend, locally or deployed

### 1. Clone the repository

```bash
git clone <YOUR_CLIENT_REPOSITORY_URL>
cd <YOUR_CLIENT_FOLDER>
```

Replace the placeholders with your actual repository URL and directory name.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the client root, next to `package.json`.

```env
VITE_API_URL=http://localhost:3000
```

For local development, this points to the Express backend running on port 3000.

### 4. Configure Firebase

Create or select a Firebase project and configure the web application using your project's Firebase configuration.

Ensure the required Firebase Authentication providers are enabled in the Firebase console.

Keep the Firebase web configuration in the appropriate client configuration module. Never place Firebase Admin credentials or the server service-account private key in the client application.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### 6. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Environment Variables

| Variable | Purpose | Local example |
|---|---|---|
| `VITE_API_URL` | Base URL of the Express API | `http://localhost:3000` |

For production, configure `VITE_API_URL` in the client project's Vercel environment variables:

```env
VITE_API_URL=https://YOUR_SERVER_DOMAIN
```

Use your actual deployed server URL and omit the trailing slash if the API helper appends paths directly.

**Important:** Vite exposes variables prefixed with `VITE_` to client-side code. Never store database credentials, Firebase Admin private keys, or other server secrets in these variables.

After changing a Vite environment variable, restart the development server locally or redeploy the application so the new value is included in the build.

## Authentication and API Requests

The client uses Firebase Authentication to identify the signed-in user.

The shared API helper should:

1. Receive the current Firebase user.
2. Obtain a Firebase ID token when the user is authenticated.
3. Add the token to the `Authorization` header as a Bearer token.
4. Send the request to the configured API URL.
5. Return or handle the response and errors appropriately.

Example request:

```javascript
const response = await authenticatedFetch(
    user,
    '/items'
);

if (!response.ok) {
    throw new Error('Failed to fetch items');
}

const items = await response.json();
```

Use the project's existing `authenticatedFetch` implementation and function signature when making requests.

Protected routes improve the user experience by preventing unauthenticated users from opening restricted pages. However, every protected backend operation must independently validate the token and permissions.

## Deployment

### Deploying to Vercel

1. Push the client repository to GitHub.
2. Import the repository into Vercel.
3. Configure the correct project root if the client is inside a monorepo.
4. Set `VITE_API_URL` to the deployed backend URL.
5. Deploy the application.
6. Test authentication, item listing, item details, and borrowing requests.

### SPA routing configuration

For a Vite single-page application, create `vercel.json` in the client root, alongside `package.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This allows frontend routes such as `/items/ITEM_ID` to load when a user directly opens or refreshes the URL. <https://vercel.com/docs/frameworks/frontend/vite>

### Backend CORS

The deployed Express server must allow requests from the deployed client origin. Configure the backend's CORS settings using your actual client domain rather than assuming that local development and production use the same origin.

## Troubleshooting

### API requests fail locally

- Confirm that the backend is running.
- Check `VITE_API_URL` in the client `.env`.
- Inspect the browser Network tab and console.
- Confirm that the requested endpoint exists on the server.

### API requests fail after deployment

- Verify the deployed backend URL.
- Check the Vercel environment variable.
- Confirm that the backend is connected to its cloud database.
- Inspect the server's deployment logs.
- Check the backend CORS configuration.

### Direct item URLs return 404

Confirm that `vercel.json` exists in the client project root and that the latest deployment includes it.

### Authentication works, but protected API calls fail

Check that the API helper sends the Firebase ID token and that the backend verifies it using Firebase Admin.

## Security Notes

- Never commit `.env` files containing secrets.
- Never include Firebase Admin service-account credentials in the client.
- Never trust a client-supplied user ID to determine who owns an item.
- Enforce item ownership and request permissions on the backend.
- Use HTTPS for deployed applications and API communication.

## License

No license has been specified yet. Add a license file if you intend to distribute the project under a particular open-source license.
