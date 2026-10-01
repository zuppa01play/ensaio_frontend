import React from "react";
import "./PrivacyPolicy.css";

const PRIVACY_EMAIL = "privacy@ensaio.com";

const TOC = [
  { id: "ensai_privacy_pg_s1", label: "Interpretation and Definitions" },
  { id: "ensai_privacy_pg_s2", label: "Collecting and Using Your Personal Data" },
  { id: "ensai_privacy_pg_s3", label: "Use of Your Personal Data" },
  { id: "ensai_privacy_pg_s4", label: "Retention of Your Personal Data" },
  { id: "ensai_privacy_pg_s5", label: "Transfer of Your Personal Data" },
  { id: "ensai_privacy_pg_s6", label: "Delete Your Personal Data" },
  { id: "ensai_privacy_pg_s7", label: "Disclosure of Your Personal Data" },
  { id: "ensai_privacy_pg_s8", label: "Security of Your Personal Data" },
  { id: "ensai_privacy_pg_s9", label: "Children's Privacy" },
  { id: "ensai_privacy_pg_s10", label: "Links to Other Websites" },
  { id: "ensai_privacy_pg_s11", label: "Statutory Compliance Directives" },
  { id: "ensai_privacy_pg_s12", label: "Changes to this Privacy Policy" },
  { id: "ensai_privacy_pg_s13", label: "Grievance Redressal and Contact Us" },
];

const DEFINITIONS = [
  {
    term: "Account",
    text: "A unique credentialed access environment created to access the Service or specific enterprise modules.",
  },
  {
    term: "Affiliate",
    text: "An entity that controls, is controlled by, or is under common control with a party.",
  },
  {
    term: "Company",
    text: "enSaio Geospatial Technologies Inc., UAV Geodetic Systems & Mission R&D, Polyhose Tower No. 86, West Wing, 4th Floor, Anna Salai, Guindy, Chennai – 600032, Tamil Nadu, India.",
  },
  {
    term: "Cookies",
    text: "Small data files placed on a computer, mobile device, or Ground Control Station containing browsing, session, and preference information.",
  },
  { term: "Country", text: "Tamil Nadu, India." },
  {
    term: "Device",
    text: "Any device capable of accessing the Service, including workstations, field laptops, Ground Control Stations, avionics data docks, and tablets.",
  },
  {
    term: "Geospatial & Telemetry Data",
    text: "Machine-generated spatial metadata including waypoint coordinates, GNSS observations, flight corridors, camera sensor optical matrices, GSD baselines, and Digital Rehearsal logs.",
  },
  {
    term: "Personal Data",
    text: "Information relating to an identified or identifiable natural or legal person.",
  },
  {
    term: "Service",
    text: "The website (ensaio.com), enSaio Digital Rehearsal Suite, Geodetic Engines, and associated cloud processing services.",
  },
  {
    term: "Service Provider",
    text: "A person or organization processing data on behalf of the Company under confidentiality and security requirements.",
  },
  {
    term: "Usage Data",
    text: "Data collected automatically through use of the Service or its infrastructure.",
  },
  {
    term: "You",
    text: "The individual or organization accessing or using the Service.",
  },
];

const PII = [
  "First name and last name",
  "Enterprise email address",
  "Phone number and mobile contact",
  "Company / Organization / Institutional affiliation",
  "Professional designation / Role",
  "Billing address, Tax Identification Number (GSTIN), and enterprise procurement credentials",
];

const USAGE = [
  "Device IP address",
  "Browser type, browser version, and operating system build",
  "Pages visited, date, time, and duration",
  "Diagnostic telemetry, WebGL GPU rendering tier, and client error logs",
  "Unique device identifiers and network latency metrics",
];

const MISSION = [
  "Sensor optical geometries including focal length, sensor pitch, and shutter trigger frequency",
  "Survey corridor boundary coordinates and planned flight altitudes",
  "Stereoscopic overlap targets (Forward overlap %, Side overlap %)",
  "Satellite constellation ephemeris logs for GDOP calculation",
];

const COOKIES = [
  {
    label: "Necessary / Session Cookies",
    text: "Essential for authentication, coordinate reference system states, and active flight-planning queries.",
  },
  {
    label: "Preference & Functionality Cookies",
    text: "Remember measurement units, coordinate datums, and interface theme settings.",
  },
  {
    label: "Security Cookies",
    text: "Used for CSRF protection and prevention of unauthorized credential relaying.",
  },
];

const PURPOSES = [
  {
    name: "To Provide & Maintain the Service",
    text: "Delivering the Digital Rehearsal engine, executing geodetic ray-tracing, evaluating terrain collision buffers, and monitoring platform availability.",
  },
  {
    name: "To Manage Your Account",
    text: "Managing registration, enterprise team permissions, and cryptographic seat licenses.",
  },
  {
    name: "For Contract Performance",
    text: "Executing software license agreements, SaaS provisioning contracts, hardware firmware validations, and enterprise support SLAs.",
  },
  {
    name: "To Contact You",
    text: "Communicating critical operational notifications, geodetic updates, and security patches.",
  },
  {
    name: "To Provide Industry Intelligence",
    text: "Sharing whitepapers, technical case studies, and advance notices on platform upgrades, subject to opt-out preferences.",
  },
  {
    name: "To Manage Customer Requests",
    text: "Diagnosing support tickets and assisting with flight-planning or geodetic projection issues.",
  },
  {
    name: "For Corporate Restructuring",
    text: "Evaluating or executing mergers, divestitures, or asset sales where applicable, subject to this Policy.",
  },
  {
    name: "For Internal Analytics",
    text: "Analyzing computation latency, regional network bottlenecks, and platform performance.",
  },
];

const RETENTION = [
  {
    label: "Identity & Account Data",
    text: "Retained for the duration of an active enterprise subscription plus applicable administrative, contractual, and tax/legal retention periods.",
  },
  {
    label: "Telemetry & Flight Rehearsal Data",
    text: "Stored according to customer configuration, including possible immediate purge, a mission buffer, or sovereign archival where supported.",
  },
  {
    label: "Legal Obligations",
    text: "Records may be retained as required for civil aviation directives, legal disputes, and contractual commitments.",
  },
];

const DELETE_POINTS = [
  "Users may update or delete eligible account information through organization settings where available.",
  "Users may contact the Data Protection Office to request an audit and deletion of eligible personal identification and non-mandated telemetry logs.",
  "Certain records may need to be retained where statutory obligations apply.",
];

const LEGAL_REQUIREMENTS = [
  "Comply with statutory legal obligations",
  "Protect and defend enSaio intellectual property",
  "Prevent or investigate possible wrongdoing",
  "Protect users or the general public",
  "Protect against legal liability and cybersecurity intrusions",
];

const SECURITY = [
  {
    label: "Full Architecture Governance",
    text: "Proprietary mathematical kernels, firmware verification bridges, and API layers are governed to control telemetry destinations.",
  },
  {
    label: "End-to-End Encryption",
    text: "The policy specifies TLS 1.3 for communications and AES-256 encryption at rest for persistent databases.",
  },
  {
    label: "Cryptographic Isolation",
    text: "Enterprise tenant missions are designed to execute in isolated environments.",
  },
  {
    label: "Regular Audits",
    text: "The policy specifies independent vulnerability assessments and penetration tests (VAPT) on a biannual basis.",
  },
];

const COMPLIANCE = [
  {
    label: "Digital Personal Data Protection Act, 2023 (DPDP Act - India)",
    text: "Data fiduciary obligations, notice, consent withdrawal, and grievance resolution.",
  },
  {
    label: "National Geospatial Policy (2022) & DGCA Drone Rules",
    text: "Spatial sovereignty, geodetic datum fidelity, and flight-log integrity.",
  },
  {
    label: "General Data Protection Regulation (GDPR - EU)",
    text: "Lawful basis, data minimization, and cross-border protection where applicable.",
  },
];

const PlainList = ({ items }) => (
  <ul className="ensai_privacy_pg_list">
    {items.map((item) => (
      <li key={item} className="ensai_privacy_pg_list_item">
        {item}
      </li>
    ))}
  </ul>
);

const LabeledList = ({ items }) => (
  <ul className="ensai_privacy_pg_list">
    {items.map((item) => (
      <li key={item.label} className="ensai_privacy_pg_list_item">
        <strong className="ensai_privacy_pg_label">{item.label}:</strong>{" "}
        {item.text}
      </li>
    ))}
  </ul>
);

const SectionTitle = ({ number, children }) => (
  <h2 className="ensai_privacy_pg_section_title">
    <span className="ensai_privacy_pg_section_num">{number}</span>
    {children}
  </h2>
);

const PrivacyPolicy = () => {
  const handleTocClick = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="ensai_privacy_pg_page">
      <div className="ensai_privacy_pg_glow" aria-hidden="true" />

      {/* ================= HERO ================= */}
      <header className="ensai_privacy_pg_hero">
        <div className="ensai_privacy_pg_container">
          <span className="ensai_privacy_pg_kicker">Legal</span>
          <h1 className="ensai_privacy_pg_title">Privacy Policy</h1>
          <p className="ensai_privacy_pg_lead">
            How enSaio collects, uses, retains, transfers and protects your
            information.
          </p>
        </div>
      </header>

      <div className="ensai_privacy_pg_container ensai_privacy_pg_layout">
        {/* ================= CONTENTS ================= */}
        <aside className="ensai_privacy_pg_toc" aria-label="On this page">
          <p className="ensai_privacy_pg_toc_title">On this page</p>
          <ul className="ensai_privacy_pg_toc_list">
            {TOC.map((item, index) => (
              <li key={item.id} className="ensai_privacy_pg_toc_item">
                <a
                  href={`#${item.id}`}
                  className="ensai_privacy_pg_toc_link"
                  onClick={(event) => handleTocClick(event, item.id)}
                >
                  <span className="ensai_privacy_pg_toc_num">{index + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="ensai_privacy_pg_content">
          {/* Executive summary */}
          <section className="ensai_privacy_pg_summary">
            <h2 className="ensai_privacy_pg_summary_title">
              Executive Summary &amp; Value-Chain Commitment
            </h2>
            <p className="ensai_privacy_pg_text">
              This Privacy Policy describes the policies and procedures on the
              collection, use, retention, transfer, and disclosure of
              information when users access the enSaio official website
              (ensaio.com), utilize our Digital Rehearsal Studio, execute GNSS
              geodetic calculations, or interact with our flight validation
              APIs and hardware endpoints. It informs users about privacy
              rights and statutory legal protections.
            </p>
            <p className="ensai_privacy_pg_text">
              enSaio Geospatial Technologies Inc. governs its technological
              value chain from firmware verification bridges and ground station
              telemetry links to cloud processing infrastructure. The Company
              maintains safeguards intended to protect survey waypoints, sensor
              calibration matrices, personal identity, and other information
              from unauthorized dissemination.
            </p>
          </section>

          {/* 1 */}
          <section id="ensai_privacy_pg_s1" className="ensai_privacy_pg_section">
            <SectionTitle number="1">Interpretation and Definitions</SectionTitle>

            <h3 className="ensai_privacy_pg_sub_title">1.1 Interpretation</h3>
            <p className="ensai_privacy_pg_text">
              The words of which the initial letter is capitalized have meanings
              defined under the conditions of this Privacy Policy. These
              definitions have the same meaning whether they appear in singular
              or plural.
            </p>

            <h3 className="ensai_privacy_pg_sub_title">1.2 Key Definitions</h3>
            <dl className="ensai_privacy_pg_defs">
              {DEFINITIONS.map((item) => (
                <div key={item.term} className="ensai_privacy_pg_def_row">
                  <dt className="ensai_privacy_pg_def_term">{item.term}</dt>
                  <dd className="ensai_privacy_pg_def_text">{item.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 2 */}
          <section id="ensai_privacy_pg_s2" className="ensai_privacy_pg_section">
            <SectionTitle number="2">
              Collecting and Using Your Personal Data
            </SectionTitle>

            <h3 className="ensai_privacy_pg_sub_title">
              2.1 Types of Data Collected
            </h3>

            <h4 className="ensai_privacy_pg_minor_title">
              A. Personally Identifiable Information (PII)
            </h4>
            <PlainList items={PII} />

            <h4 className="ensai_privacy_pg_minor_title">B. Usage Data</h4>
            <PlainList items={USAGE} />

            <h4 className="ensai_privacy_pg_minor_title">
              C. Mission &amp; Geodetic Telemetry Data
            </h4>
            <PlainList items={MISSION} />

            <div className="ensai_privacy_pg_callout">
              <p className="ensai_privacy_pg_callout_title">
                Sovereign Spatial Privacy Guarantee
              </p>
              <p className="ensai_privacy_pg_callout_text">
                enSaio does not require users to transmit classified,
                proprietary raster imagery or national-security orthophoto
                tiles to public endpoints for the described Digital Rehearsal
                evaluation. Raw survey deliverables may remain on local storage
                or sovereign customer-controlled VPCs.
              </p>
            </div>

            <h3 className="ensai_privacy_pg_sub_title">
              2.2 Tracking Technologies and Cookies
            </h3>
            <LabeledList items={COOKIES} />
          </section>

          {/* 3 */}
          <section id="ensai_privacy_pg_s3" className="ensai_privacy_pg_section">
            <SectionTitle number="3">Use of Your Personal Data</SectionTitle>

            <div className="ensai_privacy_pg_purposes">
              {PURPOSES.map((item) => (
                <div key={item.name} className="ensai_privacy_pg_purpose_row">
                  <p className="ensai_privacy_pg_purpose_name">{item.name}</p>
                  <p className="ensai_privacy_pg_purpose_text">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4 */}
          <section id="ensai_privacy_pg_s4" className="ensai_privacy_pg_section">
            <SectionTitle number="4">
              Retention of Your Personal Data &amp; Geospatial Telemetry
            </SectionTitle>
            <LabeledList items={RETENTION} />
          </section>

          {/* 5 */}
          <section id="ensai_privacy_pg_s5" className="ensai_privacy_pg_section">
            <SectionTitle number="5">
              Transfer of Your Personal Data &amp; Sovereign Data Protection
            </SectionTitle>
            <p className="ensai_privacy_pg_text">
              Personal Data and geodetic parameters may be processed through
              authorized Company infrastructure and service providers. The
              policy identifies Chennai and Mumbai, India as operational
              processing locations.
            </p>
            <LabeledList
              items={[
                {
                  label: "Sovereignty Mandate",
                  text: "The policy states that high-accuracy spatial coordinates, survey bounds over critical infrastructure, and national flight telemetry processed on enSaio platforms are hosted within sovereign Indian borders, subject to the applicable architecture and service.",
                },
                {
                  label: "International Tenants",
                  text: "Enterprise clients operating internationally may be provided regional cloud-residency partitions and applicable contractual safeguards.",
                },
              ]}
            />
          </section>

          {/* 6 */}
          <section id="ensai_privacy_pg_s6" className="ensai_privacy_pg_section">
            <SectionTitle number="6">
              Delete Your Personal Data (Right to Erasure)
            </SectionTitle>
            <PlainList items={DELETE_POINTS} />
            <p className="ensai_privacy_pg_text">
              Data Protection Office:{" "}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="ensai_privacy_pg_link"
              >
                {PRIVACY_EMAIL}
              </a>
            </p>
          </section>

          {/* 7 */}
          <section id="ensai_privacy_pg_s7" className="ensai_privacy_pg_section">
            <SectionTitle number="7">Disclosure of Your Personal Data</SectionTitle>

            <h3 className="ensai_privacy_pg_sub_title">
              7.1 Business Transactions
            </h3>
            <p className="ensai_privacy_pg_text">
              If the Company is involved in a merger, acquisition, or asset
              sale, Personal Data may be transferred subject to applicable
              requirements and continuity of this Policy.
            </p>

            <h3 className="ensai_privacy_pg_sub_title">
              7.2 Law Enforcement and Statutory Authorities
            </h3>
            <p className="ensai_privacy_pg_text">
              The Company may disclose Personal Data where required by
              applicable law or valid legal requests from public authorities.
            </p>

            <h3 className="ensai_privacy_pg_sub_title">
              7.3 Other Legal Requirements
            </h3>
            <PlainList items={LEGAL_REQUIREMENTS} />
          </section>

          {/* 8 */}
          <section id="ensai_privacy_pg_s8" className="ensai_privacy_pg_section">
            <SectionTitle number="8">
              Security of Your Personal Data &amp; Aerospace Value Chain
              Integrity
            </SectionTitle>
            <LabeledList items={SECURITY} />
          </section>

          {/* 9 */}
          <section id="ensai_privacy_pg_s9" className="ensai_privacy_pg_section">
            <SectionTitle number="9">Children&apos;s Privacy</SectionTitle>
            <p className="ensai_privacy_pg_text">
              The Service is engineered for professional GIS engineers,
              licensed UAV pilots, aerospace enterprises, and academic
              surveyors. It does not address children under 18 and does not
              knowingly collect their personal information.
            </p>
          </section>

          {/* 10 */}
          <section id="ensai_privacy_pg_s10" className="ensai_privacy_pg_section">
            <SectionTitle number="10">Links to Other Websites</SectionTitle>
            <p className="ensai_privacy_pg_text">
              The Service may contain links to third-party web portals or GIS
              repositories such as satellite imagery providers, weather
              stations, or drone manufacturer firmware pages. These sites are
              not operated by enSaio, and users should review their privacy
              policies.
            </p>
          </section>

          {/* 11 */}
          <section id="ensai_privacy_pg_s11" className="ensai_privacy_pg_section">
            <SectionTitle number="11">Statutory Compliance Directives</SectionTitle>
            <LabeledList items={COMPLIANCE} />
          </section>

          {/* 12 */}
          <section id="ensai_privacy_pg_s12" className="ensai_privacy_pg_section">
            <SectionTitle number="12">Changes to this Privacy Policy</SectionTitle>
            <p className="ensai_privacy_pg_text">
              enSaio may update this Privacy Policy from time to time. Changes
              will be posted on the relevant page and the Last Updated date will
              be revised. Where appropriate, notice may also be provided through
              email or a service notification.
            </p>
          </section>

          {/* 13 */}
          <section id="ensai_privacy_pg_s13" className="ensai_privacy_pg_section">
            <SectionTitle number="13">
              Grievance Redressal and Contact Us
            </SectionTitle>
            <p className="ensai_privacy_pg_text">
              For questions, inquiries, or privacy-rights requests, users may
              contact enSaio through the following official corporate channels.
            </p>

            <div className="ensai_privacy_pg_contact">
              <p className="ensai_privacy_pg_contact_title">
                Corporate Headquarters (Chennai)
              </p>
              <address className="ensai_privacy_pg_address">
                <span className="ensai_privacy_pg_address_line">
                  enSaio Geospatial Technologies Inc.
                </span>
                <span className="ensai_privacy_pg_address_line">
                  Polyhose Tower No. 86, West Wing, 4th Floor, Anna Salai,
                  Guindy,
                </span>
                <span className="ensai_privacy_pg_address_line">
                  Chennai – 600032, Tamil Nadu, India.
                </span>
              </address>
              <p className="ensai_privacy_pg_contact_row">
                <span className="ensai_privacy_pg_contact_label">
                  Telephone
                </span>
                <a href="tel:+914448002026" className="ensai_privacy_pg_link">
                  +91 44 4800 2026
                </a>
                <span className="ensai_privacy_pg_contact_sep">/</span>
                <a href="tel:+918925923296" className="ensai_privacy_pg_link">
                  +91 89259 23296
                </a>
              </p>
              <p className="ensai_privacy_pg_contact_row">
                <span className="ensai_privacy_pg_contact_label">Email</span>
                <a
                  href={`mailto:${PRIVACY_EMAIL}`}
                  className="ensai_privacy_pg_link"
                >
                  {PRIVACY_EMAIL}
                </a>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;