
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Activity,
  ArrowRight,
  Bed,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  Hospital,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  User,
  UserPlus,
  X,
} from "lucide-react";

import "./App.css";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("patient"));
  } catch {
    return null;
  }
};

const saveUser = (user) => {
  localStorage.setItem("patient", JSON.stringify(user));
};

const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("patient");
};

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

/* =========================
   NAVBAR
========================= */

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = getStoredUser();

  const logout = () => {
    logoutUser();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <HeartPulse size={21} strokeWidth={2.3} />
          </span>

          <span className="brand-copy">
            <span className="brand-name">SwasthSewa</span>
            <span className="brand-tagline">Healthcare, simplified.</span>
          </span>
        </Link>

        <button
          className="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>

        <nav className={`nav-links ${open ? "nav-open" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link to="/hospitals" onClick={() => setOpen(false)}>
            Hospitals
          </Link>

          {user && (
            <>
              <Link
                to="/patient/dashboard"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/patient/bookings"
                onClick={() => setOpen(false)}
              >
                My Bookings
              </Link>
            </>
          )}

          {!user ? (
            <div className="nav-actions">
              <Link
                to="/login"
                className="nav-login"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn btn-primary btn-small"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="nav-user-area">
              <span className="nav-user">
                <User size={16} />
                {user.name}
              </span>

              <button className="nav-logout" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

/* =========================
   HOME
========================= */

function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="hero">
        <div className="hero-background" />

        <div className="container hero-content">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Healthcare made easier
            </div>

            <h1>
              Find the right care,
              <span> when you need it.</span>
            </h1>

            <p>
              SwasthSewa helps patients discover hospitals, check bed
              availability and manage healthcare bookings from one simple
              platform.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate("/hospitals")}
              >
                Find a Hospital
                <ArrowRight size={18} />
              </button>

              <button
                className="btn btn-secondary btn-large"
                onClick={() =>
                  navigate(getToken() ? "/patient/dashboard" : "/signup")
                }
              >
                {getToken() ? "Open Dashboard" : "Create Account"}
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <CheckCircle2 size={17} />
                Real-time availability
              </div>

              <div className="trust-item">
                <ShieldCheck size={17} />
                Secure patient access
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <div>
                <span className="small-label">CARE AVAILABILITY</span>
                <h3>Find available beds</h3>
              </div>

              <div className="hero-card-icon">
                <Bed size={22} />
              </div>
            </div>

            <div className="hero-search">
              <Search size={19} />
              <span>Search hospitals by location</span>
            </div>

            <div className="availability-preview">
              <div className="preview-row">
                <div className="preview-icon">
                  <Hospital size={18} />
                </div>

                <div>
                  <strong>Hospital availability</strong>
                  <span>Check before you visit</span>
                </div>

                <ChevronRight size={17} />
              </div>

              <div className="preview-row">
                <div className="preview-icon">
                  <CalendarCheck size={18} />
                </div>

                <div>
                  <strong>Easy booking</strong>
                  <span>Manage your booking online</span>
                </div>

                <ChevronRight size={17} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          <StatCard
            icon={<Hospital size={21} />}
            value="Hospitals"
            label="Discover available healthcare facilities"
          />

          <StatCard
            icon={<Bed size={21} />}
            value="Bed Availability"
            label="Check available beds before booking"
          />

          <StatCard
            icon={<CalendarCheck size={21} />}
            value="Simple Booking"
            label="Reserve and manage your healthcare booking"
          />

          <StatCard
            icon={<ShieldCheck size={21} />}
            value="Secure Access"
            label="Your account stays protected"
          />
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-kicker">HOW IT WORKS</span>
            <h2>Healthcare without the unnecessary complexity.</h2>
            <p>
              Find a hospital, choose an available bed and manage your
              booking through your patient dashboard.
            </p>
          </div>

          <div className="steps-grid">
            <StepCard
              number="01"
              icon={<Search size={22} />}
              title="Find a hospital"
              text="Browse hospitals and search by location."
            />

            <StepCard
              number="02"
              icon={<Bed size={22} />}
              title="Check availability"
              text="View beds and identify available capacity."
            />

            <StepCard
              number="03"
              icon={<CalendarCheck size={22} />}
              title="Book your bed"
              text="Create your booking using your patient account."
            />

            <StepCard
              number="04"
              icon={<Activity size={22} />}
              title="Manage your care"
              text="View your active booking and booking history."
            />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-card">
          <div>
            <span className="section-kicker">GET STARTED</span>
            <h2>Take the first step toward simpler healthcare.</h2>
            <p>
              Create your patient account and start exploring hospitals.
            </p>
          </div>

          <button
            className="btn btn-light btn-large"
            onClick={() => navigate("/signup")}
          >
            Create Patient Account
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function StepCard({ number, icon, title, text }) {
  return (
    <div className="step-card">
      <div className="step-top">
        <span>{number}</span>
        <div className="step-icon">{icon}</div>
      </div>

      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* =========================
   HOSPITALS
========================= */

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/Hospital/list");

      setHospitals(
        Array.isArray(response.data)
          ? response.data
          : response.data.hospitals || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load hospitals right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return hospitals;

    return hospitals.filter((hospital) => {
      return (
        hospital.name?.toLowerCase().includes(value) ||
        hospital.location?.toLowerCase().includes(value)
      );
    });
  }, [hospitals, search]);

  return (
    <main className="page">
      <div className="container">
        <div className="page-header hospitals-header">
          <div>
            <span className="section-kicker">HEALTHCARE NETWORK</span>
            <h1>Find a hospital</h1>
            <p>
              Explore hospitals and check bed availability before
              booking.
            </p>
          </div>

          <div className="search-box">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search by hospital or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && <LoadingState text="Loading hospitals..." />}

        {!loading && error && (
          <ErrorState message={error} onRetry={fetchHospitals} />
        )}

        {!loading && !error && filteredHospitals.length === 0 && (
          <EmptyState
            icon={<Hospital size={28} />}
            title="No hospitals found"
            text="Try searching for a different hospital or location."
          />
        )}

        {!loading && !error && filteredHospitals.length > 0 && (
          <div className="hospital-grid">
            {filteredHospitals.map((hospital) => (
              <HospitalCard
                key={hospital._id}
                hospital={hospital}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function HospitalCard({ hospital }) {
  return (
    <Link
      to={`/hospitals/${hospital._id}`}
      className="hospital-card"
    >
      <div className="hospital-card-top">
        <div className="hospital-logo">
          <Hospital size={24} />
        </div>

        <span
          className={`availability-pill ${
            hospital.availableBeds > 0
              ? "available"
              : "unavailable"
          }`}
        >
          {hospital.availableBeds > 0
            ? "Beds available"
            : "No beds available"}
        </span>
      </div>

      <h3>{hospital.name}</h3>

      <div className="hospital-location">
        <MapPin size={16} />
        <span>{hospital.location}</span>
      </div>

      <div className="hospital-meta">
        <div>
          <strong>{hospital.availableBeds ?? 0}</strong>
          <span>Available</span>
        </div>

        <div>
          <strong>{hospital.totalBeds ?? 0}</strong>
          <span>Total beds</span>
        </div>
      </div>

      <div className="hospital-card-footer">
        View hospital
        <ArrowRight size={17} />
      </div>
    </Link>
  );
}

/* =========================
   HOSPITAL DETAILS
========================= */

function HospitalDetails() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadHospital();
    loadBeds();
  }, []);

  const loadHospital = async () => {
    try {
      const response = await API.get("/Hospital/list");

      const list = Array.isArray(response.data)
        ? response.data
        : response.data.hospitals || [];

      const selected = list.find(
        (item) => item._id === hospitalId
      );

      if (!selected) {
        setError("Hospital not found.");
        return;
      }

      setHospital(selected);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load hospital details."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadBeds = async () => {
    try {
      const response = await API.get("/Bed", {
        headers: authHeaders(),
      });

      const list = Array.isArray(response.data)
        ? response.data
        : response.data.beds || [];

      setBeds(
        list.filter((bed) => {
          const hospitalRef =
            typeof bed.hospital === "object"
              ? bed.hospital?._id
              : bed.hospital;

          return hospitalRef === hospitalId;
        })
      );
    } catch (err) {
      console.error("Bed loading error:", err);
    }
  };

  const bookBed = async (bed) => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setBookingLoading(true);
      setMessage("");
      setError("");

      await API.post(
        "/Book",
        {
          patient: user.id,
          hospital: hospitalId,
          bed: bed._id,
        },
        {
          headers: authHeaders(),
        }
      );

      setMessage("Bed booked successfully.");

      await loadBeds();
      await loadHospital();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState text="Loading hospital..." />
        </div>
      </main>
    );
  }

  if (error && !hospital) {
    return (
      <main className="page">
        <div className="container">
          <ErrorState message={error} />
        </div>
      </main>
    );
  }

  const availableBeds = beds.filter(
    (bed) => bed.status === "available"
  );

  return (
    <main className="page">
      <div className="container">
        <button
          className="back-button"
          onClick={() => navigate("/hospitals")}
        >
          ← Back to hospitals
        </button>

        <section className="hospital-details-card">
          <div className="hospital-details-main">
            <div className="details-logo">
              <Hospital size={34} />
            </div>

            <div>
              <span className="section-kicker">HOSPITAL</span>
              <h1>{hospital.name}</h1>

              <div className="detail-location">
                <MapPin size={17} />
                {hospital.location}
              </div>

              {hospital.contactNumber && (
                <div className="detail-location">
                  <Phone size={17} />
                  {hospital.contactNumber}
                </div>
              )}
            </div>
          </div>

          <div className="capacity-card">
            <span>Available beds</span>
            <strong>{hospital.availableBeds ?? 0}</strong>
            <small>of {hospital.totalBeds ?? 0} total beds</small>
          </div>
        </section>

        {message && (
          <div className="success-alert">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="error-alert">
            <Activity size={18} />
            {error}
          </div>
        )}

        <div className="section-heading details-heading">
          <div>
            <span className="section-kicker">BED AVAILABILITY</span>
            <h2>Select an available bed</h2>
          </div>

          <span className="result-count">
            {availableBeds.length} available
          </span>
        </div>

        {beds.length === 0 ? (
          <EmptyState
            icon={<Bed size={28} />}
            title="No bed information available"
            text="There are currently no beds listed for this hospital."
          />
        ) : availableBeds.length === 0 ? (
          <EmptyState
            icon={<Bed size={28} />}
            title="No beds currently available"
            text="Please check again later or explore another hospital."
          />
        ) : (
          <div className="bed-grid">
            {beds.map((bed) => (
              <BedCard
                key={bed._id}
                bed={bed}
                onBook={bookBed}
                loading={bookingLoading}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function BedCard({ bed, onBook, loading }) {
  const available = bed.status === "available";

  return (
    <div className={`bed-card ${available ? "" : "occupied"}`}>
      <div className="bed-card-icon">
        <Bed size={23} />
      </div>

      <div className="bed-card-content">
        <span className="small-label">BED</span>
        <h3>{bed.bedNumber}</h3>

        <span
          className={`bed-status ${
            available ? "available" : "occupied"
          }`}
        >
          {available ? "Available" : "Occupied"}
        </span>
      </div>

      {available && (
        <button
          className="btn btn-primary"
          onClick={() => onBook(bed)}
          disabled={loading}
        >
          {loading ? "Booking..." : "Book"}
        </button>
      )}
    </div>
  );
}

/* =========================
   LOGIN
========================= */

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/login", form);

      localStorage.setItem("token", response.data.token);
      saveUser(response.data.user);

      navigate("/patient/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-intro">
          <span className="section-kicker">PATIENT ACCESS</span>

          <h1>Welcome back.</h1>

          <p>
            Sign in to manage your hospital bookings and access your
            SwasthSewa dashboard.
          </p>

          <div className="auth-feature">
            <CheckCircle2 size={18} />
            Secure patient account
          </div>

          <div className="auth-feature">
            <CheckCircle2 size={18} />
            Manage active bookings
          </div>

          <div className="auth-feature">
            <CheckCircle2 size={18} />
            Access hospital availability
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <div className="auth-icon">
              <LogIn size={22} />
            </div>

            <h2>Sign in</h2>
            <p>Enter your account details below.</p>
          </div>

          {error && (
            <div className="error-alert">
              <Activity size={17} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

/* =========================
   SIGNUP
========================= */

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/signup", form);

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-intro">
          <span className="section-kicker">JOIN SWASTHSEWA</span>

          <h1>Your healthcare journey starts here.</h1>

          <p>
            Create a patient account to discover hospitals, check
            available beds and manage bookings.
          </p>

          <div className="auth-feature">
            <CheckCircle2 size={18} />
            Discover hospitals
          </div>

          <div className="auth-feature">
            <CheckCircle2 size={18} />
            Check bed availability
          </div>

          <div className="auth-feature">
            <CheckCircle2 size={18} />
            Manage bookings
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <div className="auth-icon">
              <UserPlus size={22} />
            </div>

            <h2>Create account</h2>
            <p>Register as a patient to get started.</p>
          </div>

          {error && (
            <div className="error-alert">
              <Activity size={17} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <FormField
              label="Full name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <label className="form-field">
      <span>{label}</span>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  );
}

/* =========================
   PATIENT DASHBOARD
========================= */

function PatientDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await API.get("/dashboard", {
        headers: authHeaders(),
      });

      setDashboard(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setDashboard(null);
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const user = getStoredUser();

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState text="Loading your dashboard..." />
        </div>
      </main>
    );
  }

  return (
    <main className="page dashboard-page">
      <div className="container">
        <div className="dashboard-welcome">
          <div>
            <span className="section-kicker">PATIENT DASHBOARD</span>

            <h1>
              Good to see you,{" "}
              <span>{user?.name?.split(" ")[0] || "there"}.</span>
            </h1>

            <p>
              Manage your healthcare bookings and account from here.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/hospitals")}
          >
            Find a Hospital
            <ArrowRight size={17} />
          </button>
        </div>

        {error && <ErrorState message={error} />}

        {!error && dashboard && (
          <>
            <div className="dashboard-grid">
              <div className="dashboard-main-card">
                <div className="dashboard-card-header">
                  <div>
                    <span className="section-kicker">
                      ACTIVE BOOKING
                    </span>
                    <h2>Your current booking</h2>
                  </div>

                  <span className="status-badge">
                    <span />
                    Active
                  </span>
                </div>

                <div className="dashboard-booking">
                  <div className="dashboard-hospital-icon">
                    <Hospital size={28} />
                  </div>

                  <div className="dashboard-booking-info">
                    <h3>{dashboard.hospital?.name}</h3>

                    <div>
                      <User size={16} />
                      {dashboard.patient?.name}
                    </div>

                    <div>
                      <Clock3 size={16} />
                      Booking confirmed
                    </div>
                  </div>
                </div>

                <div className="dashboard-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate("/patient/bookings")
                    }
                  >
                    View all bookings
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/hospitals")}
                  >
                    Find another hospital
                  </button>
                </div>
              </div>

              <div className="dashboard-side-card">
                <div className="dashboard-side-icon">
                  <User size={21} />
                </div>

                <span className="section-kicker">PATIENT PROFILE</span>

                <h3>{dashboard.patient?.name}</h3>

                <p>{dashboard.patient?.email}</p>

                <div className="profile-divider" />

                <div className="profile-item">
                  <ShieldCheck size={17} />
                  <span>Account protected</span>
                </div>
              </div>
            </div>
          </>
        )}

        {!error && !dashboard && (
          <div className="no-booking-card">
            <div className="empty-icon">
              <CalendarCheck size={28} />
            </div>

            <span className="section-kicker">NO ACTIVE BOOKING</span>

            <h2>You don't have an active booking.</h2>

            <p>
              Explore hospitals and find an available bed when you
              need one.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/hospitals")}
            >
              Explore Hospitals
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================
   BOOKINGS
========================= */

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const response = await API.get("/Book", {
        headers: authHeaders(),
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.bookings || [];

      const user = getStoredUser();

      const patientBookings = data.filter((booking) => {
        const patientId =
          typeof booking.patient === "object"
            ? booking.patient?._id
            : booking.patient;

        return patientId === user?.id;
      });

      setBookings(patientBookings);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="section-kicker">PATIENT AREA</span>
            <h1>My bookings</h1>
            <p>View and manage your healthcare bookings.</p>
          </div>
        </div>

        {loading && <LoadingState text="Loading bookings..." />}

        {!loading && error && (
          <ErrorState message={error} onRetry={loadBookings} />
        )}

        {!loading && !error && bookings.length === 0 && (
          <EmptyState
            icon={<CalendarCheck size={28} />}
            title="No bookings yet"
            text="You haven't created any hospital bookings."
          />
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onRefresh={loadBookings}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function BookingCard({ booking, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const updateBooking = async (status) => {
    try {
      setLoading(true);

      await API.put(
        `/Book/${booking._id}`,
        { status },
        {
          headers: authHeaders(),
        }
      );

      onRefresh();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update booking."
      );
    } finally {
      setLoading(false);
    }
  };

  const hospitalName =
    typeof booking.hospital === "object"
      ? booking.hospital?.name
      : "Hospital";

  const bedNumber =
    typeof booking.bed === "object"
      ? booking.bed?.bedNumber
      : "Bed";

  return (
    <div className="booking-card">
      <div className="booking-card-icon">
        <Hospital size={24} />
      </div>

      <div className="booking-card-info">
        <span className="section-kicker">BOOKING</span>

        <h3>{hospitalName}</h3>

        <div className="booking-details">
          <span>
            <Bed size={16} />
            Bed {bedNumber}
          </span>

          <span>
            <Clock3 size={16} />
            {booking.status}
          </span>
        </div>
      </div>

      <div className="booking-card-actions">
        <span className={`booking-status ${booking.status}`}>
          {booking.status}
        </span>

        {booking.status === "booked" && (
          <button
            className="btn btn-danger-outline"
            disabled={loading}
            onClick={() => updateBooking("cancelled")}
          >
            {loading ? "Updating..." : "Cancel booking"}
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================
   STATES
========================= */

function LoadingState({ text }) {
  return (
    <div className="state-card">
      <div className="loading-spinner" />
      <h3>{text}</h3>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card error-state">
      <div className="empty-icon error">
        <Activity size={27} />
      </div>

      <h3>Something went wrong</h3>
      <p>{message}</p>

      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

function EmptyState({ icon, title, text }) {
  return (
    <div className="state-card">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* =========================
   FOOTER
========================= */

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="footer-brand">
            <span className="brand-mark">
              <HeartPulse size={18} />
            </span>
            SwasthSewa
          </Link>

          <p>
            A simpler way to discover hospitals and manage
            healthcare bookings.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/hospitals">Hospitals</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SwasthSewa</span>
          <span>Healthcare management platform</span>
        </div>
      </div>
    </footer>
  );
}

/* =========================
   APP
========================= */

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/hospitals"
            element={<Hospitals />}
          />

          <Route
            path="/hospitals/:hospitalId"
            element={
              <ProtectedRoute>
                <HospitalDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
