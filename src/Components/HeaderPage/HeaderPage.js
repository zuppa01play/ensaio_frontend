import React, { useEffect, useState } from "react";
import "./HeaderPage.css";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "About", href: "/about" },
  { label: "Why enSaio", href: "/ensai_why" },
  { label: "Resources", href: "#resources" },
];

const LOGO_URL =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1789454511/ChatGPT_Image_Sep_15_2026_12_11_34_PM_m3uujm.png";

const HeaderPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="ensai_head_pg_header">
      <div className="ensai_head_pg_bar">
        <a href="/" className="ensai_head_pg_logo_link" onClick={closeMenu}>
          <img
            src={LOGO_URL}
            alt="enSAIO"
            className="ensai_head_pg_logo_img"
          />
        </a>

        <nav className="ensai_head_pg_nav_desktop">
          <ul className="ensai_head_pg_nav_list">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="ensai_head_pg_nav_item">
                <a href={link.href} className="ensai_head_pg_nav_link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ensai_head_pg_actions_desktop">
          <a href="#get-started" className="ensai_head_pg_cta_btn">
            Get started
          </a>
        </div>

        <button
          type="button"
          className="ensai_head_pg_menu_toggle"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <span className="ensai_head_pg_menu_bar" />
          <span className="ensai_head_pg_menu_bar" />
          <span className="ensai_head_pg_menu_bar" />
        </button>
      </div>

      <div
        className={`ensai_head_pg_overlay ${
          isMenuOpen ? "ensai_head_pg_overlay_open" : ""
        }`}
        onClick={closeMenu}
      >
        <div
          className={`ensai_head_pg_panel ${
            isMenuOpen ? "ensai_head_pg_panel_open" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="ensai_head_pg_close_btn"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" className="ensai_head_pg_close_icon">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>

          <ul className="ensai_head_pg_panel_list">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="ensai_head_pg_panel_item">
                <a
                  href={link.href}
                  className="ensai_head_pg_panel_link"
                  onClick={closeMenu}
                >
                  <span>{link.label}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="ensai_head_pg_panel_chevron"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#get-started"
            className="ensai_head_pg_panel_cta"
            onClick={closeMenu}
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeaderPage;