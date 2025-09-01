import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create the AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState(""); // State for user role
  const [userName, setUserName] = useState(""); // State for user name
  const [userEmpId, setUserEmpId] = useState(""); // State for user EmpId
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // console.log(userEmpId);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedAuth = localStorage.getItem('authData');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          setIsAuthenticated(true);
          setUserEmail(authData.email);
          setUserRole(authData.role);
          setUserName(authData.name);
          setUserEmpId(authData.empId);
        }
      } catch (error) {
        console.error("Error restoring auth state:", error);
        // Clear corrupted data
        localStorage.removeItem('authData');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);


  // Function to handle login
  const login = async (email, role) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserRole(role); // Set user role on login

    try {
      const api = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${api}/users`);
      const users = await response.json();

      // Find the user based on the email
      const loggedInUser = users.find((user) => user.email === email);
      
      if (loggedInUser) {
        setUserName(loggedInUser.Name);
        setUserEmpId(loggedInUser.EmpId);
        
        const authData = {
          email: email,
          role: role,
          name: loggedInUser.Name,
          empId: loggedInUser.EmpId
        };
        localStorage.setItem('authData', JSON.stringify(authData));
        navigate("/Team-Service-UI", { replace: true });
      } else {
        console.error("User not found:", email);
        throw new Error("User not found");
      }
    } 
    catch (error) {
      console.error("Error fetching user data:", error);
      setIsAuthenticated(false);
      setUserEmail("");
      setUserRole("");
      setUserName("");
      setUserEmpId("");

    }
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    setUserRole(""); // Clear user role on logout
    setUserName(""); // Clear user name on logout
    setUserEmpId(""); // Clear user EmpId on logout
    localStorage.removeItem('authData');
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userRole,
        userName,
        userEmpId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};