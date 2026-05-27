import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
}



export { AuthProvider, useAuth } from '../linh/contexts/AuthContext.jsx';
  const [user, setUser] = useState<User | null>(null);
