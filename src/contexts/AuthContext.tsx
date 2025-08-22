import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  UserCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { twilioService } from '@/services/twilioService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  currentSubAccount: SubAccount | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string, name: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  switchSubAccount: (subAccountId: string) => Promise<void>;
  createWorkspaceForUser: (info: SubAccountInfo) => Promise<void>;
  loading: boolean;
  authInitialized: boolean;
  isNewUser: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  defaultSubAccountId: string;
  createdAt: any;
  updatedAt: any;
  lastLoginAt: any;
}

interface SubAccount {
  id: string;
  name: string;
  ownerId: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  createdAt: any;
  updatedAt: any;
}

type SubAccountInfo = Omit<SubAccount, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentSubAccount, setCurrentSubAccount] = useState<SubAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const loadSubAccount = useCallback(async (subAccountId: string) => {
    const subAccountRef = doc(db, 'subAccounts', subAccountId);
    const subAccountSnap = await getDoc(subAccountRef);
    if (subAccountSnap.exists()) {
      setCurrentSubAccount({ id: subAccountSnap.id, ...subAccountSnap.data() } as SubAccount);
    }
  }, []);

  const createWorkspace = useCallback(
    async (userId: string, info: SubAccountInfo): Promise<string> => {
      const subAccountRef = await addDoc(collection(db, 'subAccounts'), {
        ...info,
        ownerId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'subAccounts', subAccountRef.id, 'members', userId), {
        userId,
        subAccountId: subAccountRef.id,
        role: 'owner',
        permissions: ['full_access'],
        joinedAt: serverTimestamp(),
      });

      try {
        await twilioService.createAndStoreSubAccount(subAccountRef.id);
        toast({
          title: 'Success',
          description: 'Workspace and Twilio subaccount created successfully!',
        });
      } catch (error) {
        console.error('Twilio creation failed:', error);
        toast({
          title: 'Warning',
          description: 'Workspace created but Twilio setup failed. You can configure it later.',
        });
      }

      return subAccountRef.id;
    },
    []
  );

  const createWorkspaceForUser = async (info: SubAccountInfo) => {
    if (!currentUser) return;

    const defaultSubAccountId = await createWorkspace(currentUser.uid, info);

    await setDoc(doc(db, 'users', currentUser.uid), {
      email: currentUser.email!,
      name: currentUser.displayName || info.name || 'User',
      photoURL: currentUser.photoURL || '',
      defaultSubAccountId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
    const profile = { id: userSnap.id, ...userSnap.data() } as UserProfile;
    setUserProfile(profile);

    await loadSubAccount(defaultSubAccountId);
    setIsNewUser(false);
    navigate(`/${defaultSubAccountId}/dashboard`, { replace: true });
  };

  const handleAuthStateChange = useCallback(
    async (user: User | null) => {
      setLoading(true);

      if (!user) {
        setCurrentUser(null);
        setUserProfile(null);
        setCurrentSubAccount(null);
        setIsNewUser(false);
        setLoading(false);
        setAuthInitialized(true);
        return;
      }

      setCurrentUser(user);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setIsNewUser(true);
        setLoading(false);
        setAuthInitialized(true);
        navigate('/workspace');
        return;
      }

      await updateDoc(userRef, { lastLoginAt: serverTimestamp() });

      const profile = { id: userSnap.id, ...userSnap.data() } as UserProfile;
      setUserProfile(profile);

      if (profile.defaultSubAccountId) {
        await loadSubAccount(profile.defaultSubAccountId);

        if (
          window.location.pathname === '/' ||
          window.location.pathname === '/login'
        ) {
          navigate(`/${profile.defaultSubAccountId}/dashboard`, { replace: true });
        }
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
        navigate('/workspace');
      }

      setLoading(false);
      setAuthInitialized(true);
    },
    [loadSubAccount, navigate, createWorkspace]
  );

  const switchSubAccount = useCallback(
    async (subAccountId: string) => {
      await loadSubAccount(subAccountId);
    },
    [loadSubAccount]
  );

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    (result.user as any)._signupName = name;
    return result;
  };

  const logout = async () => {
    setUserProfile(null);
    setCurrentSubAccount(null);
    return signOut(auth);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    return signInWithPopup(auth, provider);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    return () => unsubscribe();
  }, [handleAuthStateChange]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        currentSubAccount,
        login,
        signup,
        logout,
        loginWithGoogle,
        resetPassword,
        switchSubAccount,
        createWorkspaceForUser,
        loading,
        authInitialized,
        isNewUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
