'use client';

import { useState, useEffect } from 'react';
import { 
  PROJECT_FIELDS, PROJECT_STATUS, PROJECT_PRIORITY,
  TASK_FIELDS, TASK_STATUS, TASK_PRIORITY,
  extractLinkedRecordId
} from '@/lib/utils/aitable-utils';

// Project interface
interface Project {
  recordId: string;
  fields: {
    [key: string]: any;
  };
}

// Task interface
interface Task {
  recordId: string;
  fields: {
    [key: string]: any;
  };
}

export default function CrudTestPage() {
  // State for projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    [PROJECT_FIELDS.NAME]: '',
    [PROJECT_FIELDS.DESCRIPTION]: '',
    [PROJECT_FIELDS.STATUS]: PROJECT_STATUS.NOT_STARTED,
    [PROJECT_FIELDS.PRIORITY]: PROJECT_PRIORITY.MEDIUM,
  });
  
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    [TASK_FIELDS.TITLE]: '',
    [TASK_FIELDS.DESCRIPTION]: '',
    [TASK_FIELDS.STATUS]: TASK_STATUS.TO_DO,
    [TASK_FIELDS.PRIORITY]: TASK_PRIORITY.MEDIUM,
    [TASK_FIELDS.PROJECT]: '',
  });
  
  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch projects on load
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Fetch tasks when a project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.recordId);
      
      // Update the new task form with the selected project
      setNewTask(prev => ({
        ...prev,
        [TASK_FIELDS.PROJECT]: selectedProject.recordId,
      }));
    } else {
      setTasks([]);
    }
  }, [selectedProject]);
  
  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/aitable/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
      } else {
        setError(data.error || 'Failed to fetch projects');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching projects');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch tasks for a project
  const fetchTasks = async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/aitable/tasks?projectId=${projectId}`);
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data);
      } else {
        setError(data.error || 'Failed to fetch tasks');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new project
  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/aitable/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Project created successfully!');
        setNewProject({
          [PROJECT_FIELDS.NAME]: '',
          [PROJECT_FIELDS.DESCRIPTION]: '',
          [PROJECT_FIELDS.STATUS]: PROJECT_STATUS.NOT_STARTED,
          [PROJECT_FIELDS.PRIORITY]: PROJECT_PRIORITY.MEDIUM,
        });
        fetchProjects();
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };
  
  // Update a project
  const updateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/aitable/projects', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId: selectedProject.recordId,
          fields: selectedProject.fields,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Project updated successfully!');
        fetchProjects();
      } else {
        setError(data.error || 'Failed to update project');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the project');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a project
  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch(`/api/aitable/projects?projectId=${projectId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Project deleted successfully!');
        if (selectedProject?.recordId === projectId) {
          setSelectedProject(null);
        }
        fetchProjects();
      } else {
        setError(data.error || 'Failed to delete project');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the project');
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new task
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/aitable/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Task created successfully!');
        setNewTask({
          ...newTask,
          [TASK_FIELDS.TITLE]: '',
          [TASK_FIELDS.DESCRIPTION]: '',
        });
        if (selectedProject) {
          fetchTasks(selectedProject.recordId);
        }
      } else {
        setError(data.error || 'Failed to create task');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the task');
    } finally {
      setLoading(false);
    }
  };
  
  // Update a task
  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/aitable/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId: selectedTask.recordId,
          fields: selectedTask.fields,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Task updated successfully!');
        if (selectedProject) {
          fetchTasks(selectedProject.recordId);
        }
      } else {
        setError(data.error || 'Failed to update task');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the task');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a task
  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch(`/api/aitable/tasks?taskId=${taskId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Task deleted successfully!');
        if (selectedTask?.recordId === taskId) {
          setSelectedTask(null);
        }
        if (selectedProject) {
          fetchTasks(selectedProject.recordId);
        }
      } else {
        setError(data.error || 'Failed to delete task');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the task');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">AITable CRUD Test</h1>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{successMessage}</p>
        </div>
      )}
      {loading && (
        <div className="mb-4">
          <p>Loading...</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Projects Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Projects</h2>
          
          {/* Create Project Form */}
          <div className="mb-8 p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={newProject[PROJECT_FIELDS.NAME]}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    [PROJECT_FIELDS.NAME]: e.target.value,
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <textarea
                  value={newProject[PROJECT_FIELDS.DESCRIPTION]}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    [PROJECT_FIELDS.DESCRIPTION]: e.target.value,
                  })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Status</label>
                <select
                  value={newProject[PROJECT_FIELDS.STATUS]}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    [PROJECT_FIELDS.STATUS]: e.target.value,
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value={PROJECT_STATUS.NOT_STARTED}>Not Started</option>
                  <option value={PROJECT_STATUS.IN_PROGRESS}>In Progress</option>
                  <option value={PROJECT_STATUS.COMPLETED}>Completed</option>
                  <option value={PROJECT_STATUS.ON_HOLD}>On Hold</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Priority</label>
                <select
                  value={newProject[PROJECT_FIELDS.PRIORITY]}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    [PROJECT_FIELDS.PRIORITY]: e.target.value,
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value={PROJECT_PRIORITY.LOW}>Low</option>
                  <option value={PROJECT_PRIORITY.MEDIUM}>Medium</option>
                  <option value={PROJECT_PRIORITY.HIGH}>High</option>
                  <option value={PROJECT_PRIORITY.CRITICAL}>Critical</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={loading}
              >
                Create Project
              </button>
            </form>
          </div>
          
          {/* Project List */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Project List</h3>
            {projects.length === 0 ? (
              <p>No projects found.</p>
            ) : (
              <div className="border rounded">
                {projects.map((project) => (
                  <div 
                    key={project.recordId} 
                    className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                      selectedProject?.recordId === project.recordId ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold">{project.fields[PROJECT_FIELDS.NAME]}</h4>
                        <p className="text-sm text-gray-500">
                          Status: {project.fields[PROJECT_FIELDS.STATUS]} | 
                          Priority: {project.fields[PROJECT_FIELDS.PRIORITY]}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.recordId);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Tasks Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Tasks</h2>
          
          {selectedProject ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Tasks for: {selectedProject.fields[PROJECT_FIELDS.NAME]}
                </h3>
              </div>
              
              {/* Create Task Form */}
              <div className="mb-8 p-4 border rounded">
                <h3 className="text-lg font-semibold mb-2">Create New Task</h3>
                <form onSubmit={createTask}>
                  <div className="mb-4">
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      value={newTask[TASK_FIELDS.TITLE]}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        [TASK_FIELDS.TITLE]: e.target.value,
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Description</label>
                    <textarea
                      value={newTask[TASK_FIELDS.DESCRIPTION]}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        [TASK_FIELDS.DESCRIPTION]: e.target.value,
                      })}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Status</label>
                    <select
                      value={newTask[TASK_FIELDS.STATUS]}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        [TASK_FIELDS.STATUS]: e.target.value,
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value={TASK_STATUS.TO_DO}>To Do</option>
                      <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                      <option value={TASK_STATUS.IN_REVIEW}>In Review</option>
                      <option value={TASK_STATUS.DONE}>Done</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Priority</label>
                    <select
                      value={newTask[TASK_FIELDS.PRIORITY]}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        [TASK_FIELDS.PRIORITY]: e.target.value,
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value={TASK_PRIORITY.LOW}>Low</option>
                      <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                      <option value={TASK_PRIORITY.HIGH}>High</option>
                      <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    disabled={loading}
                  >
                    Create Task
                  </button>
                </form>
              </div>
              
              {/* Task List */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Task List</h3>
                {tasks.length === 0 ? (
                  <p>No tasks found for this project.</p>
                ) : (
                  <div className="border rounded">
                    {tasks.map((task) => (
                      <div 
                        key={task.recordId} 
                        className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                          selectedTask?.recordId === task.recordId ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-semibold">{task.fields[TASK_FIELDS.TITLE]}</h4>
                            <p className="text-sm text-gray-500">
                              Status: {task.fields[TASK_FIELDS.STATUS]} | 
                              Priority: {task.fields[TASK_FIELDS.PRIORITY]}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.recordId);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>Select a project to view and manage tasks.</p>
          )}
        </div>
      </div>
    </div>
  );
} 