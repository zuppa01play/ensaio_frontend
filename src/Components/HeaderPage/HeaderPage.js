import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import "./HeaderPage.css";

const LOGO_SRC =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1789454511/ChatGPT_Image_Sep_15_2026_12_11_34_PM_m3uujm.png";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Why enSaio", href: "/ensai_why" },
  { label: "Competitive Edge", href: "/gap" },
  { label: "Resources", href: "/resources" },
];

const HeaderPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll state
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      setIsScrolled(y > 20);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close drawer when screen becomes tablet/desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    const handleChange = (e) => {
      if (e.matches) {
        setMobileOpen(false);
      }
    };

    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className={`ensai_head_pg_appbar ${
        isScrolled ? "ensai_head_pg_appbar_scrolled" : ""
      }`}
    >
      <Toolbar
        className="ensai_head_pg_toolbar"
        disableGutters
      >
        <Box className="ensai_head_pg_container">

          {/* =========================
              LOGO
          ========================== */}
          <Box className="ensai_head_pg_logo_wrap">
            <Link
              to="/"
              className="ensai_head_pg_logo_link"
              aria-label="enSaio home"
            >
              <img
                src={LOGO_SRC}
                alt="enSaio Logo"
                className="ensai_head_pg_logo_img"
                decoding="async"
              />
            </Link>
          </Box>

          {/* =========================
              DESKTOP / TABLET NAV
          ========================== */}
          <Box
            component="nav"
            aria-label="Main navigation"
            className="ensai_head_pg_nav_desktop"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="ensai_head_pg_nav_link"
              >
                {link.label}
              </Link>
            ))}
          </Box>

          {/* =========================
              MOBILE MENU BUTTON
          ========================== */}
          <Box className="ensai_head_pg_menu_icon_wrap">
            <IconButton
              aria-label="Open menu"
              onClick={toggleDrawer(true)}
              className="ensai_head_pg_menu_icon_btn"
            >
              <MenuIcon className="ensai_head_pg_menu_icon" />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>

      {/* =========================
          MOBILE DRAWER
      ========================== */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        transitionDuration={{
          enter: 350,
          exit: 250,
        }}
        className="ensai_head_pg_drawer"
        PaperProps={{
          className: "ensai_head_pg_drawer_paper",
        }}
      >
        {/* Drawer Header */}
        <Box className="ensai_head_pg_drawer_header">
          <IconButton
            aria-label="Close menu"
            onClick={toggleDrawer(false)}
            className="ensai_head_pg_drawer_close_btn"
          >
            <CloseIcon className="ensai_head_pg_drawer_close_icon" />
          </IconButton>
        </Box>

        {/* Drawer Navigation */}
        <Box
          component="nav"
          aria-label="Mobile navigation"
          className="ensai_head_pg_drawer_nav"
        >
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              className="ensai_head_pg_drawer_link"
              style={{
                animationDelay: `${120 + index * 70}ms`,
              }}
              onClick={toggleDrawer(false)}
            >
              <span className="ensai_head_pg_drawer_link_label">
                {link.label}
              </span>

              <ChevronRightIcon className="ensai_head_pg_drawer_link_icon" />
            </Link>
          ))}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default HeaderPage;