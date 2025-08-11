import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { taskService } from '../../services/taskService';
import useTaskStore from '../../store/taskStore';
import useAuthStore from '../../store/authStore';
import Swal from 'sweetalert2';
import { Plus, Calendar, FileText, Tag } from 'lucide-react';

const AddTaskForm = ({ onTaskAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const addTask = useTaskStore(state => state.addTask);
  const userId = useAuthStore(state => state.userId);

  // Validation schema
  const validationSchema = Yup.object({
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      // Create task object
      const taskData = {
        name: values.name.trim(),
        description: values.description.trim(),
        deadline: values.deadline,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to Firebase with userId
      const result = await taskService.addTask(taskData, userId);
      
      if (result.success) {
        // Add to local store
        addTask(result.task);
        
        Swal.fire({
          icon: 'success',
          title: 'Task Added!',
          text: 'Your task has been successfully created.',
          timer: 2000,
          showConfirmButton: false
        });
        
        resetForm();
        
        if (onTaskAdded) {
          onTaskAdded();
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add Task',
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
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Plus className="h-5 w-5 text-primary-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Add New Task</h3>
      </div>
      
      <Formik
        initialValues={{
          name: '',
          description: '',
          deadline: getTodayDate()
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Task Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter task name"
                />
              </div>
              <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  id="description"
                  name="description"
                  as="textarea"
                  rows="3"
                  className="input-field pl-10"
                  placeholder="Enter task description"
                />
              </div>
              <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  id="deadline"
                  name="deadline"
                  type="date"
                  min={getTodayDate()}
                  className="input-field pl-10"
                />
              </div>
              <ErrorMessage name="deadline" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="btn-primary w-full flex justify-center py-2 px-4"
              >
                {isLoading ? (
                  <>
                    <Plus className="h-4 w-4 mr-2 animate-spin" />
                    Adding Task...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTaskForm;
