import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Homepage, ProjectPage } from "./lib/pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="project" element={<ProjectPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
