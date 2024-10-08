import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sender } from "./components/Sender";
import { Receiver } from "./components/Receiver";

import "./App.css";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/sender" element={<Sender />} />
          <Route path="/receiver" element={<Receiver />} />
        </Routes>
      </BrowserRouter> */}
      <HeroSection />
    </>
  );
}

export default App;
