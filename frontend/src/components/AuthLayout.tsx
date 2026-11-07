import { ArrowRight, HeartPulse, MapPinned, ShieldCheck, Siren } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="auth-page">
      <a className="skip-link" href="#auth-main">
        Skip to form
      </a>
      <Link to="/" className="auth-brand brand-lockup">
        <span className="brand-mark">
          <Siren aria-hidden="true" />
        </span>
        <span>
          Sentinel<span className="brand-light">OS</span>
        </span>
      </Link>
      <div className="auth-layout">
        <aside className="auth-story">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> A shared response starts here
          </p>
          <h1>Clarity for the moments that matter.</h1>
          <p>
            One coordinated space for reporting an incident, reviewing needs, and following accepted
            response updates.
          </p>
          <div className="auth-story-flow">
            <div>
              <span>
                <MapPinned size={17} />
              </span>
              <p>
                <b>Pin the incident</b>
                <small>Share the place and what happened.</small>
              </p>
            </div>
            <ArrowRight className="auth-flow-arrow" size={15} />
            <div>
              <span>
                <HeartPulse size={17} />
              </span>
              <p>
                <b>Coordinate a response</b>
                <small>People review and accept offers.</small>
              </p>
            </div>
            <ArrowRight className="auth-flow-arrow" size={15} />
            <div>
              <span>
                <ShieldCheck size={17} />
              </span>
              <p>
                <b>Follow progress</b>
                <small>Updates stay linked to the report.</small>
              </p>
            </div>
          </div>
          <Link to="/" className="auth-home-link">
            Learn about SentinelOS
            <ArrowRight size={15} />
          </Link>
        </aside>
        <main id="auth-main" className="auth-main">
          <section className="auth-card">
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p className="auth-description">{description}</p>
            {children}
            <div className="auth-footer">{footer}</div>
          </section>
          <p className="auth-footnote">
            SentinelOS supports coordination. It does not automatically dispatch emergency services.
          </p>
        </main>
      </div>
    </div>
  );
}
