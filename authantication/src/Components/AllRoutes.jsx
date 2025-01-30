import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../Auths/Home";
import Login from "../Auths/login";
import Details from "../Book/Details";
import LibrarianPanel from "../Auths/librarianHome";
import StudentHome from "../Auths/studentHome";
export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/bookDetails" element={<Details />} />{" "}
      <Route path="/librarian" element={<LibrarianPanel />} />
      <Route path="/student" element={<StudentHome />} />
    </Routes>
  );
}
