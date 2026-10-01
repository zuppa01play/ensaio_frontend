import React from "react";
import { useNavigate } from "react-router-dom";
import "./FooterPage.css";
import FooterImage from "./Footer.png";

const logoImage = FooterImage;

const linkedinLink = "#";
const instagramLink = "#";

const footerLinks = [
  { id: "demo", label: "Demo", href: "/demo" },
  { id: "about", label: "About", href: "/about" },
  { id: "why", label: "Why enSaio", href: "/ensai_why" },
  { id: "tutorials", label: "Tutorials", href: "/tutorials" },
];

const policyLinks = [
  { id: "privacy", label: "Privacy Policy", href: "/privacy_policy" },
  { id: "terms", label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const FooterPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="ensai_footer_pg_footer">
      <div className="ensai_footer_pg_inner">
        {/* TOP */}
        <div className="ensai_footer_pg_top">
          {/* Brand */}
          <div className="ensai_footer_pg_brand">
            <button
              type="button"
              className="ensai_footer_pg_logo_link"
              onClick={() => handleNavigation("/")}
              aria-label="enSaio home"
            >
              <img
                src={logoImage}
                alt="enSaio logo"
                className="ensai_footer_pg_logo"
              />
            </button>

            <p className="ensai_footer_pg_tagline">
              Missions don't fail aerodynamically. They fail commercially,
              contractually, and legally
            </p>

            <p className="ensai_footer_pg_subtagline">
              enSaio co-simulates flight physics, sensor optics and the
              contract itself — a deterministic Go / No-Go decision,
              delivered before crews ever mobilize.
            </p>
          </div>

          {/* LINKS */}
          <nav className="ensai_footer_pg_nav" aria-label="Footer Navigation">
            <h2 className="ensai_footer_pg_nav_title">Links</h2>

            <ul className="ensai_footer_pg_list">
              {footerLinks.map((item) => (
                <li key={item.id} className="ensai_footer_pg_list_item">
                  <button
                    type="button"
                    className="ensai_footer_pg_link"
                    onClick={() => handleNavigation(item.href)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* POLICY (right side of Links) */}
          <nav className="ensai_footer_pg_nav" aria-label="Policy">
            <h2 className="ensai_footer_pg_nav_title">Policy</h2>

            <ul className="ensai_footer_pg_list">
              {policyLinks.map((item) => (
                <li key={item.id} className="ensai_footer_pg_list_item">
                  <button
                    type="button"
                    className="ensai_footer_pg_link"
                    onClick={() => handleNavigation(item.href)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="ensai_footer_pg_bottom">
          <p className="ensai_footer_pg_copy">
            © 2026 EnSai. All rights reserved.
          </p>

          <div className="ensai_footer_pg_socials">
            <a
              href={linkedinLink}
              className="ensai_footer_pg_social_btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="enSaio on LinkedIn"
            >
              <svg
                className="ensai_footer_pg_social_icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.83v1.57h.05c.53-1 1.84-2.07 3.78-2.07 4.04 0 4.79 2.66 4.79 6.12v5.88h-4v-5.2c0-1.24-.02-2.83-1.73-2.83-1.73 0-2 1.35-2 2.74v5.29h-4V9.75Z"
                />
              </svg>
            </a>

            <a
              href={instagramLink}
              className="ensai_footer_pg_social_btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="enSaio on Instagram"
            >
              <svg
                className="ensai_footer_pg_social_icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;