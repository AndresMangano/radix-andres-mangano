import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { createLabor } from "../../api/labors";
import { ViewHeader } from "../../controls/ViewHeader";

export function RegisterLaborsView() {
    const history = useHistory();
    const [{description}, dispatch] = useReducer (reducer, {
        description: '',
    })

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'description': dispatch({_type: 'CHANGE_DESCRIPTION', description: event.currentTarget.value}); break
        }
    }

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        createLabor({description})
            .then(() => {
                history.push('/labors')
            });
    }


    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle='Registrar Mano de Obra'
                        route= {[
                        {
                            label: 'Mano de Obra',
                            link: '/labors',
                        }
                    ]}>
                        
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleRegister}>
                        <div>
                            <label>Descripción</label>
                            <input type='text' name='description' id='description' value={description}  onChange={handleInputChange}
                                minLength={3} maxLength={255} required />
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
    description: string;
}

type Action =
| { _type: 'CHANGE_DESCRIPTION', description: string}

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_DESCRIPTION': return { ...state, description: action.description};
    }
}