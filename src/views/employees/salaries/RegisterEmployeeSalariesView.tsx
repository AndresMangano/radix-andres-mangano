import React, { useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createEmployeeSalary } from "../../../api/employee-salaries";

export function RegisterEmployeeSalariesView() {
    const history = useHistory();
    const params = useParams<{employeeId: string;}>();
    const employeeId = parseInt(params.employeeId);
    const [{ validFrom, hourlyRate }, dispatch] = useReducer (reducer, {
        validFrom: new Date(),
        hourlyRate: '',
    })

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'validFrom': dispatch({ _type: 'CHANGE_VALID_FROM', validFrom: event.currentTarget.valueAsDate }); break
            case 'hourlyRate': dispatch({_type: 'CHANGE_HOURLY_RATE', hourlyRate: event.currentTarget.valueAsNumber}); break
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if ( validFrom !== null && hourlyRate !== '' ) {
            createEmployeeSalary({employeeId, validFrom, hourlyRate})
            .then(() => {
                history.push(`/employee/${employeeId}`)
            });
        }
        else {
            alert("Error al enviar el formulario");
        }
    }
    return(
        <form onSubmit={handleAdd}>
            <div>
                <label className='tooltip bottom'>
                    Válido desde
                    <p>Fecha en la que el salario se hizo efectivo.</p>
                </label>
                <input type='date' name='validFrom' value={validFrom?.toISOString().split('T')[0]} onChange={handleInputChange} required/>
            </div>
            <div>
                <label className='tooltip bottom'>
                    Valor Hora (ARS)
                    <p>Salario neto por hora del empleado expresado en ARS.</p>
                </label>
                <input type='number' name='hourlyRate' id='hourlyRate' value={hourlyRate} onChange={handleInputChange}
                    minLength={3} maxLength={255} required />
            </div>
            <footer>
                <button type='submit'>Registrar</button>
            </footer>
        </form>
    )
}

type State = {
    validFrom: Date|null;
    hourlyRate: number|'';
}

type Action =
| { _type: 'CHANGE_VALID_FROM', validFrom: Date|null}
| { _type: 'CHANGE_HOURLY_RATE', hourlyRate: number}

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_VALID_FROM': return { ...state, validFrom: action.validFrom}
        case 'CHANGE_HOURLY_RATE': return { ...state, hourlyRate: action.hourlyRate || ''};
    }
}