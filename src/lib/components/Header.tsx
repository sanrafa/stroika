import React from "react";
import { useMatch, Link, useParams } from "react-router-dom";
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
  ColumnsIcon,
} from "@radix-ui/react-icons";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateProject, addColumn } from "../store/actions";
import { nanoid } from "@reduxjs/toolkit";

export default function Header() {
  const dispatch = useAppDispatch();
  let match = useMatch("/projects/:id");
  const { id } = useParams();
  const project = useAppSelector(
    (state) => state.projects.entities[id as string]
  );

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(project?.name);
  const addColumnDisabled = project?.columns.length === 3;

  return (
    <>
      <header className={match ? "project-header" : "header"}>
        <Link to="/" className="block w-1/6 p-2 ml-1">
          <img src={logo} alt="Stroika logo" className="" />
        </Link>
        {match ? (
          <>
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(
                    updateProject({
                      id: id as string,
                      changes: { name: name, updatedAt: Date() },
                    })
                  );
                  setIsEditing(false);
                }}
              >
                <input
                  type="text"
                  className="text-black text-4xl text-center font-light"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="project-name"
                />
                <button type="submit" className="hidden"></button>
              </form>
            ) : (
              <h1 className="text-4xl text-white font-josefin mt-2 font-light">
                {project?.name}
              </h1>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                className={`p-4 rounded-full m-1 ${
                  addColumnDisabled ? "opacity-30" : "hover:bg-green-800"
                }`}
                disabled={addColumnDisabled}
                onClick={() => {
                  dispatch(
                    addColumn({
                      id: nanoid(5),
                      projectId: project?.id as string,
                      name: "NEW COLUMN",
                    })
                  );
                }}
              >
                <ColumnsIcon width={32} height={32} color="white" />
              </button>
              <Dropdown>
                <DropdownTrigger asChild>
                  <button
                    type="button"
                    className="hover:bg-gray-800 p-4 rounded-full m-1"
                  >
                    <MenuIcon
                      width={32}
                      height={32}
                      color="white"
                      id="menu-icon"
                    />
                  </button>
                </DropdownTrigger>
                <DropdownContent className="bg-white text-black font-manrope text-center p-0.5">
                  <DropdownItem asChild>
                    <button
                      type="button"
                      className="hover:bg-slate-300 p-1 py-2 rounded"
                      onClick={() => setIsEditing(true)}
                    >
                      Rename Project
                    </button>
                  </DropdownItem>
                  <DropdownSeparator asChild>
                    <hr className=" bg-black my-0.5" />
                  </DropdownSeparator>
                  <DropdownItem className="p-1">Save Project</DropdownItem>
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
      <hr className=" border-line p-0.25 border rounded" />
    </>
  );
}
