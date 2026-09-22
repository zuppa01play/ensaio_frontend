import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import HeaderPage from "./Components/HeaderPage/HeaderPage";
import HomeCard from "./Components/HomeCard/HomeCard";
import HomeMission from "./Components/HomeMission/HomeMission";
import HomeWeather from "./Components/HomeWeather/HomeWeather";
import HomeSimulatorVideo from "./Components/HomeSimulatorVideo/HomeSimulatorVideo";
import HomeCase from "./Components/HomeCaseStudies/HomeCase";
import FooterPage from "./Components/FooterPage/FooterPage";
import HomeUddanVideo from "./Components/HomeUddanVideo/HomeUddanVideo";
import Error from "./Components/PageNotFound/Error";

const Home = () => (
  <>
    <HomePage />
    <HomeCard />
    <HomeMission />
    <HomeWeather />
    <HomeSimulatorVideo />
    <HomeCase />
    <HomeUddanVideo />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="zuppa_app">
        <HeaderPage />

        <main className="zuppa_app_content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/case_fly" element={<CaseFly />} /> */}
            {/* <Route path="/case_native_posting" element={<CaseNativePosting />} /> */}
            {/* <Route path="/case_pipeline" element={<CasePipeline />} /> */}
            {/* <Route path="/case_sop" element={<CaseSop />} /> */}
            <Route path="/*" element={<Error />} />

          </Routes>
        </main>

        <FooterPage />
      </div>
    </BrowserRouter>
  );
}

export default App;