import { FormHelperText, TextField } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { clearErrorMessage, loginAsync, LoginInput, selectError } from './sessionSlice'
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core'
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const provider = 'auth0'

const LoginForm = () => {
    const { register, handleSubmit, control } = useForm<LoginInput>();
    const [showLogin, setShowLogin] = useState(false)

    const dispatch = useAppDispatch();
    const errorMessages = useAppSelector(selectError)
 
    const handleLogin = (data: LoginInput) => {
        dispatch(loginAsync(data))
            .then(unwrapResult)
            .then(res => {
                setShowLogin(false)
            })
            .catch(() => {
                setTimeout(() => {
                    dispatch(clearErrorMessage())
                }, 5000)
            })
    }

    return (
        <>
            <Button color='primary' href={`${backendUrl}/connect/${provider}/login`}>Sign In</Button>
            {/* <Button color='primary' onClick={() => setShowLogin(true)}>Sign In</Button> */}

            <Dialog open={showLogin} onClose={() => setShowLogin(false)}>
                <form onSubmit={handleSubmit(handleLogin)} noValidate >
                    <DialogTitle>Login</DialogTitle>
                    <DialogContent >
                        {errorMessages.map((error) => <FormHelperText key={error.id} error >
                            {error.message}
                        </FormHelperText>)}
                        <Controller
                            name='identifier'
                            defaultValue=""
                            control={control}
                            render={({ field }) => <TextField
                                {...register("identifier")}
                                {...field}
                                label='Email address or username'
                                autoComplete='username'
                                variant='filled'
                            />}
                        />
                        <br />
                        <Controller
                            control={control}
                            name='password'
                            defaultValue=""
                            render={({ field }) => <TextField
                                {...register("password")}
                                {...field}
                                label='Password'
                                type="password"
                                autoComplete='current-password'
                                variant='filled'
                            />}

                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowLogin(false)} color="primary">
                            Cancel
                        </Button>
                        <Button variant='contained' type="submit">
                            Login
                        </Button>
                    </DialogActions>
                </form >
            </Dialog >
        </>
    )
}

export default LoginForm