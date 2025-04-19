# 🚀 CosmicView — Your Portal to the Stars 🌌

**CosmicView** is an immersive, interactive, space-themed web app built with **React**, **Three.js**, and **Tailwind CSS** — a stellar fusion of design and data. It's more than just a UI project; it's a cosmic dashboard packed with real-time satellite tracking, dynamic 3D visualizations, API integrations, and user interactivity. 

Behind the scenes, it handles live geospatial data, fetches content from multiple public APIs, renders 3D globes with orbital arcs, embeds external simulation tools, and offers rich visual feedback — all while maintaining a smooth, modern user experience.

This makes **CosmicView** a **perfect base-level project** for aspiring web developers who want to:

- Learn how to integrate and sync **multiple real-time APIs** (NASA, SpaceX, Stellarium, etc.)
- Work with **React state management** for complex UIs and data handling
- Explore **3D rendering** using Three.js and `react-globe.gl`
- Build an interactive, **responsive frontend** using Tailwind CSS and Framer Motion
- Understand practical applications of astronomy, satellite data, and frontend design

Whether you're into space, data visualization, or just building something breathtaking — CosmicView is the launchpad.


---

## 🌟 Features

### 🌠 Home
- Ambient background music with toggle
- Meteor click effect + animated space visuals
- Galaxy-inspired welcome screen with mission and highlights

### 🛰️ ISS Tracker
- Live ISS position on a 3D globe using `react-globe.gl`
- Realtime coordinates & location name
- Astronauts currently aboard the ISS
- Toggle globe texture / Follow ISS / Live stream link

### 🌌 Star Chart
- Embedded real-time Stellarium Web viewer
- Interactive sky exploration: stars, constellations, planets

### 📆 Space Timeline
- Scrollable parallax space history section
- Events from Sputnik to Artemis II

### 🔭 Telescope Locator
- 3D Earth with clickable observatory markers
- Displays info, images, and geolocation

### 📰 Space News Feed
- Pulls latest articles from `Spaceflight News API`
- Modal viewer with full article links

### 🪐 Solar System Explorer
- Embedded NASA Eyes 3D solar system simulation
- Zoomable, real-time planetary visualization

### 🌑 Mars Rover Gallery
- Curiosity rover photos from NASA Mars API
- Sol-based photo gallery with mission data

### 🚀 Launch Tracker
- Upcoming launches from SpaceX
- Patch images, mission names, details, webcast links

### 🌍 NEO Tracker
- Near-Earth Objects for today via NASA NEO Feed API
- Hazard warnings, distance, size, and approach info

### 📸 APOD Gallery
- NASA Astronomy Picture of the Day
- Date picker, modal viewer, favorites (localStorage)

---

## 🔧 Tech Stack

- **React**
- **Tailwind CSS**
- **Framer Motion**
- **React Router**
- **React Globe GL**
- **Three.js + Drei + Fiber**
- **APIs:** NASA, SpaceX, Open Notify, Stellarium, Spaceflight News

---

## 🌐 Public APIs Used

All APIs in this project are **free and publicly available**, no secret or private keys are used.

| API                  | Description                                  | Link |
|----------------------|----------------------------------------------|------|
| NASA APOD / Mars / NEO | Astronomy images, rover data, and NEOs     | [NASA API](https://api.nasa.gov/) |
| SpaceX API           | Launch data and mission details              | [SpaceX API](https://github.com/r-spacex/SpaceX-API) |
| Open Notify          | ISS position and astronauts onboard          | [Open Notify](http://open-notify.org/) |
| Stellarium Web       | Real-time star chart iframe                  | [Stellarium](https://stellarium-web.org/) |
| Spaceflight News     | Latest space-related articles                | [Spaceflight News](https://spaceflightnewsapi.net/) |

> 🔐 These APIs do not require authentication beyond a basic `NASA_API_KEY`, which is safe to expose in frontend apps.

---

## ❤️ Credits

- Powered by **[NASA](https://api.nasa.gov/)**, **[SpaceX](https://github.com/r-spacex/SpaceX-API)**, and **[Stellarium Web](https://stellarium-web.org/)**
- Icons by **[FontAwesome](https://fontawesome.com/)**
- 3D Globe via **[react-globe.gl](https://github.com/vasturiano/react-globe.gl)** and **[Three.js](https://threejs.org/)**
- Styled with **[Tailwind CSS](https://tailwindcss.com/)** & animated using **[Framer Motion](https://www.framer.com/motion/)**

---

## 🛸 License

**MIT** — Free to use, remix, and explore the universe!

   
