import { createContext, useEffect, useState } from "react";
import { _get } from "../../../service/apiService";

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready,setReady] = useState(false)
  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  },)

  const fetchUserProfile = async () => {
    try {
      const responseData = await _get('/profile'); 
      if (responseData?.data?.status === "200" && responseData?.data?.data) {
        setUser(responseData?.data?.data);
        setReady(true)
      } else {
        setUser(null);
      }
    } catch (e) {
      console.log(e);
    }
    
  }
  return <UserContext.Provider value={{ user, setUser, ready, setReady }}>{children}</UserContext.Provider>;
  
}