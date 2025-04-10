import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./index.css";
import Home from "./pages/Home";
import User from "./pages/User"; // layout
import VocabLayout from "./pages/User/Vocab";
import MyList from "./pages/User/Vocab/MyList";
import Learning from "./pages/User/Vocab/Learning";
import Explore from "./pages/User/Vocab/Explore";
import TestPage from "./pages/User/Test";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Layout có Navbar */}
        <Route path="/user" element={<User />}>
          <Route index element={<Navigate to="vocab/my-list" />} />
          
          {/* Layout riêng cho vocab */}
          <Route path="vocab" element={<VocabLayout />}>
            <Route path="my-list" element={<MyList />} />
            <Route path="learning" element={<Learning />} />
            <Route path="explore" element={<Explore />} />
          </Route>

          {/* Trang test */}
          <Route path="test" element={<TestPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
