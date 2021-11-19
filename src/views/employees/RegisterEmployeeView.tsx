import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { createEmployee } from "../../api/employees";
import { getLabors } from "../../api/labors";
import { SelectPlaceholder } from "../../controls/SelectPlaceholder";
import { ViewHeader } from "../../controls/ViewHeader";
import { useRefresh } from "../../helpers/http.helpers";

export function RegisterEmployeeView() {

    const history = useHistory();
    const [{name, laborId}, dispatch] = useReducer (reducer, {
        name: '',
        laborId: '',
    });
    const [labors] = useRefresh(() => getLabors(), []);

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'name': dispatch({_type: 'CHANGE_NAME', name: event.currentTarget.value}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'laborId': dispatch({_type: 'CHANGE_LABOR_ID', laborId: parseInt(event.currentTarget.value)}); break
        }
    }

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (laborId !== '') {
            createEmployee({laborId, name})
                .then(id => {
                    history.push(`/employee/${id}`);
                });
        }
        else {
            alert("Error al enviar el formulario");
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle='Registrar Empleado'
                        route= {[
                        {
                            label: 'Empleados',
                            link:'/employees',
                        }
                    ]}>
                        
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleRegister}>
                        <div>
                            <label className='tooltip bottom'>
                                Nombre
                                <p>Nombre completo del empleado.</p>
                            </label>
                            <input type='text' name='name' id='name' value={name} onChange={handleInputChange}
                                minLength={3} maxLength={255} required />
                        </div>
                        <div>
                            <label>Categoría</label>
                            <select name='laborId' id='laborId' value={laborId} onChange={handleSelectChange} required>
                                <SelectPlaceholder />
                            {   (labors) && 
                                    labors.map((l) =>
                                        <option key={l.laborId} value={l.laborId}>{l.description}</option>
                                )
                            }
                            </select>
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
    laborId: number|'';
}

type Action =
| { _type: 'CHANGE_NAME', name: string}
| { _type: 'CHANGE_LABOR_ID', laborId: number}

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_NAME': return { ...state, name: action.name};
        case 'CHANGE_LABOR_ID': return { ...state, laborId: action.laborId}; 
    }
}