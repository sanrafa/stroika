import { Header } from "./lib/components";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <main className="bg-black text-compText h-screen">
      <Header />

      <Outlet />
    </main>
  );
}

export default App;
