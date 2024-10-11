import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainCall from "./components/MainCall";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<MainCall />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
