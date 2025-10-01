
import { Link } from "react-router"

const Login = () => {
    return (
        <section>
            {/* Logo + text  */}
            <div>
                <img src="" alt="" />
                <h2>Log into your Account</h2>
            </div>
            {/* Buttons */}
            <div>
                <Link to="/auth/signup"><Button text="Sign up free" /></Link>
                <Link to="/auth/login"><Button text="Log in" /></Link>
            </div>
        </section>
    )
}

export default Login