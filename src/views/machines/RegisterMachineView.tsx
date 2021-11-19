import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { createMachine } from "../../api/machines";
import { ViewHeader } from "../../controls/ViewHeader";

export function RegisterMachineView() {

    const history = useHistory();
    const [{description}, dispatch] = useReducer (reducer, {
        description: '',
    })

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'description': dispatch({_type: 'CHANGE_DESCRIPTION', description: event.currentTarget.value}); break
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        createMachine({description})
            .then(id => {
                history.push(`/machine/${id}`);
            });
    }


    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle='Registrar Sector'
                        route= {[
                            {
                                label: 'Sectores',
                                link:'/machines',
                            }
                    ]}>
                        
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleAdd}>
                        <div>
                            <label className='tooltip bottom'>
                                Descripción
                                <p>Nombre del sector.</p>
                            </label>
                            <input type='text' name='description' id='description' value={description} onChange={handleInputChange}
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