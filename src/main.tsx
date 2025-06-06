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
import ListPage from "./pages/Admin/AdminVocab/ListPage";
import AddPage from "./pages/Admin/AdminVocab/AddPage";
import Admin from "./pages/Admin";
import AdminVocabLayout from "./pages/Admin/AdminVocab";
import VocabSetCardDetails from "./pages/User/VocabSetCardDetails";
import FlashcardsPage from "./pages/User/VocabSetCardDetails/FlashcardPage";
import FlashCardSet from "./pages/User/VocabSetCardDetails/FlashcardSet";
import AdminTestPage from "./pages/Admin/Test/ListTest";
import TestUpdatePage from "./pages/Admin/Test/Update";
import AddTestPage from "./pages/Admin/Test/Add";
import DeleteTestPage from "./pages/Admin/Test/Delete";
import UpdatePage from "./pages/Admin/AdminVocab/UpdatePage";
import UserTestPage from "./pages/User/UserTest/ListTest";
import UserTestDetailPage from "./pages/User/UserTest/Detail";
import OverallTestPage from "./pages/User/UserTest/Overall";
import UserTestResultPage from "./pages/User/UserTest/Result";
import PartDetail from "./pages/User/UserTest/Result/Part";

import LoginPage from "./pages/Auth/Login";
import SignUpPage from "./pages/Auth/SignUp";
import StatisticPage from "./pages/User/Statictic";
import AdminStatisticPage from "./pages/Admin/Statistic";
import UserDetailsPage from "./pages/Admin/User";
import ForgotPasswordPage from "./pages/Auth/Forgot";
import ResetPasswordPage from "./pages/Auth/Reset";
import DeletedPage from "./pages/Admin/AdminVocab/DeletedPage";
import DeletedVocabPage from "./pages/User/VocabSetCardDetails/DeletedPage";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="/home" element={<Home />} />

        {/* Layout không có Navbar */}
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
            <Route path="soft-deleted" element={<DeletedVocabPage />} />
            <Route path="flashcard" element={<FlashcardsPage />} />
          </Route>

          {/* Test routes */}
          <Route path="test">
            <Route index element={<UserTestPage />} />
            <Route path=":id" element={<UserTestDetailPage />} />
            <Route path="overall/:id" element={<OverallTestPage />} />
            <Route path="result/:id" element={<UserTestResultPage />} />
            <Route path="part/detail/:questionId" element={<PartDetail />} />
          </Route>
          {/* Statistic routes */}
          <Route path="statistic" element={<StatisticPage />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="admin-vocab/list-page" />} />

          {/* Layout riêng cho vocab */}
          <Route path="admin-vocab" element={<AdminVocabLayout />}>
            <Route path="list-page" element={<ListPage />} />
            <Route path="deleted-page" element={<DeletedPage />} />
            <Route path="update-page/:setId" element={<UpdatePage />} />
            <Route path="add-page" element={<AddPage />} />
          </Route>

          {/* Test routes */}
          <Route path="test">
            <Route index element={<AdminTestPage />} />
            <Route path=":id" element={<TestUpdatePage />} />{" "}
            <Route path="add-test" element={<AddTestPage />} />
            <Route path="deleted-page" element={<DeleteTestPage />} />
          </Route>
          <Route path="statistic" element={<AdminStatisticPage />} />
          <Route path="user" element={<UserDetailsPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
