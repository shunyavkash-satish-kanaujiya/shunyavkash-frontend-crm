import { useEffect, useState, useCallback } from "react";
import { ArrowLeftIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useProjectStore } from "../../store/projectStore";
import { AssignEmployeeModel } from "./AssignEmployeeModel.jsx";

export const ProjectDetails = ({ projectId, goBack }) => {
  const [project, setProject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const { setEditingProject } = useProjectStore();

  const fetchProject = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/project/${projectId}`
      );
      setProject(res.data);
      setEditingProject(res.data);
    } catch (err) {
      console.error("Failed to fetch project details:", err);
    }
  }, [projectId, setEditingProject]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (!project) return <div className="p-4">Loading...</div>;

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
        <h2 className="text-2xl font-semibold">{project.title}</h2>
        <p className="text-gray-600">
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
        <h3 className="text-lg font-semibold mb-2">Client Details</h3>
        <p>
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
            className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
          >
            <UserPlusIcon className="w-4 h-4" />
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
                  <p className="font-semibold">
                    {assign.employee?.firstName} {assign.employee?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {assign.role || "No role assigned"}
                  </p>
                </div>
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
          closeModal={() => {
            setShowAssignModal(false);
            fetchProject();
          }}
        />
      )}
    </div>
  );
};
