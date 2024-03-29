import { Button, Input } from "@nextui-org/react"
import { useContext, useState } from "react"
import transition from "../lib/transition"
import axios from "axios"
import { AuthContext } from "../components/AuthContext"
import { EyeFilledIcon } from "../components/EyeFilledIcon"
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon"

const Auth = () => {
    const url = 'http://localhost/api/auth'
    const { checkLoginState } = useContext(AuthContext)
    const [isSignUp, setIsSignUp] = useState(false)
    const [isPassVisible, setIsPassVisible] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    })
    const toggleIsSignUp = () => transition(() => setIsSignUp(!isSignUp))
    const togglePassVisibility = () => transition(() => setIsPassVisible(!isPassVisible))

    const authenticate = async (e) => {
        e.preventDefault()
        transition(() => setError(null))
        transition(() => setIsLoading(true))
        try {
            if (!isSignUp) {
                await axios.post(`${url}/login`, {
                    email: userData.email,
                    password: userData.password
                })
            }
            else {
                if (userData.password !== userData.passwordConfirmation) {
                    transition(() => setError({
                        response: {
                            data: {
                                message: 'Passwords must be equal'
                            }
                        }
                    }))

                }
                else {
                    await axios.post(`${url}/register`, {
                        username: userData.username,
                        email: userData.email,
                        password: userData.password,
                    })
                    transition(() => setIsSignUp(false))
                }

            }
        }
        catch (err) { setError(err) }
        finally {
            checkLoginState()
            transition(() => setIsLoading(false))
        }
    }
    return (
        <form onSubmit={authenticate} className="flex flex-col gap-y-5 w-[350px]">
            <h2 className="text-xl">{isSignUp ? 'Create your account' : 'Sign in to your account'}</h2>
            {isSignUp &&
                <Input isRequired label="Username"
                    value={userData.username}
                    onValueChange={(v) => setUserData({ ...userData, username: v })} />
            }
            <Input isRequired label="E-mail"
                value={userData.email}
                onValueChange={(v) => setUserData({ ...userData, email: v })} />
            <Input isRequired type={isPassVisible ? 'text' : 'password'} label="Password"
                value={userData.password}
                onValueChange={(v) => setUserData({ ...userData, password: v })}
                endContent={
                    <button type="button" onClick={togglePassVisibility}>
                        {isPassVisible ? <EyeSlashFilledIcon className='text-xl' /> :
                            <EyeFilledIcon className='text-xl' />
                        }
                    </button>
                }
            />
            {isSignUp &&
                <Input isRequired type={isPassVisible ? 'text' : 'password'} label="Password confirmation"
                    value={userData.passwordConfirmation}
                    onValueChange={(v) => setUserData({ ...userData, passwordConfirmation: v })}
                    endContent={
                        <button type="button" onClick={togglePassVisibility}>
                            {isPassVisible ? <EyeSlashFilledIcon className='text-xl' /> :
                                <EyeFilledIcon className='text-xl' />
                            }
                        </button>
                    }
                />
            }
            <span className='cursor-pointer' onClick={toggleIsSignUp}>Do not have account yet?</span>
            <Button disabled={isLoading} type='submit'>{isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign in'}</Button>
            {error &&
                <span className="text-danger-300">{error.response?.data?.message}</span>
            }
            {!(error instanceof String) && (error) &&
                error?.response?.data?.errors?.map((err, idx) =>
                    <span className="text-danger-300" key={idx}>{err.msg}</span>
                )
            }


        </form>

    )

}

export default Auth