import { useMatch, Link } from "react-router-dom";

import logo from "../../assets/logo-darkmode.svg";
import {
  DotsVerticalIcon as MenuIcon,
  Cross1Icon as CloseIcon,
} from "@radix-ui/react-icons";

export default function Header() {
  let match = useMatch("project");

  return (
    <header className={match ? "project-header" : "header"}>
      <Link to="/" className="block w-1/6 p-2">
        <img src={logo} alt="Stroika logo" className="" />
      </Link>
      {match ? (
        <>
          <h1 className="text-4xl text-white font-josefin mt-2">
            PROJECT NAME
          </h1>

          <MenuIcon width={32} height={32} color="white" />

          <Link to="projects" className="text-xl p-4 hover:bg-gray-500">
            <CloseIcon width={32} height={32} color="white" />
          </Link>
        </>
      ) : null}
    </header>
  );
}
