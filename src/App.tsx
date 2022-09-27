import { Header } from "./lib/components";
import { Outlet, useNavigate } from "react-router-dom";
import store, { RootState } from "./lib/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useMatch } from "react-router-dom";
import { debounce } from "lodash";
import { saveState } from "./lib/storage";

store.subscribe(
  debounce(() => {
    saveState(store.getState());
  }, 1000)
);

function App() {
  const match = useMatch("/projects/:id");

  return (
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
  );
}

export default App;
