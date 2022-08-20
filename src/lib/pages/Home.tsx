import { Link } from "react-router-dom";

function Homepage() {
  return (
    <>
      <h1>Welcome to Stroika</h1>
      <Link to="project">GET STARTED</Link>
    </>
  );
}

export default Homepage;
