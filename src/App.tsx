import { Header } from "./lib/components";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      {/* 
          After user session flow is created, switch between basic header and project header using path match
          Likely going to happen within the component
      */}
      <Header />
      <main className="bg-black text-compText h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default App;
