import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';

// Add a task (updated to include userId)
export const addTask = async (taskData, userId) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...taskData,
      userId
    });
    return { success: true, task: { id: docRef.id, ...taskData, userId } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get tasks of a specific user
export const getUserTasks = async (userId) => {
  try {
    const q = query(collection(db, "tasks"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const tasks = [];
    querySnapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, tasks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update task
export const updateTask = async (taskId, updates) => {
  try {
    const docRef = doc(db, "tasks", taskId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  try {
    const docRef = doc(db, "tasks", taskId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
