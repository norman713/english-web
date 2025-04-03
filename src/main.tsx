import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import User from "./pages/User";
import VocabularyPage from "./pages/User/Vocab";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />}>
          <Route index element={<Home />} />
          <Route path="vocab" element={<VocabularyPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
