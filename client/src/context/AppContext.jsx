import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";



export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ userData, setUserData ] = useState(false);

    const [token, setToken] = useState(
        localStorage.getItem("token") ? localStorage.getItem("token") : false);


    const getAuthState = async () => {
        try {

           const { data } = await axios.get(backendUrl + "/api/auth/is-auth", {
            headers: { Authorization: `Bearer ${token}` },
        });
           
           if (data.success) {
            setIsLoggedIn(true);
            if (!userData) getUserData();
           }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to authenticate");
        }
    }
    

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch user data') 
        }
      }

    
    useEffect(()=> {
        getAuthState();
    },[])

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);


    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        token,
        setToken,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;