import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { callbackAsync } from "./sessionSlice";

// const backendUrl = process.env.REACT_APP_BACKEND_URL;
const provider = 'auth0'

const LoginRedirect = () => {
    const location = useLocation();
    const history = useHistory();

    const dispatch = useAppDispatch();

    const [text, setText] = useState('Loading...');
    useEffect(() => {
        // Successfully logged with the provider
        // Now logging with strapi by using the access_token (given by the provider) in props.location.search

        dispatch(callbackAsync({ provider: provider, query: location.search }))
            .then(res => {
                setText('You have been successfully logged in. You will be redirected in a few seconds...');
                setTimeout(() => history.push('/'), 3000); // Redirect to homepage after 3 sec
            })
            .catch(err => {
                console.log(err);
                setText('An error occurred, please see the developer console.')
            });
        // fetch(`${backendUrl}/auth/${provider}/callback${location.search}`)
        //     .then(res => {
        //         if (res.status !== 200) {
        //             throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
        //         }
        //         return res;
        //     })
        //     .then(res => res.json())
        //     .then(res => {
        //         // Successfully logged with Strapi
        //         // Now saving the jwt to use it for future authenticated requests to Strapi
        //         dispatch(setLogin(res))
        //         // localStorage.setItem('jwt', res.jwt);
        //         // localStorage.setItem('username', res.user.username);
        //         setText('You have been successfully logged in. You will be redirected in a few seconds...');
        //         setTimeout(() => history.push('/'), 3000); // Redirect to homepage after 3 sec
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         setText('An error occurred, please see the developer console.')
        //     });
    }, [history, location.search, dispatch]);

    return (
        <p>
            {text}
        </p>
    )
}

export default LoginRedirect;
