// ...existing code...

// Update the login function to properly store the user role
const login = async (credentials) => {
  setLoading(true);
  try {
    const response = await authApi.login(credentials);
    const { token, user } = response.data.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      ...user,
      role: user.role || 'user' // Make sure role is stored
    }));
    
    setUser({
      ...user,
      role: user.role || 'user' // Ensure role is set in state
    });
    return { success: true };
  } catch (error) {
    setError(error.message || 'Login failed');
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};

// Make sure initialize function checks for role
const initialize = () => {
  setLoading(true);
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (storedToken && storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      setUser({
        ...userObj,
        role: userObj.role || 'user' // Default to 'user' role if not present
      });
    } catch (e) {
      // Handle JSON parse error
      console.error('Error parsing user from localStorage', e);
      logout();
    }
  }
  setLoading(false);
};

// ...existing code...
