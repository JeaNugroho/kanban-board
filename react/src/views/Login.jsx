import { Link } from "react-router-dom"
import { TextInput, PasswordInput, Button, Anchor } from "@mantine/core"

import '../components/GuestLayout.css'


export default function Login() {

    const onSubmit = () => {

    }

    return (
        <>
            <h1>Login</h1>
            <TextInput className="input-group" placeholder="Username" />
            <PasswordInput className="input-group" placeholder="Password" />
            <Button fullWidth variant="filled" size="md" className="form-button"><p>Login</p></Button>
            <p>Don't have an account? <Link to="/signup" className="guest-link"><Anchor underline={false}>Sign up</Anchor></Link> here.</p>
        </>
    )
}