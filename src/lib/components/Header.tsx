import { useMatch } from "react-router-dom";

import logo from "../../assets/logo-darkmode.svg";

export default function Header() {
  let match = useMatch("project");

  return (
    <header className={match ? "project-header" : "header"}>
      <img src={logo} alt="Stroika logo" className="w-1/6 p-2" />
    </header>
  );
}
