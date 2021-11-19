import { useReducer } from "react";
import { logIn } from "../../api/users";

export function LoginView() {

    const [{ email, password }, dispatch] = useReducer(reducer, {
        email: '',
        password: '',
    });

    function handleLogIn(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        logIn({ email, password })
    };

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch (event.currentTarget.name) {
            case 'email': dispatch({ _type: 'CHANGE_EMAIL', email: event.currentTarget.value }); break;
            case 'password': dispatch({ _type: 'CHANGE_PASSWORD', password: event.currentTarget.value }); break;
        }
    }
    
    return(
        <div className='view-panel'>
            <form onSubmit={handleLogIn}> 
                <h1>radiX</h1>
                <div>
                    <label>Email</label>
                    <input type='email' name='email' id='email' value={email} onChange={handleInputChange} required/>
                </div>
                <div>
                    <label>Password</label>
                    <input type='password' name='password' id='password' value={password} onChange={handleInputChange} required/>
                </div>
                <footer>
                    <button type='submit'>Log In</button>
                </footer>
            </form>
        </div>
    )
}

type State = {
    email: string;
    password: string;
}
type Action =
| { _type: 'CHANGE_EMAIL', email: string }
| { _type: 'CHANGE_PASSWORD', password: string }
function reducer(state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_EMAIL': return { ...state, email: action.email };
        case 'CHANGE_PASSWORD': return { ...state, password: action.password };
    }
}