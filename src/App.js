import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Components/HomePage/HomePage";
import HeaderPage from "./Components/HeaderPage/HeaderPage";
import HomeCard from "./Components/HomeCard/HomeCard";
import HomeMission from "./Components/HomeMission/HomeMission";
import HomeSimulatorVideo from "./Components/HomeSimulatorVideo/HomeSimulatorVideo";
import HomeCase from "./Components/HomeCaseStudies/HomeCase";
import FooterPage from "./Components/FooterPage/FooterPage";
import HomeUddanVideo from "./Components/HomeUddanVideo/HomeUddanVideo";
import Error from "./Components/PageNotFound/Error";

import WhyEnSai from "./Pages/WhyEnSai/WhyEnSai";

import GisPage from "./Components/HomeCaseStudies/HomeSubCaseStudies/GisPage/GisPage";
import Photogrammatric from "./Components/HomeCaseStudies/HomeSubCaseStudies/Photogrammatric/Photogrammatric";
import CaseMissionPlanning from "./Components/HomeCaseStudies/HomeSubCaseStudies/CaseMissionPlanning/CaseMissionPlanning";
import HomeTextPage from "./Components/HomeTextPage/HomeTextPage";
import Dronesection from "./Components/DroneGPS/Dronesection"
const Home = () => (
  <>
    <Dronesection />
    <HomeTextPage/>
    <HomeCard />
    <HomeMission />
    <HomeSimulatorVideo />
    <HomeCase />
    <HomeUddanVideo />
  </>
);

function App() {
  return (
    <BrowserRouter basename="/ensaio_frontend">
      <div className="zuppa_app">
        <HeaderPage />

        <main className="zuppa_app_content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/ensai_why" element={<WhyEnSai />} />

            <Route path="/case_fly" element={<GisPage />} />

            <Route
              path="/case_photogrammatric"
              element={<Photogrammatric />}
            />

            <Route
              path="/case_pipeline"
              element={<CaseMissionPlanning />}
            />

            <Route path="*" element={<Error />} />
          </Routes>
        </main>

        <FooterPage />
      </div>
    </BrowserRouter>
  );
}

export default App;