import { useParams } from "react-router-dom";

function ProjectView() {
  const { id } = useParams();

  return <h1>{id}</h1>;
}

export default ProjectView;
