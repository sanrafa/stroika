import { Link } from "react-router-dom";
import { AddProjectForm } from "../lib/components";

function Homepage() {
  const existing = localStorage.getItem("store") ? true : false;

  function handleClearHistory() {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {existing ? (
        <section className="flex flex-col justify-center items-center p-8">
          <h1 className="text-center text-6xl font-manrope">
            Welcome back to <br />
            <span className="font-josefin text-9xl text-categoryToggleUnchecked">
              STROIKA
            </span>
          </h1>
          <Link
            to="projects"
            className="text-5xl hover:text-blue-500 underline hover:no-underline"
          >
            View your projects
          </Link>
          <button
            type="button"
            aria-label="clear local storage"
            className="mt-10 hover:text-red-500"
            onClick={handleClearHistory}
          >
            Clear project history
          </button>
        </section>
      ) : (
        <section className="flex flex-col justify-center items-center p-8 text-center ">
          <h1 className="text-6xl font-manrope">Welcome to</h1>
          <span className="font-josefin text-9xl text-categoryToggleUnchecked">
            STROIKA
          </span>
          <p className="text-3xl font-manrope">
            project management for the lone dev
          </p>
          <hr className="bg-white w-screen my-6" />
          <AddProjectForm />
        </section>
      )}
    </>
  );
}

export default Homepage;
