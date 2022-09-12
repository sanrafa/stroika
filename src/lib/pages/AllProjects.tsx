import { AddProjectForm } from "../components";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { deleteProject, setCurrentProject } from "../store/actions";
import { getAllProjects } from "../store/projects";
import { Link } from "react-router-dom";
import React from "react";

function ProjectsPage() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(getAllProjects);

  React.useEffect(() => {
    dispatch(setCurrentProject({ id: null }));
  }, []);

  return (
    <>
      <h1>PROJECTS PAGE</h1>
      <AddProjectForm />
      <ul>
        {projects.map((project) => (
          <li>
            <Link to={`/projects/${project.id}`}>{project.name}</Link>{" "}
            <button
              type="button"
              onClick={() => dispatch(deleteProject(project.id))}
              className="bg-white text-black p-1"
            >
              DELETE
            </button>
            <br />
            <span>CREATED AT: {project.createdAt}</span> <br />
            {project.updatedAt ? (
              <span>LAST EDITED: {project.updatedAt}</span>
            ) : null}
            <br />
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProjectsPage;
