import { FormHelperText, TextField, Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core'
// import Alert from '@material-ui/lab/Alert';

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearErrorMessage, registerAsync, RegisterInput, selectError } from './sessionSlice'
import { unwrapResult } from '@reduxjs/toolkit'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { Controller, useForm } from "react-hook-form";
import { useState } from 'react';


let schema = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup
        .string()
        .required('Please Enter your password')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
            "Must Contain 8 Characters, and At Least One Number"
        ),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const [showRegister, setShowRegister] = useState(false)

    const errorMessages = useAppSelector(selectError)

    const handleRegister = (data: RegisterInput) => {
        dispatch(registerAsync(data))
            .then(unwrapResult)
            .then(res => {
                setShowRegister(false)
            })
            .catch(() => {
                setTimeout(() => {
                    dispatch(clearErrorMessage())
                }, 5000);
            })
    }

    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <>
            <Button color='primary' variant='outlined' onClick={() => setShowRegister(true)}>Sign up</Button>

            <Dialog open={showRegister} onClose={() => setShowRegister(false)}>
                <form onSubmit={handleSubmit(handleRegister)} noValidate >
                    <DialogTitle>Register</DialogTitle>
                    <DialogContent >
                        {errorMessages.map((error) => <FormHelperText key={error.id} error  >
                            {error.message}
                        </FormHelperText>)}
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField
                                {...field}
                                label='Email Address'
                                type="email"
                                placeholder="Enter email"
                                error={!!errors.email}
                            />}
                        />
                        <FormHelperText error>
                            {errors.email?.message}
                        </FormHelperText >

                        <Controller
                            name="username"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField
                                {...field}
                                label='Username'
                                type="text"
                                placeholder="Choose a username"
                                error={!!errors.username}
                                autoComplete='username'
                            />}
                        />
                        <FormHelperText error>
                            {errors.username?.message}
                        </FormHelperText >

                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField
                                {...field}
                                label="Password"
                                type="password"
                                placeholder="Choose a Password"
                                error={!!errors.password}
                                autoComplete='new-password'
                            />}
                        />
                        <FormHelperText id="registerPasswordHelp">
                            Must Contain 6 Characters and At Least 1 Number
                        </FormHelperText>
                        <FormHelperText error>
                            {errors.password?.message}
                        </FormHelperText >

                        <Controller
                            name="passwordConfirmation"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField
                                {...field}

                                type="password"
                                label="Repeat Password"
                                error={!!errors.passwordConfirmation}
                                autoComplete='new-password'
                            />}
                        />
                        <FormHelperText error>
                            {errors.passwordConfirmation?.message}
                        </FormHelperText >
                        {/* <RegisterForm control={control} errors={errors} /> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowRegister(false)} color="primary">
                            Cancel
                        </Button>
                        <Button variant='contained' type="submit">
                            Register
                        </Button>
                    </DialogActions>
                </form >
            </Dialog >

        </>
    )
}

export default RegisterForm