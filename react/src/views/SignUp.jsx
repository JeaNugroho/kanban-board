import { Link } from "react-router-dom"
import { TextInput, PasswordInput, Button, Anchor } from "@mantine/core"

import '../components/GuestLayout.css'


export default function SignUp() {
    const onSubmit = () => {
        
    }

    return (
        <>
            <h1>Sign Up</h1>
            <TextInput className="input-group" placeholder="Username" mt="lg" />
            <PasswordInput className="input-group" placeholder="Password" />
            <PasswordInput className="input-group" placeholder="Confirm Password" />
            <Button fullWidth variant="filled" size="md" className="form-button"><p>Sign Up</p></Button>
            {/* <Button fullWidth variant="subtle" size="md" className="form-button"><p>Login</p></Button> */}
            <p>Already have an account? <Link to="/login" className="guest-link"><Anchor underline={false}>Login</Anchor></Link> here.</p>
        </>
    )
}