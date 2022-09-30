import { Header } from "./lib/components";
import { Outlet, useNavigate } from "react-router-dom";
import store, { RootState } from "./lib/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useMatch } from "react-router-dom";
import { debounce } from "lodash";
import { saveState } from "./lib/storage";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import React from "react";

store.subscribe(
  debounce(() => {
    saveState(store.getState());
  }, 1000)
);

const checkRecentProject = () => {
  const ls = localStorage.getItem("store");
  if (typeof ls === "string") {
    const saved = JSON.parse(ls) as RootState;
    const mostRecent = saved.session.currentProjectId;
    return mostRecent ? mostRecent : null;
  }
};

function App() {
  const match = useMatch("/projects/:id");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (match) return; // if already on project page, don't run - cannot visit home otherwise
    const recentProj = checkRecentProject();
    if (recentProj)
      navigate(`/projects/${recentProj}`, {
        replace: true,
      });
  }, []);

  return (
    <TooltipProvider delayDuration={500}>
      <Provider store={store}>
        <main
          className={`bg-black text-compText ${
            match ? "h-screen" : "min-h-screen"
          }`}
        >
          <Header />

          <Outlet />
        </main>
        <Toaster position="top-right" />
      </Provider>
    </TooltipProvider>
  );
}

export default App;
