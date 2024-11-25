import React, { useState } from 'react';
import '../ContactUs.css';
import axios from "axios";

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;



const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/api/contact/submit`, formData);
      setSuccessMessage(response.data.message);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" }); // Clear form
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="contact-us-container">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
        <span className="text-white">Contact</span>
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          Us
        </span>
      </h1>
      {isSubmitted ? (
        <div className="thank-you-message">
          <h2>Thank you for reaching out!</h2>
          <p>We'll get back to you as soon as possible.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      )}
      
      <div className="customer-support-email my-3 py-5">
        <p>For immediate assistance, feel free to reach us at:</p>
        <a href="mailto:official@shwetatyagi1@gmail.com" className="email-link">support@Listify</a>
      </div>
    </div>
  );
};

export default ContactUs;
