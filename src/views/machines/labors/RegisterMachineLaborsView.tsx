import React, { useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getLabors } from "../../../api/labors";
import { createMachineLabor } from "../../../api/machine-labors";
import { SelectPlaceholder } from "../../../controls/SelectPlaceholder";
import { useRefresh } from "../../../helpers/http.helpers";

export function RegisterMachineLaborsView() {
    const history = useHistory();
    const params = useParams<{
        machineId: string;
    }>();
    const machineId = parseInt(params.machineId);
    const [labors] = useRefresh(() => getLabors(), []);
    const [{ laborId, usage }, dispatch] = useReducer (reducer, {
        laborId: '',
        usage: '',
    })
    
    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'usage': dispatch({_type: 'CHANGE_USAGE', usage: parseFloat(event.currentTarget.value)}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'labor': dispatch({_type: 'CHANGE_LABOR', laborId: parseInt(event.currentTarget.value)}); break
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if ( laborId !== '' && usage !== '') {
            createMachineLabor({machineId, laborId, usage: usage/100})
            .then(() => {
                history.push(`/machine/${machineId}/labors`)
            });
        }
        else {
            alert("Error al enviar el formulario");
        }
    }
    return(
        <form onSubmit={handleAdd}>
            <div>
                <label>Operador</label>
                <select name='labor' id='labor' value={laborId} onChange={handleSelectChange} required>
                    <SelectPlaceholder />
                {   (labors) && 
                        labors.map((l) =>
                            <option key={l.laborId} value={l.laborId}>{l.description}</option>
                    )
                }
                </select>
            </div>
            <div>
                <label className='tooltip bottom'>
                    Utilización %
                    <p>
                        Porcentaje del tiempo en el que un operador de la categoría indicada está abocado a una sola estación del sector.
                        <br /><br />
                        Algunos ejemplos:
                        <br />
                        - 2 operadores abocados a una estación: 200%.<br />
                        - 1 operador abocados a una estación: 100%.<br />
                        - 1 operador abocado a dos estaciones: 50%.<br />
                    </p>
                </label>
                <input type='number' min="0" name='usage' id='usage' value={usage} onChange={handleInputChange} required/>
            </div>
            <footer>
                <button type='submit'>Definir</button>
            </footer>
        </form>  
    )
}

type State = {
    laborId: number|'';
    usage: number|'';
}

type Action =
| { _type: 'CHANGE_LABOR', laborId: number}
| { _type: 'CHANGE_USAGE', usage: number}

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_LABOR': return { ...state, laborId: action.laborId};
        case 'CHANGE_USAGE': return { ...state, usage: action.usage};
    }
}