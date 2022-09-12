import type { IProject } from "../types";
import { useAppDispatch } from "../store/hooks";
import { deleteProject } from "../store/actions";
import { Link } from "react-router-dom";

type Props = {
  project: IProject;
};

const ProjectCard = ({ project }: Props) => {
  const dispatch = useAppDispatch();
  return (
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
      {project.updatedAt ? <span>LAST EDITED: {project.updatedAt}</span> : null}
      <br />
    </li>
  );
};

export default ProjectCard;
