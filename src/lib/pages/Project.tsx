import { Column } from "../components";
import testColumns from "../mocks/columns";

function ProjectPage() {
  return (
    <>
      <hr />
      <div className="bg-project p-4 m-4 h-5/6 flex justify-between">
        {testColumns.map((col) => (
          <Column name={col.columnName} />
        ))}
      </div>
    </>
  );
}

export default ProjectPage;
