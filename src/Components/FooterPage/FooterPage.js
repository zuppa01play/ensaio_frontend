import React from "react";
import { Link } from "react-router-dom";
import "./FooterPage.css";

const FooterPage = () => {
  return (
    <footer className="ensai_footer_pg_wrap">
      <div className="ensai_footer_pg_bg_grid" />
      <div className="ensai_footer_pg_bg_stars" />

      <div className="ensai_footer_pg_container">
        <div className="ensai_footer_pg_top">

          {/* =========================
              BRAND
          ========================== */}
          <div className="ensai_footer_pg_brand_col">
            <Link
              to="/"
              className="ensai_footer_pg_logo"
              aria-label="EnSai Home"
            >
              EnSai
            </Link>

            <p className="ensai_footer_pg_tagline">
              Mission rehearsal and digital-twin simulation for drone
              operators, before a single blade turns in the field.
            </p>

            <div className="ensai_footer_pg_social_row">
              {/* Replace these URLs with your actual social profiles */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ensai_footer_pg_social_link"
                aria-label="LinkedIn"
              >
                in
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ensai_footer_pg_social_link"
                aria-label="X / Twitter"
              >
                X
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ensai_footer_pg_social_link"
                aria-label="GitHub"
              >
                gh
              </a>
            </div>
          </div>

          {/* =========================
              PRODUCT
          ========================== */}
          <div className="ensai_footer_pg_link_col">
            <p className="ensai_footer_pg_col_title">
              Product
            </p>

            <ul className="ensai_footer_pg_link_list">
              <li>
                <Link
                  to="/product"
                  className="ensai_footer_pg_link"
                >
                  Digital Twin
                </Link>
              </li>

              <li>
                <Link
                  to="/product"
                  className="ensai_footer_pg_link"
                >
                  Mission Rehearsal
                </Link>
              </li>

              <li>
                <Link
                  to="/pricing"
                  className="ensai_footer_pg_link"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================
              COMPANY
          ========================== */}
          <div className="ensai_footer_pg_link_col">
            <p className="ensai_footer_pg_col_title">
              Company
            </p>

            <ul className="ensai_footer_pg_link_list">
              <li>
                <Link
                  to="/about"
                  className="ensai_footer_pg_link"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/case-studies"
                  className="ensai_footer_pg_link"
                >
                  Case Studies
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="ensai_footer_pg_link"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================
              RESOURCES
          ========================== */}
          <div className="ensai_footer_pg_link_col">
            <p className="ensai_footer_pg_col_title">
              Resources
            </p>

            <ul className="ensai_footer_pg_link_list">
              <li>
                <Link
                  to="/documentation"
                  className="ensai_footer_pg_link"
                >
                  Documentation
                </Link>
              </li>

              <li>
                <Link
                  to="/support"
                  className="ensai_footer_pg_link"
                >
                  Support
                </Link>
              </li>

              <li>
                <Link
                  to="/blog"
                  className="ensai_footer_pg_link"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================
            FOOTER BOTTOM
        ========================== */}
        <div className="ensai_footer_pg_bottom">
          <p className="ensai_footer_pg_copyright">
            © {new Date().getFullYear()} EnSai. All rights reserved.
          </p>

          <ul className="ensai_footer_pg_bottom_links">
            <li>
              <Link to="/privacy" className="ensai_footer_pg_link">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/terms" className="ensai_footer_pg_link">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;