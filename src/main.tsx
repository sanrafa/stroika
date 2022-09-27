import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Homepage, ProjectsPage, ProjectView } from "./pages";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "@fontsource/josefin-sans";
import "@fontsource/josefin-sans/200.css";
import "@fontsource/manrope";

import { RootState } from "./lib/store";

const recentProject = () => {
  const ls = localStorage.getItem("store");
  if (typeof ls === "string") {
    const saved = JSON.parse(ls) as RootState;
    const mostRecent = saved.session.currentProjectId;
    if (mostRecent) return mostRecent;
  }
  return null;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="projects" element={<ProjectsPage />}></Route>
          <Route path="projects/:id" element={<ProjectView />} />
          <Route
            index
            element={
              recentProject() ? (
                <Navigate replace to={`/projects/${recentProject()}`} />
              ) : (
                <Homepage />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
