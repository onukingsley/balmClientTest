import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

// Mock user data
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@nextofskin.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 234 567 8900',
    address: '123 Admin Street, New York, NY 10001',
    city: 'New York',
    state: 'NY',
    avatar: null,
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    phone: '+1 234 567 8901',
    address: '456 User Avenue, Los Angeles, CA 90001',
    city: 'Los Angeles',
    state: 'CA',
    avatar: null,
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((email, password) => {
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const register = useCallback((userData) => {
    const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser = {
      id: MOCK_USERS.length + 1,
      ...userData,
      role: 'user',
    };
    
    MOCK_USERS.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    return { success: true, user: userWithoutPassword };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    return { success: true };
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
