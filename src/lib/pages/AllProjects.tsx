import { AddProjectForm } from "../components";
import { useAppSelector } from "../store/hooks";
import { getAllProjects } from "../store/projects";
import { Link } from "react-router-dom";

function ProjectsPage() {
  const projects = useAppSelector(getAllProjects);

  return (
    <>
      <h1>PROJECTS PAGE</h1>
      <AddProjectForm />
      <ul>
        {projects.map((project) => (
          <li>
            <Link to={`/projects/${project.id}`}>{project.name}</Link> <br />
            <span>CREATED AT: {project.createdAt}</span> <br />
            {project.updatedAt ? (
              <span>LAST EDITED: {project.updatedAt}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProjectsPage;
