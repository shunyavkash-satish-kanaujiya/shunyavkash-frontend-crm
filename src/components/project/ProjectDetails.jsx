import { useEffect, useState } from "react";
import { ArrowLeftIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useProjectStore } from "../../store/projectStore";
import { AssignEmployeeModel } from "./AssignEmployeeModel.jsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const ProjectDetails = ({ projectId, goBack }) => {
  const [project, setProject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const { fetchProjectById, removeAssignedEmployee, projectLoading } =
    useProjectStore();

  useEffect(() => {
    const loadProject = async () => {
      const projectData = await fetchProjectById(projectId);
      if (projectData) {
        setProject(projectData);
      }
    };

    loadProject();
  }, [projectId, fetchProjectById]);

  if (projectLoading || !project)
    return <div className="p-4">Loading project details...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center text-indigo-600 hover:underline"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
        Back
      </button>

      {/* Project Info */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-2xl font-semibold capitalize">{project.title}</h2>
        <p className="text-gray-600 bg-indigo-50 rounded-lg p-3 first-letter:capitalize">
          {project.description || "No description provided."}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <p>
            <strong>Start Date:</strong>{" "}
            {project.startDate
              ? new Date(project.startDate).toLocaleDateString()
              : "—"}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {project.endDate
              ? new Date(project.endDate).toLocaleDateString()
              : "—"}
          </p>
          <p>
            <strong>Status:</strong> {project.status}
          </p>
          <p>
            <strong>Priority:</strong> {project.priority}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div className="bg-indigo-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-2 tracking-wide">
          Client Details
        </h3>
        <p className="capitalize">
          <strong>Name:</strong> {project.client?.name || "—"}
        </p>
        <p>
          <strong>Email:</strong> {project.client?.email || "—"}
        </p>
        <p>
          <strong>Phone:</strong> {project.client?.phone || "—"}
        </p>
      </div>

      {/* Assigned Employees */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Assigned Employees</h3>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            <UserPlusIcon className="w-4 h-4 stroke-2" />
            Assign Employee
          </button>
        </div>
        {project.assignedEmployees?.length > 0 ? (
          <ul className="space-y-2">
            {project.assignedEmployees.map((assign, index) => (
              <li
                key={`${assign._id}-${index}`}
                className="border p-3 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold capitalize">
                    {assign.employee?.firstName} {assign.employee?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {assign.role || "No role assigned"}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const confirm = window.confirm(
                      `Remove ${assign.employee?.firstName} from this project?`
                    );
                    if (!confirm) return;

                    const success = await removeAssignedEmployee(
                      project._id,
                      assign.employee._id
                    );

                    if (success) {
                      // Refresh project after removal
                      const updatedProject = await fetchProjectById(projectId);
                      if (updatedProject) {
                        setProject(updatedProject);
                      }
                    }
                  }}
                  className="text-red-600 px-3 py-1 text-sm"
                >
                  <XMarkIcon className="w-6 h-6 inline" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No employees assigned yet.</p>
        )}
      </div>

      {/* Assign Employee Modal */}
      {showAssignModal && (
        <AssignEmployeeModel
          project={project}
          projectId={projectId}
          closeModal={async () => {
            setShowAssignModal(false);

            // Refresh project data when modal is closed
            const updatedProject = await fetchProjectById(projectId);
            if (updatedProject) {
              setProject(updatedProject);
            }
          }}
        />
      )}
    </div>
  );
};
