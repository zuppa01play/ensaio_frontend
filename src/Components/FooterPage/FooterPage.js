import React from 'react';
import "./FooterPage.css";

const FooterPage = () => {
  return (
    <footer className="ensai_footer_pg_wrap">
      <div className="ensai_footer_pg_bg_grid" />
      <div className="ensai_footer_pg_bg_stars" />

      <div className="ensai_footer_pg_container">
        <div className="ensai_footer_pg_top">
          <div className="ensai_footer_pg_brand_col">
            <p className="ensai_footer_pg_logo">EnSai</p>
            <p className="ensai_footer_pg_tagline">
              Mission rehearsal and digital-twin simulation for drone
              operators, before a single blade turns in the field.
            </p>
            <div className="ensai_footer_pg_social_row">
              <a href="#" className="ensai_footer_pg_social_link" aria-label="LinkedIn">in</a>
              <a href="#" className="ensai_footer_pg_social_link" aria-label="X / Twitter">X</a>
              <a href="#" className="ensai_footer_pg_social_link" aria-label="GitHub">gh</a>
            </div>
          </div>

          <div className="ensai_footer_pg_link_col">
            <p className="ensai_footer_pg_col_title">Product</p>
            <ul className="ensai_footer_pg_link_list">
              <li><a href="#" className="ensai_footer_pg_link">Digital Twin</a></li>
              <li><a href="#" className="ensai_footer_pg_link">Mission Rehearsal</a></li>
              <li><a href="#" className="ensai_footer_pg_link">Pricing</a></li>
            </ul>
          </div>

          <div className="ensai_footer_pg_link_col">
            <p className="ensai_footer_pg_col_title">Company</p>
            <ul className="ensai_footer_pg_link_list">
              <li><a href="#" className="ensai_footer_pg_link">About</a></li>
              <li><a href="#" className="ensai_footer_pg_link">Case Studies</a></li>
              <li><a href="#" className="ensai_footer_pg_link">Contact</a></li>
            </ul>
          </div>

          <div className="ensai_footer_pg_link_col">
            <p className="ensai_footer_pg_col_title">Resources</p>
            <ul className="ensai_footer_pg_link_list">
              <li><a href="#" className="ensai_footer_pg_link">Documentation</a></li>
              <li><a href="#" className="ensai_footer_pg_link">Support</a></li>
              <li><a href="#" className="ensai_footer_pg_link">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="ensai_footer_pg_bottom">
          <p className="ensai_footer_pg_copyright">
            © {new Date().getFullYear()} EnSai. All rights reserved.
          </p>
          <ul className="ensai_footer_pg_bottom_links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;