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
import TestDetailPage from "./pages/Admin/Test/Detail";
import AddTestPage from "./pages/Admin/Test/Add";
import DeleteTestPage from "./pages/Admin/Test/Delete";
import UpdatePage from "./pages/Admin/AdminVocab/UpdatePage";
import UserTestPage from "./pages/User/UserTest/ListTest";
import UserTestDetailPage from "./pages/User/UserTest/Detail";
import OverallTestPage from "./pages/User/UserTest/Overall";
import UserTestResultPage from "./pages/User/UserTest/Result";
import Part1Detail from "./pages/User/UserTest/Result/Part1";
import Part2Detail from "./pages/User/UserTest/Result/Part2";
import Part3Detail from "./pages/User/UserTest/Result/Part3";
import LoginPage from "./pages/Auth/Login";
import SignUpPage from "./pages/Auth/SignUp";
import StatisticPage from "./pages/User/Statictic";
import AdminStatisticPage from "./pages/Admin/Statistic";
import UserDetailsPage from "./pages/Admin/User";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

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

          {/* Test routes */}
          <Route path="test">
            <Route index element={<UserTestPage />} />
            <Route path=":id" element={<UserTestDetailPage />} />
            <Route path="overall/:id" element={<OverallTestPage />} />
            <Route path="result/:id" element={<UserTestResultPage />} />
            <Route path="part1/detail/:questionId" element={<Part1Detail />} />
            <Route path="part2/detail/:questionId" element={<Part2Detail />} />
            <Route path="part3/detail/:questionId" element={<Part3Detail />} />
          </Route>
          {/* Statistic routes */}
          <Route path="statistic" element={<StatisticPage />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="admin-vocab/list-page" />} />

          {/* Layout riêng cho vocab */}
          <Route path="admin-vocab" element={<AdminVocabLayout />}>
            <Route path="list-page" element={<ListPage />} />
            <Route path="update-page/:setId" element={<UpdatePage />} />
            <Route path="add-page" element={<AddPage />} />
          </Route>

          {/* Test routes */}
          <Route path="test">
            <Route index element={<AdminTestPage />} />
            <Route path=":id" element={<TestDetailPage />} />{" "}
            <Route path="add-test" element={<AddTestPage />} />
            <Route path="deleted" element={<DeleteTestPage />} />
          </Route>
          <Route path="statistic" element={<AdminStatisticPage />} />
          <Route path="user" element={<UserDetailsPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
