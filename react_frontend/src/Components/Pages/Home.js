import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import mainImage from "../../image/main1.jpg";
import "../css/main.css";

const Home = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !question) {
      toast.error("Both email and question are required.");
      return;
    }

    try {
        const response = await axios.post("/api/queries/submit", { email, question });

        if (response.status === 201) {
            toast.success("Your question has been submitted successfully!");
            setEmail("");
            setQuestion("");
        } else {
            toast.error(response.data.message || "There was an error submitting your question.");
        }
    } catch (error) {
        console.error("There was an error submitting the query:", error);
        toast.error(error.response?.data?.message || "There was an error submitting your question. Please try again later.");
    }
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <img src={mainImage} alt="GeoPredict" className="hero-image" />
        <div className="hero-content">
          <h1 className="fw-bold text-dark">Welcome to GeoPredict</h1>
          <p className="text-dark">
            Predict land prices with AI-powered analytics based on real estate trends
          </p>
          <div>
            <Button variant="primary" className="me-2" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="outline-dark" onClick={() => navigate("/register")}>
              Register
            </Button>
          </div>
        </div>
      </section>

      <section className="about-section py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold">About GeoPredict</h2>
          <p className="text-center text-muted">
            GeoPredict leverages AI and real estate trends to help you make informed land pricing decisions.
          </p>

          <Row className="mt-4">
            <Col md={4} className="text-center">
              <i className="bi bi-graph-up fs-2 text-primary"></i>
              <h5 className="fw-bold mt-2">AI-Powered Analytics</h5>
              <p className="text-muted">Harness machine learning models for accurate land price predictions.</p>
            </Col>
            <Col md={4} className="text-center">
              <i className="bi bi-house-door fs-2 text-success"></i>
              <h5 className="fw-bold mt-2">Real Estate Insights</h5>
              <p className="text-muted">Get detailed insights on land values based on various factors.</p>
            </Col>
            <Col md={4} className="text-center">
              <i className="bi bi-ui-checks fs-2 text-danger"></i>
              <h5 className="fw-bold mt-2">User-Friendly Interface</h5>
              <p className="text-muted">An intuitive platform designed for easy navigation and use.</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="vision-mission-section py-5 bg-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center mb-4 mb-md-0">
              <i className="bi bi-eye fs-2 text-primary"></i>
              <h3 className="fw-bold mt-3">Our Vision</h3>
              <p className="text-muted">
                Our vision is to revolutionize the real estate industry by providing <b>precise, AI-powered land price predictions</b>. 
                We aim to create a <b>data-driven ecosystem</b> where buyers, sellers, and investors can make informed 
                decisions with confidence. By leveraging advanced analytics, we aspire to <b>enhance market transparency</b>, 
                <b>reduce investment risks</b>, and <b>empower individuals</b> with cutting-edge technology in real estate.
              </p>
            </Col>

            <Col md={6} className="text-center">
              <i className="bi bi-bullseye fs-2 text-success"></i>
              <h3 className="fw-bold mt-3">Our Mission</h3>
              <p className="text-muted">
                Our mission is to bridge the gap between <b>real estate and technology</b> by delivering an innovative platform
                that provides <b>accurate and data-driven land valuation</b>. We strive to empower individuals and businesses 
                with <b>real-time insights</b>, ensuring smarter investments and well-informed property decisions. By integrating 
                <b>AI-powered analytics</b>, we aim to <b>streamline market research</b>, <b>simplify price estimation</b>, and <b>reduce financial uncertainty</b>.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="query-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <h3 className="fw-bold text-center mb-4">Send your Questions to us</h3>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Question</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Type your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn login-btn">Submit</button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="contact-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <h3 className="fw-bold text-center mb-4">Contact Us</h3>
              <p className="text-center text-muted mb-4">
                Have any questions or need more information? Feel free to reach out to us through the contact details below.
              </p>
              
              <div className="contact-details text-center">
                <p><strong>Phone:</strong> (123) 456-7890</p>
                <p><strong>Email:</strong> contact@geopredict.com</p>
                <p><strong>Follow Us:</strong>
                  <a href="https://facebook.com/geopredict" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-facebook fs-3 text-primary me-2"></i>Facebook
                  </a> | 
                  <a href="https://twitter.com/geopredict" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-twitter fs-3 text-info me-2"></i>Twitter
                  </a> | 
                  <a href="https://linkedin.com/company/geopredict" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-linkedin fs-3 text-primary me-2"></i>LinkedIn
                  </a>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <ToastContainer />
    </>
  );
};

export default Home;
