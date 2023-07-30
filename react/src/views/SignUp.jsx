import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { TextInput, PasswordInput, Button, Anchor } from "@mantine/core"

import '../components/GuestLayout.css'
import axiosClient from "../axios-client"
import { useAuth } from "../contexts/AuthProvider"
import { useToast } from "../contexts/ToastProvider"


export default function SignUp() {
    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const { addAlert } = useToast()

    const { setUser, setToken } = useAuth()

    const onSubmit = (event) => {
        event.preventDefault()
        setIsLoading(true)

        const payload = {
            name: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: confirmPasswordRef.current.value
        }

        axiosClient.post('/signup', payload)
            .then(({ data }) => {
                setIsLoading(false)
                setUser(data.user)
                setToken(data.token)
            })
            .catch(({ response }) => {
                setIsLoading(false)
                if (response && response.status === 422) {
                    const { errors } = response.data
                    Object.keys(errors).forEach(key => {
                        errors[key].forEach(errorMessage => addAlert(errorMessage, 'red'))
                    })
                }
            })
    }

    return (
        <>
            <h1>Sign Up</h1>
            <TextInput ref={usernameRef} className="input-group" placeholder="Full name" mt="lg" />
            <TextInput ref={emailRef} className="input-group email-field" placeholder="Email address" mt="lg" />
            <PasswordInput ref={passwordRef} className="input-group" placeholder="Password (at least 12 characters)" />
            <PasswordInput ref={confirmPasswordRef} className="input-group" placeholder="Confirm Password (at least 12 characters)" />
            <Button loading={isLoading} loaderPosition="left" fullWidth variant="filled" size="md" className="form-button" onClick={onSubmit}><h6>Sign Up</h6></Button>
            <h6>Already have an account? <Link to="/login" className="guest-link"><Anchor underline={false}>Login</Anchor></Link> here.</h6>
        </>
    )
}