import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sender } from "./components/Sender";
import { Receiver } from "./components/Receiver";
import "./App.css";
import Test from "./components/Test";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
