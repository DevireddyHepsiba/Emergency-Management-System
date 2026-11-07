import {
  ArrowDown,
  ArrowRight,
  Building2,
  ClipboardCheck,
  HeartPulse,
  MapPinned,
  ShieldCheck,
  Siren,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const workflow = [
  {
    number: "01",
    title: "A report is raised",
    description: "A citizen or volunteer shares what happened and pins the incident on the map.",
    icon: Siren,
  },
  {
    number: "02",
    title: "A dispatcher reviews it",
    description:
      "A dispatcher checks the details, records triage needs, and reviews nearby resources.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Teams respond",
    description:
      "Hospitals and response teams accept or decline an offer, then share progress with the reporter.",
    icon: HeartPulse,
  },
];

const roles = [
  {
    title: "People reporting",
    description: "Raise an incident and follow its status from My Reports.",
    icon: MapPinned,
  },
  {
    title: "Dispatchers",
    description: "Triage reports and coordinate suitable hospitals and response teams.",
    icon: ClipboardCheck,
  },
  {
    title: "Hospitals & teams",
    description: "Review referrals or offers, accept work, and update operational status.",
    icon: Building2,
  },
  {
    title: "Volunteers",
    description: "See assigned community tasks and update progress in the field.",
    icon: UsersRound,
  },
];

export function LandingPage() {
  const signedIn = Boolean(localStorage.getItem("token"));
  return (
    <div className="landing-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="landing-header">
        <Link to="/" className="brand-lockup" aria-label="SentinelOS home">
          <span className="brand-mark">
            <Siren aria-hidden="true" />
          </span>
          <span>
            Sentinel<span className="brand-light">OS</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="landing-nav">
          <a href="#how-it-works">How it works</a>
          <a href="#who-its-for">Who it serves</a>
        </nav>
        <div className="landing-header-actions">
          <Link className="text-link" to={signedIn ? "/dashboard" : "/login"}>
            {signedIn ? "Open workspace" : "Sign in"}
          </Link>
          <Link className="button button-dark" to={signedIn ? "/dashboard" : "/register"}>
            {signedIn ? "Go to dashboard" : "Join the network"}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main id="main-content">
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" /> Emergency coordination, with people at the center
            </p>
            <h1 id="hero-title">
              When every minute matters, <em>make the next step clear.</em>
            </h1>
            <p className="hero-lede">
              SentinelOS helps communities, dispatchers, hospitals, and response teams coordinate
              the work between an emergency report and a real-world response.
            </p>
            <div className="hero-actions">
              <Link
                className="button button-primary"
                to={signedIn ? "/report-emergency" : "/login"}
              >
                {signedIn ? "Report an emergency" : "Sign in to report"}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a className="button button-soft" href="#how-it-works">
                See how it works
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-note">
              <ShieldCheck size={16} aria-hidden="true" /> Human-reviewed coordination. Resource
              offers require acceptance.
            </p>
          </div>

          <div
            className="hero-visual"
            aria-label="Illustration of an incident being coordinated with a hospital and response team"
          >
            <div className="visual-topline">
              <span>
                <span className="live-dot" /> COORDINATION FLOW
              </span>
              <span>REPORT → RESPONSE</span>
            </div>
            <div className="visual-map" aria-hidden="true">
              <div className="map-grid" />
              <svg className="map-route" viewBox="0 0 520 300" fill="none">
                <path
                  d="M36 232C120 232 109 154 207 165s93-77 170-71c48 4 60 42 108 30"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="7 8"
                />
                <path
                  d="M20 56l475 212M57 10l104 280m232-290L280 293M0 139l520-15M178 4l-92 291M392 7l62 284"
                  stroke="currentColor"
                  strokeOpacity=".11"
                  strokeWidth="14"
                />
              </svg>
              <span className="map-pin pin-incident">
                <Siren size={17} />
                <span>INCIDENT</span>
              </span>
              <span className="map-pin pin-hospital">
                <Building2 size={17} />
                <span>HOSPITAL</span>
              </span>
              <span className="map-pin pin-team">
                <HeartPulse size={17} />
                <span>RESPONSE TEAM</span>
              </span>
            </div>
            <div className="visual-bottom">
              <div>
                <span className="visual-label">ONE SHARED PICTURE</span>
                <strong>Incident · capacity · response</strong>
              </div>
              <span className="visual-arrow">
                <ArrowRight size={21} />
              </span>
            </div>
            <div className="visual-caption">
              <span>Designed for coordinated decisions</span>
              <span>Not automated dispatch</span>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Platform principles">
          <div>
            <span className="trust-number">01</span>
            <span>Report with a location</span>
          </div>
          <div>
            <span className="trust-number">02</span>
            <span>Review needs together</span>
          </div>
          <div>
            <span className="trust-number">03</span>
            <span>Track accepted responses</span>
          </div>
        </section>

        <section id="how-it-works" className="content-section" aria-labelledby="workflow-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A clear handoff, at every step</p>
              <h2 id="workflow-title">From first report to field update.</h2>
            </div>
            <p>Each role sees the information and actions needed for its part of the response.</p>
          </div>
          <div className="workflow-grid">
            {workflow.map(({ number, title, description, icon: Icon }) => (
              <article className="workflow-card" key={number}>
                <div className="workflow-card-top">
                  <span className="workflow-number">{number}</span>
                  <span className="workflow-icon">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="who-its-for" className="roles-section" aria-labelledby="roles-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">One shared response</p>
              <h2 id="roles-title">Purpose-built for each role.</h2>
            </div>
            <p>
              Everyone works from the same incident record while retaining role-specific
              responsibilities.
            </p>
          </div>
          <div className="roles-grid">
            {roles.map(({ title, description, icon: Icon }) => (
              <article className="role-card" key={title}>
                <span className="role-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <ArrowRight className="role-arrow" size={17} aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="safety-note" aria-labelledby="safety-title">
          <span className="safety-icon">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">A coordination tool</p>
            <h2 id="safety-title">People make the dispatch decisions.</h2>
            <p>
              SentinelOS is a project platform for coordinating reports, resources, and status
              updates. It does not automatically dispatch emergency services or replace your local
              emergency number. In immediate danger, call your local emergency services.
            </p>
          </div>
          <Link to={signedIn ? "/dashboard" : "/register"} className="button button-light">
            {signedIn ? "Open workspace" : "Create an account"}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark">
            <Siren aria-hidden="true" />
          </span>
          <span>
            Sentinel<span className="brand-light">OS</span>
          </span>
        </Link>
        <p>Clearer coordination for the moments that matter.</p>
        <div>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Create account</Link>
          <a href="/llms.txt">About this project</a>
        </div>
      </footer>
    </div>
  );
}
