import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import httpStatus from "http-status";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:8000/api/v1/users"
})

export const AuthProvider = ({children}) =>{

    const authContext = useContext(AuthContext);

    const [ userData, setUserData] = useState(authContext);

    const router = useNavigate();

    const handleRegister = async(name, email, username, password) =>{
        try {
            let request = await client.post("/register", {
                name: name,
                email: email,
                username: username,
                password: password
            });
            if(request.status == httpStatus.CREATED){
                return request.data.message;
            }
        } catch (error) {
            throw error;
        }
    }

    const handleLogin = async(username, password) =>{
        try{
            let request = await client.post("/login", {
                loginId: username,
                password: password
            })
            if(request.status == httpStatus.OK){
                localStorage.setItem("token", request.data.token);
                router("/home")
            }
        }catch(error){
            throw error;
        }
    }


    const data = {
        userData, setUserData, handleRegister, handleLogin
    }

    return(
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}