import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Import Navigate
import "./index.css";
import Home from "./pages/Home";
import User from "./pages/User";
import VocabularyPage from "./pages/User/Vocab";
import TestPage from "./pages/User/Test";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/user" element={<User />}>
          {/* Thiết lập mặc định cho trang /user là /user/vocab */}
          <Route index element={<Navigate to="vocab" />} />
          <Route path="vocab" element={<VocabularyPage />} />
          <Route path="test" element={<TestPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
