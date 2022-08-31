import { Header } from "./lib/components";
import { Outlet } from "react-router-dom";
import store from "./lib/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <main className="bg-black text-compText h-screen">
        <Header />

        <Outlet />
      </main>
    </Provider>
  );
}

export default App;
