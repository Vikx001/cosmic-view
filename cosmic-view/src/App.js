import React, { useState, useEffect, useRef, forwardRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Globe from "react-globe.gl";
import { FaMeteor, FaRulerCombined, FaExclamationTriangle ,FaGlobeAmericas} from "react-icons/fa";
import { FaRocket, FaSatellite, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { FaBars, FaTimes } from "react-icons/fa";

import { FaSatelliteDish, FaUserAstronaut, FaMapMarkedAlt, FaExpand, FaGlobe, FaLockOpen, FaVideo } from "react-icons/fa";
import "./styles/global.css";

// ------------------------------------------------------
// 1) Global Starfield Background
// ------------------------------------------------------
const StarryBackground = () => (
  <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:20px_20px] animate-pulse" />
);

// ------------------------------------------------------
// 2) Navbar with Route Links
// ------------------------------------------------------
const routes = [
  { path: "/", label: "Home" },
  { path: "/apod", label: "APOD" },
  { path: "/launches", label: "Launches" },
  { path: "/iss", label: "ISS" },
  { path: "/starchart", label: "Star Chart" },
  { path: "/timeline", label: "Timeline" },
  { path: "/telescopes", label: "Telescopes" },
  { path: "/news", label: "News" },
  { path: "/neo", label: "NEO" },
  { path: "/mars", label: "Mars" },
  { path: "/solarsystem", label: "Solar System" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollTop(scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 w-full z-50 bg-black/60 backdrop-blur-sm border-b border-gray-800 px-4 py-3 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.h1
          className="text-2xl font-extrabold tracking-widest text-white"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          COSMICVIEW
        </motion.h1>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-4 text-sm">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="text-white hover:text-cyan-300 transition relative group"
            >
              {route.label}
              <span className="block h-0.5 bg-cyan-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-2 px-4"
          >
            <ul className="flex flex-col gap-3 pb-2">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-cyan-400 border-b border-gray-700 pb-2"
                >
                  {route.label}
                </Link>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};



// ------------------------------------------------------
// 3) Launch Countdown Widget (Draggable)
// ------------------------------------------------------
const LaunchCountdownWidget = () => {
  const [nextLaunchDate, setNextLaunchDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchNextLaunch = async () => {
      try {
        const res = await fetch("https://api.spacexdata.com/v4/launches/upcoming");
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;
        const sorted = data.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
        setNextLaunchDate(sorted[0].date_utc);
      } catch (err) {
        console.error("Failed to fetch next launch", err);
      }
    };
    fetchNextLaunch();
  }, []);

  useEffect(() => {
    if (!nextLaunchDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const launchTime = new Date(nextLaunchDate).getTime();
      const diff = launchTime - now;

      if (diff <= 0) {
        setTimeLeft("Launch is happening now!");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextLaunchDate]);

  if (!nextLaunchDate) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute top-20 right-5 bg-gray-800 p-3 rounded shadow-md z-20 text-sm cursor-move"
    >
      <p className="mb-1 font-semibold text-blue-400">Next Launch Countdown:</p>
      <p className="text-gray-300">{timeLeft}</p>
    </motion.div>
  );
};

// ------------------------------------------------------
// 4) Home Page
// ------------------------------------------------------
const Home = () => {
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const [meteors, setMeteors] = useState([]);

  const toggleSound = () => {
    setSoundOn((prev) => !prev);
    if (audioRef.current) {
      if (!soundOn) audioRef.current.play();
      else audioRef.current.pause();
    }
  };

  const spawnMeteor = (e) => {
    const id = Math.random().toString(36).slice(2);
    setMeteors((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setMeteors((prev) => prev.filter((m) => m.id !== id));
    }, 2000);
  };

  return (
    <div onClick={spawnMeteor} className="relative">
      <audio
        ref={audioRef}
        src="https://pixabay.com/music/main-title-interstellar-space-travel-141121/"
        type="audio/mpeg"
        preload="auto"
        loop
      />
      {meteors.map((m) => (
        <div
          key={m.id}
          className="pointer-events-none absolute w-2 h-2 bg-white rounded-full animate-meteor"
          style={{ left: m.x, top: m.y }}
        />
      ))}

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-center px-4 overflow-hidden"
        style={{ backgroundImage: "url('https://www.nasa.gov/wp-content/uploads/2025/02/hubble-leda1313424-stsci-01jjadtmj80r1r4w6kk563rw2c.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />

        {/* Dots & Lines Background */}
        <div className="absolute inset-0 z-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {[...Array(30)].map((_, i) => {
              const x1 = Math.random() * window.innerWidth;
              const y1 = Math.random() * window.innerHeight;
              const x2 = x1 + Math.random() * 100 - 50;
              const y2 = y1 + Math.random() * 100 - 50;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="cyan" strokeWidth="0.5" strokeOpacity="0.3" />;
            })}
          </svg>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-6xl sm:text-7xl font-extrabold tracking-widest mb-4 text-white drop-shadow-[0_0_30px_rgba(0,255,255,1)] relative"
          >
            WELCOME TO COSMICVIEW
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 animate-pulse">
              <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
              <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
              <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white max-w-3xl text-lg sm:text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          >
            Dive into the depths of the universe with real-time data, interactive visualizations, and galactic insights.
          </motion.p>
          <button
            onClick={toggleSound}
            className="mt-6 flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-full text-sm shadow-md"
          >
            {soundOn ? <FaVolumeMute /> : <FaVolumeUp />} {soundOn ? "Stop Ambient" : "Play Ambient"}
          </button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="h-screen flex items-center justify-center bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('https://www.nasa.gov/wp-content/uploads/2024/11/iss072e097437orig.jpg')" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="p-8 bg-black bg-opacity-60 rounded-xl max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">🌌 Our Mission</h2>
          <p className="text-gray-300">
            To bring the universe closer—experience orbital data, explore cosmic events, and visualize planets, satellites, and near-Earth objects like never before.
          </p>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-10 text-center">
        <motion.h3
          className="text-xl font-semibold mb-8 text-blue-300 tracking-wider uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Features at a Glance
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            { icon: <FaRocket />, title: "Live Launch Tracker" },
            { icon: <FaSatellite />, title: "ISS Orbit Visualizer" },
            { icon: <FaGlobeAmericas />, title: "Solar System Explorer" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-700"
            >
              <div className="text-4xl text-cyan-400 mb-4">{feature.icon}</div>
              <h4 className="text-lg font-medium text-white tracking-wide">{feature.title}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ------------------------------------------------------
// 5) Footer
// ------------------------------------------------------
const Footer = () => (
  <footer className="text-center py-6 border-t border-gray-800 text-sm text-gray-500">
    Powered by NASA & SpaceX APIs | Designed with love for space nerds 🚀
  </footer>
);

// ------------------------------------------------------
// 6) Space Timeline
// ------------------------------------------------------
const SpaceTimeline = () => {
  const [events] = useState([
    {
      date: "1957-10-04",
      title: "Sputnik 1 Launched",
      description:
        "The Soviet Union launched the first artificial satellite, marking the dawn of the space age.",
      details:
        "Sputnik 1 orbited Earth every 96 minutes, paving the way for future satellite technology.",
      image:
        "https://www.nasa.gov/sites/default/files/thumbnails/image/sputnik_1_launch.jpg",
    },
    {
      date: "1969-07-20",
      title: "Apollo 11 Moon Landing",
      description:
        "Apollo 11 landed on the Moon, marking a giant leap for mankind.",
      details:
        "Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface.",
      image:
        "https://www.nasa.gov/sites/default/files/thumbnails/image/apollo_11_moon_landing.jpg",
    },
    {
      date: "1998-11-20",
      title: "International Space Station",
      description:
        "The ISS began assembly in low Earth orbit, symbolizing international collaboration in space.",
      details:
        "The station has hosted astronauts from around the globe, advancing scientific research.",
      image:
        "https://www.nasa.gov/sites/default/files/thumbnails/image/iss_overview.jpg",
    },
    {
      date: "2021-09-15",
      title: "Inspiration4 Launch",
      description:
        "The first all-civilian orbital spaceflight expanded access to space for non-professionals.",
      details:
        "Led by Jared Isaacman, this mission set a new milestone in commercial space travel.",
      image:
        "https://www.nasa.gov/sites/default/files/thumbnails/image/inspiration4_launch.jpg",
    },
    {
      date: "2024-11-15",
      title: "Artemis II (Planned)",
      description:
        "NASA’s Artemis II will be the first crewed mission around the Moon in decades.",
      details:
        "Set to test Orion’s capabilities, this mission is key to returning humans to the lunar surface.",
      image:
        "https://www.nasa.gov/sites/default/files/thumbnails/image/artemis_ii_crew.jpg",
    },
  ]);

  return (
    <div className="relative w-full h-auto">
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2
          className="text-3xl font-bold mb-3 tracking-wide"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Historic & Future Space Events
        </h2>
        <p className="text-gray-400">
          Scroll down to traverse time and witness milestones in space exploration.
        </p>
      </motion.div>
      {events.map((event, index) => (
        <ParallaxEventSection
          key={index}
          event={event}
          index={index}
          totalEvents={events.length}
        />
      ))}
    </div>
  );
};

const ParallaxEventSection = ({ event, index, totalEvents }) => {
  const isLast = index === totalEvents - 1;
  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${event.image})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 mix-blend-overlay" />
      <motion.div
        className="relative z-10 max-w-3xl p-8 bg-gray-900 bg-opacity-75 rounded-lg shadow-xl text-center border border-gray-700"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: index * 0.1 }}
      >
        <h3
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {event.title}
        </h3>
        <p className="text-sm text-gray-300 italic mb-4">{event.date}</p>
        <p className="text-gray-200 mb-2">{event.description}</p>
        <p className="text-gray-400 text-sm border-t border-gray-600 pt-2">
          {event.details}
        </p>
      </motion.div>
      {!isLast && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ y: 0 }}
          animate={{ y: 20 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.8 }}
        >
          <p
            className="mb-2 text-sm text-cyan-200"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Continue Scrolling Through Time
          </p>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="cyan"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </motion.div>
      )}
    </section>
  );
};

// ------------------------------------------------------
// 7) Star Chart
// ------------------------------------------------------
const StarChart = () => {
  const chartRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const renderIframe = () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
        const iframe = document.createElement("iframe");
        iframe.src = `https://stellarium-web.org/`;
        iframe.width = "100%";
        iframe.height = "600";
        iframe.style.border = "none";
        iframe.allowFullscreen = true;
        iframe.className = "rounded-xl shadow-2xl bg-black border border-white animate-fade-in";
        iframe.onload = () => setError(false);
        iframe.onerror = () => setError(true);
        chartRef.current.appendChild(iframe);
      }
    };

    renderIframe();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        ✨ Real-Time Night Sky Star Chart
      </h2>

      <div
        ref={chartRef}
        className="border border-gray-700 rounded-xl shadow-lg min-h-[600px] bg-black flex items-center justify-center overflow-hidden relative"
      >
        {error && (
          <div className="text-red-400 text-center p-4">
            <p className="text-lg font-semibold">Failed to load the star chart.</p>
            <p className="text-sm">Please check your internet connection or try disabling browser extensions that may block content.</p>
          </div>
        )}
      </div>

      <p className="text-center text-gray-400 mt-4 text-sm">
        Use your mouse to explore constellations, planets, and celestial objects in real time.
      </p>
    </div>
  );
};

// ------------------------------------------------------
// 8) ISS Tracker
// ------------------------------------------------------
const ISSTracker = () => {
  const [position, setPosition] = useState(null);
  const [trajectory, setTrajectory] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const [astronauts, setAstronauts] = useState([]);
  const [texture, setTexture] = useState("//unpkg.com/three-globe/example/img/earth-night.jpg");
  const [followISS, setFollowISS] = useState(true);
  const globeRef = useRef();

  const fetchPosition = async () => {
    const res = await fetch("http://api.open-notify.org/iss-now.json");
    const data = await res.json();
    const lat = parseFloat(data.iss_position.latitude);
    const lng = parseFloat(data.iss_position.longitude);
    setPosition({ lat, lng });
    setTrajectory((prev) => [...prev.slice(-30), { lat, lng }]);
    fetchLocationName(lat, lng);
    if (followISS && globeRef.current) {
      globeRef.current.pointOfView({ lat, lng }, 1000);
    }
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setPlaceName(data?.display_name || "Unknown Area");
    } catch {
      setPlaceName("Unknown Area");
    }
  };

  const fetchAstronauts = async () => {
    try {
      const res = await fetch("http://api.open-notify.org/astros.json");
      const data = await res.json();
      setAstronauts(data.people.filter((p) => p.craft === "ISS"));
    } catch (err) {
      console.error("Failed to fetch astronauts", err);
    }
  };

  useEffect(() => {
    fetchPosition();
    fetchAstronauts();
    const interval = setInterval(fetchPosition, 5000);
    return () => clearInterval(interval);
  }, [followISS]);

  const arcsData = trajectory.slice(1).map((pos, i) => {
    const start = trajectory[i];
    return {
      startLat: start.lat,
      startLng: start.lng,
      endLat: pos.lat,
      endLng: pos.lng,
    };
  });

  return (
    <div className="p-6 bg-black text-white min-h-screen font-nasa relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:20px_20px] animate-pulse z-0" />
      <motion.h2 className="text-4xl font-bold mb-6 text-center z-10 relative">
        🛰️ ISS Real-Time Tracker
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6 z-10 relative">
        <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] p-6 rounded-2xl shadow-xl border border-gray-700">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
            <FaSatelliteDish className="text-blue-400" /> Current Position
          </h3>
          {position && (
            <>
              <p className="text-sm text-gray-300">
                📍 Latitude: <span className="text-blue-400">{position.lat.toFixed(4)}</span>
              </p>
              <p className="text-sm text-gray-300">
                📍 Longitude: <span className="text-blue-400">{position.lng.toFixed(4)}</span>
              </p>
              <p className="text-sm text-gray-300">
                🌍 Over: <span className="text-cyan-300 italic">{placeName}</span>
              </p>
            </>
          )}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <FaUserAstronaut className="text-yellow-400" /> Crew Aboard ISS:
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              {astronauts.map((astro, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  🚀 {astro.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] p-6 rounded-2xl shadow-xl border border-gray-700 flex flex-col justify-center gap-4">
          <button
            onClick={() => setTexture((prev) =>
              prev.includes("night") ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" : "//unpkg.com/three-globe/example/img/earth-night.jpg")}
            className="flex items-center gap-3 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white text-sm"
          >
            <FaGlobe /> Toggle Globe Texture
          </button>
          <button
            onClick={() => setFollowISS((prev) => !prev)}
            className="flex items-center gap-3 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition text-white text-sm"
          >
            <FaLockOpen /> {followISS ? "Unlock View" : "Follow ISS"}
          </button>
          <a
            href="https://www.ustream.tv/channel/live-iss-stream"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white text-sm"
          >
            <FaVideo /> Watch ISS Live Feed
          </a>
        </div>
      </div>

      <div className="h-[600px] border border-gray-700 rounded-xl overflow-hidden relative z-10 shadow-lg">
        <Globe
          ref={globeRef}
          globeImageUrl={texture}
          backgroundColor="rgba(0,0,0,0)"
          pointsData={position ? [{ ...position, size: 1 }] : []}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "orange"}
          pointAltitude={0.01}
          pointRadius={0.5}
          arcsData={arcsData}
          arcsStartLat="startLat"
          arcsStartLng="startLng"
          arcsEndLat="endLat"
          arcsEndLng="endLng"
          arcsColor={() => "orange"}
          arcsStroke={1.5}
          arcsAltitude={0.04}
        />
      </div>
    </div>
  );
};

// ------------------------------------------------------
// 9) APOD Gallery
// ------------------------------------------------------
const APODGallery = () => {
  const [apodData, setApodData] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const saveFavorites = (data) => {
    localStorage.setItem("favorites", JSON.stringify(data));
    setFavorites(data);
  };

  const toggleFavorite = (item) => {
    const isFav = favorites.some((fav) => fav.url === item.url);
    const updated = isFav ? favorites.filter((fav) => fav.url !== item.url) : [...favorites, item];
    saveFavorites(updated);
  };

  const fetchAPOD = async (url) => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setApodData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch APOD", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAPOD("https://api.nasa.gov/planetary/apod?api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp&count=9");
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    fetchAPOD(`https://api.nasa.gov/planetary/apod?api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp&date=${newDate}`);
  };

  const handleLoadMore = () => {
    fetchAPOD("https://api.nasa.gov/planetary/apod?api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp&count=6");
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <label className="text-sm text-gray-400">
          Choose a date:
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="ml-2 bg-gray-800 text-white p-1 rounded"
          />
        </label>
        <button onClick={handleLoadMore} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
          Load More
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apodData.map((item, idx) => (
            <div
              key={idx}
              className="relative cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => setSelected(item)}
            >
              <img src={item.url} alt={item.title} className="rounded-lg shadow-md h-60 w-full object-cover" />
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.date}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
                className={`absolute top-2 right-2 text-xl ${
                  favorites.some((fav) => fav.url === item.url) ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-lg max-w-2xl w-full p-4 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button className="absolute top-2 right-3 text-white text-xl" onClick={() => setSelected(null)}>
                &times;
              </button>
              <img src={selected.hdurl || selected.url} alt={selected.title} className="rounded-lg mb-4 max-h-96 w-full object-contain" />
              <h2 className="text-xl font-bold mb-1">{selected.title}</h2>
              <p className="text-gray-400 text-sm mb-2">{selected.date}</p>
              <p className="text-sm leading-relaxed text-gray-300">{selected.explanation}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ------------------------------------------------------
// 10) Launch Tracker
// ------------------------------------------------------
const LaunchTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const res = await fetch("https://api.spacexdata.com/v4/launches/upcoming");
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
        setLaunches(sorted.slice(0, 5));
      } catch (err) {
        console.error("Error fetching launches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLaunches();
  }, []);

  return (
    <div className="p-4">
      <h2
        className="text-3xl font-bold mb-6 tracking-wide text-center"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        Upcoming SpaceX Launches
      </h2>
      {loading ? (
        <p className="text-gray-400 text-center">Loading launches...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {launches.map((launch) => (
            <motion.div
              key={launch.id}
              className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
            >
              {launch.links?.patch?.small && (
                <img src={launch.links.patch.small} alt={`${launch.name} patch`} className="w-20 h-20 mx-auto mb-4" />
              )}
              <h3 className="text-2xl font-semibold mb-2 text-white">{launch.name}</h3>
              <p className="text-sm text-gray-400 mb-2">
                {new Date(launch.date_utc).toLocaleString()}
              </p>
              <p className="text-gray-300 mb-4">
                {launch.details ? launch.details : "No mission details available."}
              </p>
              {launch.links.webcast && (
                <a
                  href={launch.links.webcast}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
                >
                  Watch Launch
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------
// 11) Telescope Locator
// ------------------------------------------------------
const TelescopeLocator = () => {
  const globeRef = useRef();
  const [selectedObs, setSelectedObs] = useState(null);
  const [placeName, setPlaceName] = useState("");

  const observatories = [
    {
      name: "Arecibo Observatory (Defunct)",
      lat: 18.344167,
      lng: -66.752778,
      info: "One of the world's largest radio telescopes, used for radio astronomy, atmospheric science, and radar observations. Collapsed in 2020.",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Arecibo_Observatory_Aerial_View.jpg",
    },
    {
      name: "Mauna Kea Observatories",
      lat: 19.8206,
      lng: -155.4681,
      info: "Cluster of astronomical observatories at the summit of Mauna Kea, Hawaii. Hosts some of the world's largest optical/infrared telescopes.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Mauna_Kea_observatories.jpg",
    },
    {
      name: "Very Large Telescope (VLT)",
      lat: -24.627,
      lng: -70.404,
      info: "Operated by ESO, located in the Atacama Desert, Chile. One of the most productive ground-based telescope facilities.",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/64/Very_Large_Telescope.jpg",
    },
    {
      name: "Green Bank Telescope",
      lat: 38.4331,
      lng: -79.8398,
      info: "World's largest fully steerable radio telescope. Located in the National Radio Quiet Zone, USA.",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Green_Bank_Telescope.jpg",
    },
    {
      name: "Royal Observatory, Greenwich",
      lat: 51.4769,
      lng: 0.0,
      info: "Historic observatory in London, UK. Established the Prime Meridian and Greenwich Mean Time (GMT).",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Royal_Observatory_Greenwich.jpg",
    },
  ];

  const reverseGeocode = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      const res = await fetch(url);
      const data = await res.json();
      return data?.display_name || "Unknown location";
    } catch {
      return "Failed to retrieve place name";
    }
  };

  const handlePointClick = async (obs) => {
    setSelectedObs(obs);
    const name = await reverseGeocode(obs.lat, obs.lng);
    setPlaceName(name);
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">🔭 Global Telescope Locator</h2>

      {selectedObs && (
        <div className="bg-gray-900 p-6 mb-6 border border-gray-700 rounded-xl shadow-lg flex flex-col md:flex-row gap-6">
          <img
            src={selectedObs.image}
            alt={selectedObs.name}
            className="w-full md:w-80 h-48 object-cover rounded"
          />
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{selectedObs.name}</h3>
            <p className="text-sm text-gray-400 mb-2">Lat: {selectedObs.lat} | Lng: {selectedObs.lng}</p>
            <p className="text-gray-300 mb-2">{selectedObs.info}</p>
            <p className="text-blue-400 text-sm">📍 Location: {placeName}</p>
          </div>
        </div>
      )}

      <div className="h-[600px] border border-gray-700 rounded-xl overflow-hidden">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,0)"
          pointsData={observatories}
          pointLat="lat"
          pointLng="lng"
          pointLabel="name"
          pointColor={() => "lightgreen"}
          pointAltitude={0.02}
          pointRadius={0.4}
          onPointClick={handlePointClick}
        />
      </div>
    </div>
  );
};

// ------------------------------------------------------
// New Features:
// 12) Real-Time Space News Feed
// ------------------------------------------------------
const SpaceNewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=6");
        const data = await res.json();
        setArticles(data.results);
      } catch (error) {
        console.error("Failed to fetch space news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-10 text-center text-white">
        🛰️ Latest Space News
      </h2>
      {loading ? (
        <p className="text-center text-gray-400">Fetching galactic updates...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              className="bg-gray-900 rounded-xl shadow-xl p-5 border border-white hover:shadow-2xl transition-transform hover:scale-[1.02] cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedArticle(article)}
            >
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-3">
                {article.summary}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-lg max-w-2xl w-full p-6 relative border border-white shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-2xl text-white"
                onClick={() => setSelectedArticle(null)}
              >
                &times;
              </button>
              {selectedArticle.image_url && (
                <img
                  src={selectedArticle.image_url}
                  alt={selectedArticle.title}
                  className="w-full h-60 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
              <p className="text-sm text-gray-400 mb-4">
                Published: {new Date(selectedArticle.published_at).toLocaleString()}
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                {selectedArticle.summary}
              </p>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
              >
                Read Full Article ↗
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ------------------------------------------------------
// 13) Near-Earth Object Tracker
// ------------------------------------------------------
const NEOTracker = () => {
  const [neoData, setNeoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNEO = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp`
        );
        const data = await res.json();
        const neos = data.near_earth_objects[today] || [];
        setNeoData(neos);
      } catch (err) {
        console.error("Failed to fetch NEO data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNEO();
  }, []);

  const getAsteroidImage = () => {
    const images = [
      "https://cdn-icons-png.flaticon.com/512/3240/3240524.png",
      "https://cdn-icons-png.flaticon.com/512/737/737970.png",
      "https://cdn-icons-png.flaticon.com/512/2972/2972817.png",
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-8 text-center font-nasa">🛰️ Near-Earth Object Tracker</h2>
      {loading ? (
        <p className="text-center text-gray-400">Loading NEO data...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {neoData.map((neo) => {
            const hazardous = neo.is_potentially_hazardous_asteroid;
            return (
              <div
                key={neo.id}
                className="bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-700 hover:shadow-xl transition-transform hover:scale-105"
              >
                <img
                  src={getAsteroidImage()}
                  alt="Asteroid"
                  className="w-full h-40 object-contain mb-4"
                />
                <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                  <FaMeteor /> {neo.name}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  Close Approach: {neo.close_approach_data[0]?.close_approach_date_full}
                </p>
                <div className="text-gray-300 text-sm flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <FaRulerCombined />
                    Miss Distance:{" "}
                    <strong>{Number(neo.close_approach_data[0]?.miss_distance.kilometers).toFixed(0)} km</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    📏 Estimated Diameter:{" "}
                    <strong>
                      {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} -{" "}
                      {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
                    </strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <FaExclamationTriangle />
                    Potentially Hazardous:{" "}
                    <span className={`font-bold ${hazardous ? "text-red-500" : "text-green-400"}`}>
                      {hazardous ? "Yes" : "No"}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------
// 14) Mars & Rover Gallery
// ------------------------------------------------------
const MarsRoverGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarsPhotos = async () => {
      try {
        const res = await fetch(
          "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp"
        );
        const data = await res.json();
        setPhotos(data.photos.slice(0, 12));
      } catch (err) {
        console.error("Failed to fetch Mars photos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarsPhotos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Mars & Rover Gallery</h2>
      {loading ? (
        <p className="text-center text-gray-400">Loading Mars photos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="rounded overflow-hidden shadow-lg">
              <img
                src={photo.img_src}
                alt={`Mars Rover - ${photo.rover.name}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-gray-800">
                <h3 className="text-lg font-semibold text-white">{photo.rover.name}</h3>
                <p className="text-gray-400 text-sm">Sol: {photo.sol}</p>
                <p className="text-gray-300 text-sm">Earth Date: {photo.earth_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------
// 15) Solar System Explorer (Simplified 3D Scene)
// ------------------------------------------------------
const SolarSystemExplorer = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="p-6 relative">
      <motion.h2
        className="text-4xl font-bold text-center mb-8 font-nasa flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <FaGlobeAmericas className="text-blue-400" /> Interactive Solar System Explorer
      </motion.h2>

      <motion.div
        className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.div
          className="absolute top-2 right-2 z-10 text-xs text-white bg-black bg-opacity-50 px-3 py-1 rounded-full backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
        >
          Real-time 3D Visualization by NASA
        </motion.div>

        {!iframeLoaded && !iframeError && (
          <div className="w-full h-[700px] flex items-center justify-center bg-black text-white">
            <p className="animate-pulse">🚀 Loading simulation...</p>
          </div>
        )}

        {iframeError && (
          <div className="w-full h-[700px] flex items-center justify-center bg-red-900 text-white">
            <p>❌ Failed to load the simulation. Please check your connection or browser settings.</p>
          </div>
        )}

        <iframe
          src="https://eyes.nasa.gov/apps/solar-system/#/home"
          title="NASA Eyes on the Solar System"
          width="100%"
          height="700"
          frameBorder="0"
          allowFullScreen
          className="w-full rounded-b-xl"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeError(true)}
          style={{ display: iframeLoaded && !iframeError ? 'block' : 'none' }}
        />
      </motion.div>

      <motion.div
        className="mt-6 text-center text-sm text-gray-400 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p>
          🪐 Explore the vastness of our solar system in a NASA-powered 3D simulation. Zoom in on planets,
          rotate around their orbits, and dive into detailed astronomical insights.
        </p>
        <p className="mt-2">
          Powered by
          <a
            href="https://eyes.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline ml-1"
          >
            NASA Eyes on the Solar System
          </a>.
        </p>
      </motion.div>
    </div>
  );
};

// ------------------------------------------------------
// Main App Component with Router
// ------------------------------------------------------
const App = () => {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen font-nasa relative overflow-hidden">
        <StarryBackground />
        <Navbar />
        <LaunchCountdownWidget />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apod" element={<APODGallery />} />
            <Route path="/launches" element={<LaunchTracker />} />
            <Route path="/iss" element={<ISSTracker />} />
            <Route path="/starchart" element={<StarChart />} />
            <Route path="/timeline" element={<SpaceTimeline />} />
            <Route path="/telescopes" element={<TelescopeLocator />} />
            {/* New Routes */}
            <Route path="/news" element={<SpaceNewsFeed />} />
            <Route path="/neo" element={<NEOTracker />} />
            <Route path="/mars" element={<MarsRoverGallery />} />
            <Route path="/solarsystem" element={<SolarSystemExplorer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
