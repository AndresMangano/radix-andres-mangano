import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { createCostPool, DRIVER_MACHINE_HOURS } from "../../api/cost-pools";
import { getMachines } from "../../api/machines";
import { useCostDrivers } from "../../api/static";
import { SelectPlaceholder } from "../../controls/SelectPlaceholder";
import { ViewHeader } from "../../controls/ViewHeader";
import { useRefresh } from "../../helpers/http.helpers";

export function CreateCostPoolView() {
    const history = useHistory();
    const costDrivers = useCostDrivers();
    const [machines] = useRefresh(() => getMachines(), []);
    const [{description, costDriver, machineId}, dispatch] = useReducer (reducer, {
        description: '',
        costDriver: '',
        machineId: ''
    })

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'description': dispatch({_type: 'CHANGE_DESCRIPTION', description: event.currentTarget.value}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'costDriver': dispatch({ _type: 'CHANGE_COST_DRIVER', costDriver: parseInt(event.currentTarget.value)}); break
            case 'machineId': dispatch({_type: 'CHANGE_MACHINE', machineId: event.currentTarget.value === '' ? '' : parseInt(event.currentTarget.value)})
        }
    }

    function handleCreate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (costDriver !== '') {
            var body = costDriver === DRIVER_MACHINE_HOURS
                ? { description, costDriver, machineId: machineId === '' ? undefined : machineId}
                : { description, costDriver };

            createCostPool(body)
            .then(() => {
                history.push('/cost-pools')
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
                        subtitle='Crear Centro de Costos'
                        route={[
                            {
                                label: 'Centros de Costo',
                                link:'/cost-pools',
                            }
                        ]}
                    >
                        
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleCreate}>
                        <div>
                            <label>Descripción</label>
                            <input type='text' name='description' id='description' value={description} onChange={handleInputChange}
                                minLength={3} maxLength={255} required />
                        </div>
                        <div>
                            <label className='tooltip bottom'>Factor
                                <p>
                                    Factor con el que se asignaran los costos a este centro.<br /><br />
                                    - MACHINE HOURS: variará en base a las horas de máquina utilizadas por la planta en el período.<br /><br />
                                    - SALES TARGET: variará en base al target de ventas de la planta.
                                </p>
                            </label>
                            <select name='costDriver' id='costDriver' value={costDriver} onChange={handleSelectChange} required>
                                <SelectPlaceholder />
                                { costDrivers?.map((c) =>
                                    <option key={c.key} value={c.key}>{c.value}</option>)
                                }
                            </select>
                        </div>
                        { costDriver === DRIVER_MACHINE_HOURS &&
                            <div>
                                <label className='tooltip bottom'>
                                    Sector
                                    <p>
                                        En caso de que el centro de costos esté asociado a un solo sector, se debe indicar en este campo.
                                        De lo contrario seleccionar 'Todos'.
                                    </p>
                                </label>
                                <select name='machineId' id='machineId' value={machineId} onChange={handleSelectChange}>
                                    <option key='' value=''>Todos</option>
                                    { machines?.map((m) =>
                                        <option key={m.machineId} value={m.machineId}>{m.description}</option>)
                                    }
                                </select>
                            </div>
                        }
                        <footer>
                            <button type='submit'>Crear</button>
                        </footer>
                    </form>
                </section>
            </div>
        </div>
    )
}
  
type State = {
    description: string;
    costDriver: number|'';
    machineId: number|'';
}

type Action =
| { _type: 'CHANGE_DESCRIPTION', description: string}
| { _type: 'CHANGE_COST_DRIVER', costDriver: number}
| { _type: 'CHANGE_MACHINE', machineId: number|''};

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_DESCRIPTION': return { ...state, description: action.description};
        case 'CHANGE_COST_DRIVER': return { ...state, costDriver: action.costDriver, machineId: ''};
        case 'CHANGE_MACHINE': return { ...state, machineId: action.machineId };
    }
}