import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router and Routes
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import ContactUs from "./components/ContactUs";

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const App = () => {
  // State to store the message from backend, loading state, and error state
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Track if data is loading
  const [error, setError] = useState(null); // Track any errors from API calls

  // Fetch data from the backend API when the component mounts
  useEffect(() => {
    fetch(`${baseUrl}/api/hello`) // Ensure backend API URL matches
      .then((response) => response.json()) // Parse the response to JSON
      .then((data) => {
        setMessage(data.message); // Store the fetched message
        setLoading(false); // Data is loaded, so set loading to false
      })
      .catch((error) => {
        setError("Failed to fetch data from the backend"); // Set error if fetch fails
        setLoading(false); // Stop loading state even if there's an error
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <Router> {/* everything in Router for routing */}
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        {/*  Routes */}
        <Routes>
          {/* Home Route (Default Route) */}
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <FeatureSection />
                <ContactUs />
               
              </>
            }
          />
         
        </Routes>
      </div>
    </Router>
  );
};

export default App;
