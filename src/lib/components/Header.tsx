import { useMatch, Link } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownArrow,
} from "./index";

import logo from "../../assets/logo-darkmode.svg";
import {
  DotsVerticalIcon as MenuIcon,
  Cross1Icon as CloseIcon,
} from "@radix-ui/react-icons";

export default function Header() {
  let match = useMatch("project");

  return (
    <>
      <header className={match ? "project-header" : "header"}>
        <Link to="/" className="block w-1/6 p-2">
          <img src={logo} alt="Stroika logo" className="" />
        </Link>
        {match ? (
          <>
            <h1 className="text-4xl text-white font-josefin mt-2 font-light">
              PROJECT NAME
            </h1>
            <div className="flex space-x-4">
              <Dropdown>
                <DropdownTrigger asChild={true}>
                  <button
                    type="button"
                    className="hover:bg-gray-800 p-4 rounded-full m-1"
                  >
                    <MenuIcon width={32} height={32} color="white" />
                  </button>
                </DropdownTrigger>
                <DropdownContent className="bg-white text-black font-manrope text-center p-0.5">
                  <DropdownItem className="p-1">Save Project</DropdownItem>
                  <DropdownSeparator asChild={true}>
                    <hr className=" bg-black my-1" />
                  </DropdownSeparator>
                  <DropdownItem className="p-1">Export Project</DropdownItem>
                  <DropdownArrow fill="white" height={8} />
                </DropdownContent>
              </Dropdown>

              <Link to="projects" className="text-xl p-5 hover:bg-gray-800">
                <CloseIcon width={32} height={32} color="white" />
              </Link>
            </div>
          </>
        ) : null}
      </header>
      <hr className="border-1 bg-line border-line" />
    </>
  );
}
