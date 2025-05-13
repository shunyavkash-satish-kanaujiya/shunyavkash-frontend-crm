import React, { useEffect, useState } from "react";
import { TaskList } from "../tasks/TaskList";
import { ReusableModal } from "../ui/ReusableModal";
import { TaskForm } from "../tasks/TaskForm";
import { useTaskStore } from "../../store/taskStore";
import { safeLowerCase } from "../../utils/safeLowerCase";

export const ProjectTasksTab = ({ projectId }) => {
  const { tasks, fetchTasksByProject, searchQuery, setSearchQuery } =
    useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filteredTasks = (tasks || []).filter((task) =>
    safeLowerCase(task.title).includes(safeLowerCase(searchQuery))
  );

  // console.log("FETCH TASK:", fetchTasksByProject);

  useEffect(() => {}, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-1/2"
          placeholder="Search Tasks..."
        />
        <button
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
        >
          Add New Task
        </button>
      </div>

      <TaskList tasks={filteredTasks} />

      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <TaskForm
          projectId={projectId}
          onClose={closeModal}
          refetchTasks={() => fetchTasksByProject(projectId)}
        />
      </ReusableModal>
    </div>
  );
};
