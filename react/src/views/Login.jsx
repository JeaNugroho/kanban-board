import { Link } from "react-router-dom"
import { useRef, useState } from "react"
import { TextInput, PasswordInput, Button, Anchor } from "@mantine/core"

import axiosClient from "../axios-client"
import { useAuth } from "../contexts/AuthProvider"
import { useToast } from "../contexts/ToastProvider"
import '../components/GuestLayout.css'



export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const { setUser, setToken } = useAuth()
    const { addAlert } = useToast()

    const onSubmit = (event) => {
        event.preventDefault()
        setIsLoading(true)

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setIsLoading(false)
                setUser(data.user)
                console.log("data.user")
                console.log(data.user)
                setToken(data.token)
            })
            .catch(({ response }) => {
                setIsLoading(false)
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        const { errors } = response.data
                        Object.keys(errors).forEach(key => {
                            errors[key].forEach(errorMessage => addAlert(errorMessage, 'red'))
                        })
                    } else {
                        // addAlert({
                        //     email: [response.data.message]
                        // })
                        addAlert(response.data.message, 'red')
                    }
                }
            })
    }

    return (
        <>
            <h1>Login</h1>
            <TextInput ref={emailRef} className="input-group" placeholder="Email" />
            <PasswordInput ref={passwordRef} className="input-group" placeholder="Password" />
            <Button loading={isLoading} loaderPosition="left" fullWidth variant="filled" size="md" className="form-button" onClick={onSubmit}><h6>Login</h6></Button>
            <h6>Don't have an account? <Link to="/signup" className="guest-link"><Anchor underline={false}>Sign up</Anchor></Link> here.</h6>
        </>
    )
}