# Google OAuth App 🔐

This repository contains my work for the **Project and Portfolio III** course at **Full Sail University**.  
The objective is to create a **Full-Stack Web app** with _clean code_, _seperation of concerns_, and properly
implement **Google OAuth** _[(documentation)](https://support.google.com/cloud/answer/15544987?hl=en)_, without the use of
3rd party libraries like _passport_.

> Last Updated: February 18, 2025. This README.md file is a work-in-progress and will be incrementally updated as I update the app.

---

## 📝 Project Overview

- Clean user-friendly UI/UX
- Search artists, albums, tracks
- Uses Google OAuth
- Frontend + backend separated
- JWT-based authentication flow
- User authentication (Login / Logout / Protected Routes)

---

## 🙏 Giving Credit

- **[React: Authentication](https://www.linkedin.com/learning/react-authentication-25660373/)** - A LinkedIn Learning course by **[Shaun Wassell](https://www.linkedin.com/in/shaun-wassell)** served as the MAJOR foundation for learning and implementing Google OAuth.
- **[Google APIs Node.js Client](https://www.npmjs.com/package/googleapis)** is the official library for using Google APIs, created and maintained by Google themselves, and much of its documentation and **[Sample Code](https://github.com/googleapis/google-api-nodejs-client/tree/main/samples)** helped this project go beyond Wassell's course.
- **[Login UI inspiration](https://www.figma.com/community/file/1026170425902325131/loginuiconcept)** is from a public Figma design by **[Leo Barreto](https://www.figma.com/@LeoBarreto)**.
- **[Homepage UI/UX inspiration](https://ndstudio.gov/)** is from the USA government's **National Design Studio**. I absolutely love everything they're doing.

---

## 🕹️ Tech Stack (MERN TypeScript)

> Note: for a complete list of all packages/libaries used please see the **package.json** files.

<p style="font-size: 1.25rem; font-weight: bold; color: pink">
Server (backend):
</p>

- Node.js
- Express.js
- Mongoose
- GoogleAPIs
- jsonwebtoken

<p style="font-size: 1.25rem; font-weight: bold; color: lightblue;">
Client (frontend):
</p>

- Vite + React.js
- Tailwind CSS
- shadCN/UI

---

## ⚠️ Local Install Prerequisites

- Node.js >= v24.13.0 (LTS)
- npm
- git
- Modern Web Browser (Google Chrome or Chrome derivative recommended)
- [Google developer account](https://support.google.com/cloud/answer/15544987?hl=en)
- .env file (follow the .env.example)
- [MongoDB](https://www.mongodb.com/products/tools/compass) - **Optional** if you'd like to create and test your own personal data you can install MongoDB to your local machine

---

## 🚀 Getting Started

1. Open your **Terminal** and **Clone** the project to your machine

```bash
git clone https://github.com/hereisphil/google-oauth-app.git
```

<p style="font-size: 1.25rem; font-weight: bold; color: pink">
Server (backend):
</p>

2. Run `cd google-oauth-app` and then `cd server`

3. Create a `.env` file from the `.env.example` and add **Needed Variables**

4. Install the needed packages: `npm install`

5. Run the server: `npm run dev`

<p style="font-size: 1.25rem; font-weight: bold; color: lightblue;">
Client (frontend):
</p>

6. Open another terminal and `cd` into `/clent`

7. Create a `.env` file from the `.env.example` and add **Needed Variables**

8. Install the needed packages: `npm install`

9. Start the client: `npm run dev`

10. Open a web browser & Go to <http://localhost:5173> & TEST 🎉

---

## 🔗 Links

### **Backend (Node.js / Express)**

**Base URL:** `http://localhost:3001`

| Route                                                                               | Description                                              |
| :---------------------------------------------------------------------------------- | :------------------------------------------------------- |
| [`/api/v1`](http://localhost:3001/api/v1)                                           | Health check to ensure API routes are working.           |
| [`/api/v1/auth/google/url`](http://localhost:3001/api/v1/auth/google/url)           | Retrieves Google OAuth login URL to use on the frontend. |
| [`/api/v1/auth/google/callback`](http://localhost:3001/api/v1/auth/google/callback) | Expects `?code=` from Google and sets JWT on frontend.   |

---

### **Frontend (React Client)**

**Base URL:** `http://localhost:5173`

| Route                                           | Description                                                                   |
| :---------------------------------------------- | :---------------------------------------------------------------------------- |
| [`/login`](http://localhost:5173/login)         | Login page; `useEffect` calls backend to enable **Login with Google** button. |
| [`/user-info`](http://localhost:5173/user-info) | **Protected Route**; accessible only after a user logs in.                    |

---

## 👋 Author

Hi! I’m Phillip Cantu, a current [Full Sail University](https://www.fullsail.edu/) web development student, _expected graduation February 2027_, and a [4Geeks Academy Full Stack](https://www.phillipcantu.com/certificate.pdf) bootcamp graduate.

- **GitHub:** [hereisphil](https://github.com/hereisphil)
- **LinkedIn:** [phillipcantu](https://www.linkedin.com/in/phillipcantu/)
- **Email:** [thereisphil@gmail.com](mailto:thereisphil@gmail.com)
