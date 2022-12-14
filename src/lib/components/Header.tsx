import React from "react";
import { useMatch, Link, useParams } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownArrow,
  DropdownCheckboxItem,
  DropdownItemIndicator,
  Tooltip,
} from "./index";

import logo from "../../assets/logo-darkmode.svg";
import {
  DotsVerticalIcon as MenuIcon,
  Cross1Icon as CloseIcon,
  ColumnsIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import { useAppDispatch, useProxySelector } from "../store/hooks";
import { updateProject, addColumn } from "../store/actions";
import { getProjectById } from "../store/projects";
import { nanoid } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

function Header() {
  const dispatch = useAppDispatch();
  let match = useMatch("/projects/:id");
  const { id } = useParams();
  const project = useProxySelector(
    (state) => getProjectById(state, id as string),
    [id]
  );

  const archiveTasks = Boolean(project?.config.archiveTasks);
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(project?.name);
  const addColumnDisabled = project?.columns.length === 3;
  const projectNameInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setName(project?.name);
  }, [name !== project?.name]);

  React.useEffect(() => {
    if (projectNameInputRef.current) {
      if (isEditing) projectNameInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (!name) {
      toast.error("A name must be provided!", {
        duration: 2000,
      });
      return;
    }
    dispatch(
      updateProject({
        id: id as string,
        changes: { name: name.trim(), updatedAt: Date() },
      })
    );
    setIsEditing(false);
  };

  function handleChecked() {
    dispatch(
      updateProject({
        id: id as string,
        changes: {
          config: {
            archiveTasks: !archiveTasks,
          },
        },
      })
    );
  }

  return (
    <>
      <header className={match ? "project-header" : "header"}>
        <Link
          to="/"
          className="block w-1/6 p-2 ml-1"
          aria-label="Go to homepage"
        >
          <img src={logo} alt="Stroika logo" />
        </Link>
        {match ? (
          <>
            <form
              onClick={() => setIsEditing(true)}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="ml-4"
            >
              <h1 tabIndex={0}>
                <input
                  onBlur={handleSubmit}
                  type="text"
                  className={`text-black text-5xl text-center font-light w-11/12 disabled:bg-black disabled:text-compText disabled:cursor-pointer`}
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-describedby="rename-project"
                  disabled={!isEditing}
                  ref={projectNameInputRef}
                />
              </h1>
              <button
                type="submit"
                id="rename-project"
                className="hidden"
                aria-label={`${
                  isEditing
                    ? "rename project"
                    : "click or go to options to rename project"
                }`}
              ></button>
            </form>

            <div className="flex space-x-4">
              <button
                aria-label="add new column"
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
                <Tooltip content="Add New Column" side="bottom" align="center">
                  <ColumnsIcon width={32} height={32} color="white" />
                </Tooltip>
              </button>
              <Dropdown>
                <DropdownTrigger asChild>
                  <button
                    type="button"
                    className="text-xl p-4 hover:bg-gray-800"
                  >
                    OPTIONS
                  </button>
                </DropdownTrigger>
                <DropdownContent
                  loop
                  sideOffset={4}
                  onCloseAutoFocus={(e) => {
                    e.preventDefault();
                    if (isEditing) {
                      projectNameInputRef?.current?.focus();
                    }
                  }}
                  className="bg-white text-black font-manrope text-center p-0.5"
                >
                  <DropdownItem
                    asChild
                    onSelect={() => {
                      setIsEditing(true);
                    }}
                  >
                    <button
                      type="button"
                      className="hover:bg-slate-300 focus:bg-slate-300 p-1 py-2 rounded w-full"
                    >
                      Rename Project
                    </button>
                  </DropdownItem>
                  <DropdownCheckboxItem
                    className="flex items-center hover:bg-slate-300 focus:bg-slate-300 p-1 py-2 rounded cursor-pointer"
                    checked={archiveTasks}
                    onCheckedChange={handleChecked}
                  >
                    <DropdownItemIndicator>
                      <DotIcon width={32} height={32} />
                    </DropdownItemIndicator>
                    Archive tasks on column change
                  </DropdownCheckboxItem>
                  <DropdownSeparator asChild>
                    <hr className=" bg-black my-0.5" />
                  </DropdownSeparator>
                  {/*  <DropdownItem className="p-1">
                    <span className="line-through">Export Project</span> TBA
                  </DropdownItem> */}
                </DropdownContent>
              </Dropdown>
              <Link
                to="projects"
                className="text-xl p-5 hover:bg-gray-800"
                aria-label="view all projects" /* should there be a separate aria label? */
              >
                CLOSE
              </Link>
            </div>
          </>
        ) : null}
      </header>
      <hr className=" border-line p-0.25 border rounded" />
    </>
  );
}

export default React.memo(Header);
