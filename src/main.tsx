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
import User from "./pages/User";
import MyList from "./pages/User/Vocab/MyList";
import Learning from "./pages/User/Vocab/Learning";
import Explore from "./pages/User/Vocab/Explore";
import TestPage from "./pages/User/Test";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/user" element={<User />}>
          {/* Redirect mặc định về /user/vocab/my-list */}
          <Route index element={<Navigate to="vocab/my-list" />} />

          <Route path="vocab/my-list" element={<MyList />} />
          <Route path="vocab/learning" element={<Learning />} />
          <Route path="vocab/explore" element={<Explore />} />

          <Route path="test" element={<TestPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
