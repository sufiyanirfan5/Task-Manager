import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';

export const taskService = {
  // Add a new task
  async addTask(taskData, userId) {
    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        success: true,
        taskId: taskRef.id,
        task: { ...taskData, id: taskRef.id }
      };
    } catch (error) {
      console.error('Add task error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get all tasks for a user
  async getTasks(userId) {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks = [];
      
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate()?.toISOString() || new Date().toISOString()
        });
      });
      
      return {
        success: true,
        tasks
      };
    } catch (error) {
      console.error('Get tasks error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update a task
  async updateTask(taskId, updates) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return {
        success: true,
        taskId
      };
    } catch (error) {
      console.error('Update task error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete a task
  async deleteTask(taskId) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      
      return {
        success: true,
        taskId
      };
    } catch (error) {
      console.error('Delete task error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update task status
  async updateTaskStatus(taskId, status) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status,
        updatedAt: serverTimestamp()
      });
      
      return {
        success: true,
        taskId,
        status
      };
    } catch (error) {
      console.error('Update task status error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Sync tasks from Firestore to local store
  async syncTasks(userId, setTasks) {
    try {
      const result = await this.getTasks(userId);
      if (result.success) {
        setTasks(result.tasks);
        return { success: true };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Sync tasks error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}; 