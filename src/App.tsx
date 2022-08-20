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
      <Outlet />
    </>
  );
}

export default App;
