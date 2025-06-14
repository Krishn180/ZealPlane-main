import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import axios from "axios";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import ForumHome from "./pages/forum/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import MyComponent from "./utils/projectapi";
import Landing from "./pages/home/Landing";
import RegisterComponent from "./pages/credentials/RegisterComponent";
import AvatarComponent from "./pages/ProfileCard/avatar";
import LoginComponent from "./pages/credentials/LoginComponent";
import DetailsPage from "./pages/ProfileCard/TabComponent/ProjectComponent/DetailsPage/DetailsPage";
import ProjectPage from "./pages/ProfileCard/TabComponent/ProjectComponent/ProjectPage";
import DemoProjectPage from "./components/carousel/DemoProject";
import Notification from "./components/Notification/Notification";
import ForgotPassword from "./pages/credentials/ForgotPassword";
import PostDetail from "./pages/forum/PostDetail";
import CreatePost from "./pages/forum/CreatePost";
import Viewer from "./pages/ProfileCard/TabComponent/ProjectComponent/DetailsPage/Viewer";
import SettingsPage from "./pages/setting/Setting";
import BlankPage from "./pages/ProfileCard/TabComponent/ProjectComponent/DetailsPage/blank";
import Checkout from "./components/checkout/Checkout";
import About from "./components/footer/about";
import FAQ from "./components/footer/faq";

import "./App.scss";
import { initGA, trackPageView } from "./Analytics";

function App() {
  const dispatch = useDispatch();
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdLocalStorage;
  const { url } = useSelector((state) => state.home);

  // Use location to check the current path
  // Use location to check the current path
  const location = useLocation();

   // Check if the current path is in the list of paths to hide footer
  const shouldHideFooter = hideFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

    useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // List of paths where the footer should be hidden
  const hideFooterPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/details/",
    "/forum/create-post", // ✅ Added this line
  ];

 

  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/viewer" element={<Viewer />} />
          <Route path="/blank" element={<BlankPage />} />
          <Route path="/home/notification" element={<Notification />} />
          <Route path="/details/:projectId" element={<DetailsPage />} />
          <Route path="/home/:id" element={<DemoProjectPage />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forum" element={<ForumHome />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/forum/create-post" element={<CreatePost />} />
          <Route path="/profile/:id" element={<AvatarComponent />} />
          <Route path="/p" element={<MyComponent />} />
          <Route path="/:mediaType/:id" element={<Details />} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/explore/:mediaType" element={<Explore />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </main>

      {/* Conditionally render Footer based on the current path */}
      {/* {!shouldHideFooter && <Footer />} */}
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
