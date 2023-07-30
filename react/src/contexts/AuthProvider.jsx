import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
})

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({})
    // const [user, setUser] = useState('Jean')

    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))
    // const [token, _setToken] = useState(123)
    // const [token, _setToken] = useState(null)

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user,
            token,
            setUser,
            setToken
        }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)