
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  limit,
  addDoc
} from 'firebase/firestore';
import { Project } from '@/types/project';
import { toast } from 'sonner';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQJ3qd222g6fI80FjS9A_xFN7CdxzRfUg",
  authDomain: "web-sketch-a385d.firebaseapp.com",
  projectId: "web-sketch-a385d",
  storageBucket: "web-sketch-a385d.firebasestorage.app",
  messagingSenderId: "686482320108",
  appId: "1:686482320108:web:c0d50e477a94a552a413c9",
  measurementId: "G-JR66TC02Y3"
};

interface FirebaseContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // Alias for signIn
  register: (email: string, password: string) => Promise<void>; // Alias for signUp
  logout: () => Promise<void>; // Alias for signOut
  saveProjectToFirebase: (project: Project) => Promise<void>;
  getUserProjects: () => Promise<Project[]>;
  deleteProjectFromFirebase: (projectId: string) => Promise<void>;
  deleteUserProject: (projectId: string) => Promise<void>; // Alias for deleteProjectFromFirebase
  getPinnedProjects: () => Promise<Project[]>;
  getCommunityProjects: (limitCount?: number) => Promise<Project[]>;
  pinProject: (projectId: string) => Promise<void>;
  unpinProject: (projectId: string) => Promise<void>;
  isPinned: (projectId: string) => boolean;
}

const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinnedProjects, setPinnedProjects] = useState<string[]>([]);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Load pinned projects when user changes
      if (user) {
        loadPinnedProjects();
      } else {
        setPinnedProjects([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const loadPinnedProjects = async () => {
    if (!user) return;
    
    try {
      const pinnedRef = doc(db, `users/${user.uid}/settings/pins`);
      const pinnedDoc = await getDoc(pinnedRef);
      
      if (pinnedDoc.exists()) {
        const projectIds = pinnedDoc.data().projectIds || [];
        setPinnedProjects(projectIds);
        console.log("Loaded pinned projects:", projectIds);
      } else {
        // Initialize empty pinned projects if it doesn't exist
        await setDoc(pinnedRef, { projectIds: [] });
        setPinnedProjects([]);
      }
    } catch (error) {
      console.error('Error loading pinned projects:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in. Please check your credentials.');
      throw error;
    }
  };

  const login = signIn; // Alias for signIn

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to create account. Email may be already in use.');
      throw error;
    }
  };

  const register = signUp; // Alias for signUp

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out');
      throw error;
    }
  };

  const logout = signOut; // Alias for signOut

  const saveProjectToFirebase = async (project: Project) => {
    if (!user) return;

    try {
      // Add pinned status to project before saving
      const projectWithUser = {
        ...project,
        uid: user.uid,
        userId: user.uid,
        userEmail: user.email,
        isPinned: pinnedProjects.includes(project.id)
      };
      
      // Store in Firestore projects collection
      const projectRef = doc(db, `projects/${project.id}`);
      await setDoc(projectRef, projectWithUser);
      
      // Also store in user's projects subcollection for backwards compatibility
      const userProjectRef = doc(db, `users/${user.uid}/projects/${project.id}`);
      await setDoc(userProjectRef, projectWithUser);
      
      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
      throw error;
    }
  };

  const getUserProjects = async (): Promise<Project[]> => {
    if (!user) return [];

    try {
      // Try the new Firestore structure first
      const projectsQuery = query(collection(db, 'projects'), where('uid', '==', user.uid));
      const projectsSnapshot = await getDocs(projectsQuery);
      
      const projects: Project[] = [];
      
      projectsSnapshot.forEach((doc) => {
        const projectData = doc.data() as Project;
        // Ensure isPinned is correctly set based on pinnedProjects state
        projectData.isPinned = pinnedProjects.includes(projectData.id);
        projects.push(projectData);
      });
      
      // If no projects found in the new structure, try the old structure
      if (projects.length === 0) {
        const userProjectsRef = collection(db, `users/${user.uid}/projects`);
        const userProjectsSnapshot = await getDocs(userProjectsRef);
        
        userProjectsSnapshot.forEach((doc) => {
          const projectData = doc.data() as Project;
          projectData.isPinned = pinnedProjects.includes(projectData.id);
          projects.push(projectData);
        });
      }
      
      return projects;
    } catch (error) {
      console.error('Error getting projects:', error);
      toast.error('Failed to load projects');
      return [];
    }
  };
  
  const deleteProjectFromFirebase = async (projectId: string) => {
    if (!user) return;
    
    try {
      // Delete from main projects collection
      const projectRef = doc(db, `projects/${projectId}`);
      await deleteDoc(projectRef);
      
      // Also delete from user's projects subcollection
      const userProjectRef = doc(db, `users/${user.uid}/projects/${projectId}`);
      await deleteDoc(userProjectRef);
      
      // Also remove from pinned projects if it was pinned
      if (pinnedProjects.includes(projectId)) {
        await unpinProject(projectId);
      }
      
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  };

  const deleteUserProject = deleteProjectFromFirebase; // Alias for deleteProjectFromFirebase

  const pinProject = async (projectId: string) => {
    if (!user) return;
    
    try {
      // First check if it's already pinned to avoid duplicates
      if (pinnedProjects.includes(projectId)) {
        return;
      }
      
      const newPinnedProjects = [...pinnedProjects, projectId];
      const pinnedRef = doc(db, `users/${user.uid}/settings/pins`);
      await setDoc(pinnedRef, { projectIds: newPinnedProjects });
      setPinnedProjects(newPinnedProjects);
      
      // Update the project in Firestore to mark it as pinned
      const projectRef = doc(db, `users/${user.uid}/projects/${projectId}`);
      const projectDoc = await getDoc(projectRef);
      
      if (projectDoc.exists()) {
        const projectData = projectDoc.data() as Project;
        await setDoc(projectRef, { ...projectData, isPinned: true });
      }
    } catch (error) {
      console.error('Error pinning project:', error);
      toast.error('Failed to pin project');
      throw error;
    }
  };

  const unpinProject = async (projectId: string) => {
    if (!user) return;
    
    try {
      // Check if it's actually pinned
      if (!pinnedProjects.includes(projectId)) {
        return;
      }
      
      const newPinnedProjects = pinnedProjects.filter(id => id !== projectId);
      const pinnedRef = doc(db, `users/${user.uid}/settings/pins`);
      await setDoc(pinnedRef, { projectIds: newPinnedProjects });
      setPinnedProjects(newPinnedProjects);
      
      // Update the project in Firestore to mark it as not pinned
      const projectRef = doc(db, `users/${user.uid}/projects/${projectId}`);
      const projectDoc = await getDoc(projectRef);
      
      if (projectDoc.exists()) {
        const projectData = projectDoc.data() as Project;
        await setDoc(projectRef, { ...projectData, isPinned: false });
      }
    } catch (error) {
      console.error('Error unpinning project:', error);
      toast.error('Failed to unpin project');
      throw error;
    }
  };

  const isPinned = (projectId: string): boolean => {
    return pinnedProjects.includes(projectId);
  };

  const getPinnedProjects = async (): Promise<Project[]> => {
    if (!user || pinnedProjects.length === 0) return [];
    
    try {
      const pinnedProjectsData: Project[] = [];
      
      // Get all user projects first
      const allProjects = await getUserProjects();
      
      // Filter to only pinned ones and explicitly set the isPinned flag
      const pinnedProjectsFiltered = allProjects
        .filter(project => pinnedProjects.includes(project.id))
        .map(project => ({
          ...project,
          isPinned: true
        }));
      
      return pinnedProjectsFiltered;
    } catch (error) {
      console.error('Error getting pinned projects:', error);
      toast.error('Failed to load pinned projects');
      return [];
    }
  };

  const getCommunityProjects = async (limitCount: number = 20): Promise<Project[]> => {
    try {
      // Create a query to get public projects
      // In a real app, you would have a field like isPublic to determine visibility
      const projectsQuery = query(
        collection(db, 'projects'), 
        where('isPublic', '==', true),
        limit(limitCount)
      );
      
      const projectsSnapshot = await getDocs(projectsQuery);
      
      const projects: Project[] = [];
      
      projectsSnapshot.forEach((doc) => {
        const projectData = doc.data() as Project;
        projectData.isPinned = user ? pinnedProjects.includes(projectData.id) : false;
        projects.push(projectData);
      });
      
      // If no public projects found, fall back to showing some of the user's projects
      if (projects.length === 0 && user) {
        const userProjects = await getUserProjects();
        return userProjects.slice(0, limitCount);
      }
      
      return projects;
    } catch (error) {
      console.error('Error getting community projects:', error);
      toast.error('Failed to load community projects');
      return [];
    }
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      login,
      register,
      logout,
      saveProjectToFirebase,
      getUserProjects,
      deleteProjectFromFirebase,
      deleteUserProject,
      getPinnedProjects,
      getCommunityProjects,
      pinProject,
      unpinProject,
      isPinned
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
