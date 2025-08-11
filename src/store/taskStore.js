import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTaskStore = create(
  persist(
    (set, get) => ({
      // Task state
      tasks: [],
      filter: 'all', // 'all', 'pending', 'completed'
      
      // Actions
      setTasks: (tasks) => set({ tasks }),
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),
      
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),
      
      setFilter: (filter) => set({ filter }),
      
      // Getters
      getTasks: () => get().tasks,
      
      getFilteredTasks: () => {
        const { tasks, filter } = get();
        switch (filter) {
          case 'pending':
            return tasks.filter(task => task.status === 'Pending');
          case 'completed':
            return tasks.filter(task => task.status === 'Completed');
          default:
            return tasks;
        }
      },
      
      getTaskById: (taskId) => {
        const { tasks } = get();
        return tasks.find(task => task.id === taskId);
      },
      
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        filter: state.filter,
      }),
    }
  )
);

export default useTaskStore; 