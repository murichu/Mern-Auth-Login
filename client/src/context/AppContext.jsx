import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ userData, setUserData ] = useState(null);
 
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
                withCredentials: true,
              });
              
          if (data.success) {
            setIsLoggedIn(true);
            if (!userData) await getUserData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to authenticate. Please try again later.");
        }
      };
      
    

      const getUserData = async () => {
        try {
          const { data } = await axios.get(`${backendUrl}/api/user/data`);
          if (data.success) {
            setUserData(data.userData);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to fetch user data");
        } 
      };

    
    useEffect(()=> {
        getAuthState();
    },[])

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;