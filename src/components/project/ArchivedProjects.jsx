import { useEffect } from "react";
import { useProjectStore } from "../../store/projectStore";
import { ArchivedProjectTable } from "./ArchivedProjectTable";

export const ArchivedProjects = () => {
  const fetchArchivedProjects = useProjectStore(
    (state) => state.fetchArchivedProjects
  );
  const archivedProjects = useProjectStore((state) => state.archivedProjects);

  useEffect(() => {
    fetchArchivedProjects();
  }, [fetchArchivedProjects]);

  return <ArchivedProjectTable projects={archivedProjects} />;
};
