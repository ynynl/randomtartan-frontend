import { Button } from "@material-ui/core";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const provider = 'auth0'

const LoginForm = () => {
    return (
        <Button color='primary' href={`${backendUrl}/connect/${provider}/login`}>Sign In</Button>
    )
}

export default LoginForm