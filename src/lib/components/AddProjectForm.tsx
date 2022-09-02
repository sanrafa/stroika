import React from "react";
import { addProject, updateProject } from "../store/projects";
import { generateDefaultColumns, addManyColumns } from "../store/columns";
import { useAppDispatch } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";

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
      onSubmit={(e) => {
        e.preventDefault();
        const id = createProject(name);
        setName("");
        navigate(`/project/${id}`);
      }}
    >
      <label htmlFor="new-project">Create a new project:</label>
      <input
        className="text-black"
        type="text"
        name="new-project"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
      />
      <button type="submit">ADD PROJECT</button>
    </form>
  );
};

export default AddProjectForm;
