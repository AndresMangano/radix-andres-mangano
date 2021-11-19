import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { registerUser } from "../../api/users";
import { ViewHeader } from "../../controls/ViewHeader";

export function RegisterUsersView() {
    const history = useHistory();
    const [{email, isAdmin}, dispatch] = useReducer (reducer, {
        email: '',
        isAdmin: 'false',
    });

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'email': dispatch({_type:'CHANGE_EMAIL', email: event.currentTarget.value}); break;
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch (event.currentTarget.name) {
            case 'userRights': dispatch({ _type: 'CHANGE_IS_ADMIN', isAdmin: event.currentTarget.value }); break;
        }
    }

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        registerUser({email, isAdmin: isAdmin === 'true'})
        .then(() => {
            history.push('/users');
        });
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle='Registrar Usuario'
                        route= {[
                        {
                            label: 'Usuarios',
                            link:'/users',
                        }
                    ]}>
                        
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleRegister}>
                        <div>
                            <label>Email</label>
                            <input type='email' name='email' id='email' value={email} onChange={handleInputChange} required/>
                        </div>
                        <div>
                            <label className='check-input tooltip bottom'>
                                Permisos
                                <p>
                                    Tipo de permisos que tendrá el usuario. <br /><br />
                                    - USUARIO: podrá acceder a toda la aplicación pero no podrá agregar usuarios. <br /><br />
                                    - ADMIN: podrá ejecutar cualquier acción dentro de la aplicación.
                                </p>
                            </label>
                            <select name='userRights' value={isAdmin} onChange={handleSelectChange}>
                                <option value='false'>Usuario</option>
                                <option value='true'>Admin</option>
                            </select>
                        </div>
                        <footer>
                            <button type='submit'>Registrar</button>
                        </footer>
                    </form>
                </section>
            </div>
        </div>
    );
}

type State = {
    email: string;
    isAdmin: string;
}
type Action =
| { _type: 'CHANGE_EMAIL', email: string }
| { _type: 'CHANGE_IS_ADMIN', isAdmin: string }
function reducer(state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_EMAIL': return { ...state, email: action.email };
        case 'CHANGE_IS_ADMIN': return { ...state, isAdmin: action.isAdmin };
    }
}