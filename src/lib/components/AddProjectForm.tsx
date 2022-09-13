import React from "react";
import { addProject, updateProject } from "../store/actions";
import { generateDefaultColumns, addManyColumns } from "../store/columns";
import { useAppDispatch } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const AddProjectForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [name, setName] = React.useState("");

  const createProject = (name: string) => {
    const {
      payload: { id },
    } = dispatch(
      addProject({
        id: nanoid(3),
        name,
        createdAt: Date(),
        columns: [],
        updatedAt: null,
      })
    );
    const cols = generateDefaultColumns(id);
    dispatch(addManyColumns(cols));
    dispatch(
      updateProject({ id, changes: { columns: cols.map((col) => col.id) } })
    );
    return id;
  };

  return (
    <form
      className="flex flex-col items-center space-y-4 my-2 font-manrope"
      onSubmit={(e) => {
        e.preventDefault();
        const id = createProject(name);
        if (id) {
          toast.success("Project created!", {
            duration: 1000,
          }); // Convert to 'project saved' when hooked to a backend
          setName("");
          navigate(`/projects/${id}`);
        }
      }}
    >
      <label htmlFor="new-project" className="text-xl">
        Create a new project:
      </label>
      <input
        className="text-black p-1 text-2xl text-center rounded-md bg-slate-600 focus:bg-slate-200"
        type="text"
        name="new-project"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
      />
      <button
        type="submit"
        className="bg-green-700 hover:bg-green-500 p-1.5 rounded-sm font-bold tracking-wider"
      >
        ADD PROJECT
      </button>
    </form>
  );
};

export default AddProjectForm;
