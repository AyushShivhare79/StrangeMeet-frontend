import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainCall from "./components/MainCall";
import Landing from "./page/Landing";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/video" element={<MainCall />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
