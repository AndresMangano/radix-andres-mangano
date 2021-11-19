import React, { useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getMachines } from "../../../api/machines";
import { createMaterialMachine } from "../../../api/material-machines";
import { useQuantityUnits } from "../../../api/static";
import { SelectPlaceholder } from "../../../controls/SelectPlaceholder";
import { useRefresh } from "../../../helpers/http.helpers";

export function RegisterMaterialMachinesView() {
    const history = useHistory();
    const params = useParams<{
        materialId: string;
    }>();
    const materialId = parseInt(params.materialId);
    const [machines] = useRefresh(() => getMachines(), []);
    const unitsOfMeasure = useQuantityUnits();
    const [{ machineId, hourlyRate, unitOfMeasure }, dispatch] = useReducer (reducer, {
        machineId: '',
        hourlyRate: '',
        unitOfMeasure: ''
    })
    
    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'hourlyRate': dispatch({_type: 'CHANGE_HOURLY_RATE', hourlyRate: event.currentTarget.valueAsNumber}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'machineId': dispatch({_type: 'CHANGE_MACHINE_ID', machineId: parseInt(event.currentTarget.value)}); break
            case 'unitOfMeasure': dispatch({_type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: parseInt(event.currentTarget.value)}); break;
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if ( machineId !== '' && hourlyRate !== '' && unitOfMeasure !== '') {
            createMaterialMachine({materialId, machineId, hourlyRate, unitOfMeasure})
            .then(() => {
                history.push(`/material/${materialId}/machines`)
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
                    Sector
                    <p>Sector productivo en el cual se fabrica el material.</p>
                </label>
                <select name='machineId' id='machineId' value={machineId} onChange={handleSelectChange} required>
                    <SelectPlaceholder />
                {   (machines) && 
                        machines.map((l) =>
                            <option key={l.machineId} value={l.machineId}>{l.description}</option>
                    )
                }
                </select>
            </div>
            <div>
                <label className='tooltip bottom'>
                    Cadencia (por hora)
                    <p>Unidades por hora que fabrica una estación.</p>
                </label>
                <input type='number' name='hourlyRate' id='hourlyRate' value={hourlyRate} onChange={handleInputChange}
                    minLength={3} maxLength={255} required />
            </div>
            <div>
                <label>Unidad de Medida</label>
                <select name='unitOfMeasure' id='unitOfMeasure' value={unitOfMeasure} onChange={handleSelectChange} required>
                    <SelectPlaceholder />
                    { unitsOfMeasure?.map((l) =>
                        <option key={l.key} value={l.key}>{l.value}</option>)
                    }
                </select>
            </div>
            <footer>
                <button type='submit'>Registrar</button>
            </footer>
        </form>
    )
}

type State = {
    machineId: number|'';
    hourlyRate: number|'';
    unitOfMeasure: number|'';
}

type Action =
| { _type: 'CHANGE_MACHINE_ID', machineId: number}
| { _type: 'CHANGE_HOURLY_RATE', hourlyRate: number}
| { _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: number};

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_MACHINE_ID': return { ...state, machineId: action.machineId};
        case 'CHANGE_HOURLY_RATE': return { ...state, hourlyRate: action.hourlyRate || ''};
        case 'CHANGE_UNIT_OF_MEASURE': return { ...state, unitOfMeasure: action.unitOfMeasure};
    }
}