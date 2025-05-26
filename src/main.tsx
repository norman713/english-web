import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Home from "./pages/Home";
import User from "./pages/User"; // layout
import VocabLayout from "./pages/User/UserVocab";
import MyList from "./pages/User/UserVocab/MyList/MyList";
import Learning from "./pages/User/UserVocab/Learning";
import Explore from "./pages/User/UserVocab/Explore";
import TestPage from "./pages/User/UserTest";
import ListPage from "./pages/Admin/AdminVocab/ListPage";
import AddPage from "./pages/Admin/AdminVocab/AddPage";
import Admin from "./pages/Admin";
import AdminVocabLayout from "./pages/Admin/AdminVocab";
import VocabSetCardDetails from "./pages/User/VocabSetCardDetails";
import FlashcardsPage from "./pages/User/VocabSetCardDetails/FlashcardPage";
import FlashCardSet from "./pages/User/VocabSetCardDetails/FlashcardSet";
import AdminTestPage from "./pages/Admin/Test/ListTest";
import TestDetailPage from "./pages/Admin/Test/Detail";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Layout có Navbar */}
        <Route path="/user" element={<User />}>
          <Route index element={<Navigate to="user-vocab/my-list" />} />

          {/* Layout riêng cho vocab */}
          <Route path="user-vocab" element={<VocabLayout />}>
            <Route path="my-list" element={<MyList />} />
            <Route path="learning" element={<Learning />} />
            <Route path="explore" element={<Explore />} />
          </Route>
          {/* VocabSetCardDetails as a parent route with outlet */}
          <Route path="learn/:setId" element={<VocabSetCardDetails />}>
            <Route index element={<FlashCardSet />} />
            <Route path="flashcard" element={<FlashcardsPage />} />
          </Route>

          <Route path="test" element={<TestPage />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="admin-vocab/list-page" />} />

          {/* Layout riêng cho vocab */}
          <Route path="admin-vocab" element={<AdminVocabLayout />}>
            <Route path="list-page" element={<ListPage />} />
            <Route path="add-page" element={<AddPage />} />
          </Route>

          {/* Test routes */}
          <Route path="test">
            <Route index element={<AdminTestPage />} /> {/* render ListTest */}
            <Route path=":id" element={<TestDetailPage />} />{" "}
            {/* render chi tiết đề */}
          </Route>
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
