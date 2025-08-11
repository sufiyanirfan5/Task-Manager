import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { taskService } from '../../services/taskService';
import useTaskStore from '../../store/taskStore';
import Swal from 'sweetalert2';
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Filter,
  Search,
  Calendar,
  FileText
} from 'lucide-react';

const TaskTable = () => {
  const [editingTask, setEditingTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    tasks, 
    filter, 
    setFilter, 
    updateTask, 
    deleteTask, 
    getFilteredTasks 
  } = useTaskStore();

  // Validation schema for editing
  const editValidationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Task name must be at least 3 characters')
      .max(100, 'Task name must be less than 100 characters')
      .required('Task name is required'),
    description: Yup.string()
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required'),
    deadline: Yup.date()
      .min(new Date(), 'Deadline must be today or in the future')
      .required('Deadline is required'),
  });

  // Handle task status update
  const handleStatusUpdate = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    
    try {
      const result = await taskService.updateTaskStatus(taskId, newStatus);
      
      if (result.success) {
        updateTask(taskId, { status: newStatus });
        
        Swal.fire({
          icon: 'success',
          title: 'Status Updated!',
          text: `Task marked as ${newStatus}`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Update Status',
          text: result.error
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred'
      });
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId, taskName) => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      text: `Are you sure you want to delete "${taskName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await taskService.deleteTask(taskId);
        
        if (deleteResult.success) {
          deleteTask(taskId);
          
          Swal.fire({
            icon: 'success',
            title: 'Task Deleted!',
            text: 'Task has been successfully removed.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to Delete Task',
            text: deleteResult.error
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred'
        });
      }
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await taskService.updateTask(editingTask.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        deadline: values.deadline
      });
      
      if (result.success) {
        updateTask(editingTask.id, {
          name: values.name.trim(),
          description: values.description.trim(),
          deadline: values.deadline
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Task Updated!',
          text: 'Task has been successfully updated.',
          timer: 2000,
          showConfirmButton: false
        });
        
        setEditingTask(null);
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Update Task',
          text: result.error
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTask(null);
    setIsEditing(false);
  };

  // Get filtered and searched tasks
  const getDisplayTasks = () => {
    let filteredTasks = getFilteredTasks();
    
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredTasks;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if deadline is overdue
  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  const displayTasks = getDisplayTasks();

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Task Count */}
      <div className="text-sm text-gray-600">
        Showing {displayTasks.length} of {tasks.length} tasks
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayTasks.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FileText className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No tasks found</p>
                    <p className="text-sm">Create your first task to get started!</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {task.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {task.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className={`text-sm ${
                        isOverdue(task.deadline) ? 'text-red-600 font-medium' : 'text-gray-900'
                      }`}>
                        {formatDate(task.deadline)}
                        {isOverdue(task.deadline) && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Overdue
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status === 'Completed' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(task.id, task.status)}
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                        task.status === 'Completed'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                      title={task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      {task.status === 'Completed' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                    </button>
                    
                    <button
                      onClick={() => startEditing(task)}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      title="Edit Task"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTask(task.id, task.name)}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Task Modal */}
      {isEditing && editingTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Task</h3>
              
              <Formik
                initialValues={{
                  name: editingTask.name,
                  description: editingTask.description,
                  deadline: editingTask.deadline
                }}
                validationSchema={editValidationSchema}
                onSubmit={handleEditSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                        Task Name
                      </label>
                      <Field
                        id="edit-name"
                        name="name"
                        type="text"
                        className="input-field"
                      />
                      <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Field
                        id="edit-description"
                        name="description"
                        as="textarea"
                        rows="3"
                        className="input-field"
                      />
                      <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="edit-deadline" className="block text-sm font-medium text-gray-700">
                        Deadline
                      </label>
                      <Field
                        id="edit-deadline"
                        name="deadline"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field"
                      />
                      <ErrorMessage name="deadline" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex-1"
                      >
                        {isSubmitting ? 'Updating...' : 'Update Task'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable; 