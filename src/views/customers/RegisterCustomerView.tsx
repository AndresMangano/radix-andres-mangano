import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { createCustomer } from "../../api/customers";

export function RegisterCustomersView() {
    const history = useHistory();
    const [{name}, dispatch] = useReducer (reducer, {
        name: '',
    })

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'name': dispatch({_type: 'CHANGE_NAME', name: event.currentTarget.value}); break
        }
    }

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        createCustomer({name})
            .then(id => {
                history.push(`/customer/${id}`);
            });
    }


    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle='Registrar Cliente'
                        route= {[
                        {
                            label: 'Clientes',
                            link:'/customers',
                        }
                    ]}>
                        
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleRegister}>
                        <div>
                            <label>Nombre</label>
                            <input type='text' name='name' id='name' value={name} onChange={handleInputChange}
                                minLength={3} maxLength={255} required/>
                        </div>
                        <footer>
                            <button type='submit'>Registrar</button>
                        </footer>
                    </form>
                </section>
            </div>
        </div>
    )
}
  
type State = {
    name: string;
}

type Action =
| { _type: 'CHANGE_NAME', name: string}

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_NAME': return { ...state, name: action.name};
    }
}