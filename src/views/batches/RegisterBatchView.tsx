import React, { useMemo, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { createBatch } from "../../api/batches";
import { getMaterialMachines } from "../../api/material-machines";
import { getMaterials } from "../../api/materials";
import { useQuantityUnits } from "../../api/static";
import { SelectPlaceholder } from "../../controls/SelectPlaceholder";
import { ViewHeader } from "../../controls/ViewHeader";
import { useRefresh } from "../../helpers/http.helpers";

export function RegisterBatchView() {
    const history = useHistory();
    const [materials] = useRefresh(() => getMaterials(), []);
    const [materialMachines] = useRefresh(() => getMaterialMachines({}), []);
    const quantityUnits  = useQuantityUnits();

    const [{date, materialCode, materialMachineId, quantity, unitOfMeasure}, dispatch] = useReducer (reducer, {
        date: new Date(),
        materialCode: '',
        materialMachineId: '',
        quantity: '',
        unitOfMeasure: '',
    });

    const selectedMaterial = useMemo(() => {
        return materials?.find(m => m.code.toString() === materialCode);
    }, [materials, materialCode])

    const allowedMachines = useMemo(() => {
        return materialMachines?.filter(mm => mm.material.materialId === selectedMaterial?.materialId);
    }, [materialMachines, selectedMaterial]);

    const registerIsDisabled = useMemo(() => {
        return selectedMaterial === undefined
    }, [selectedMaterial])

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'quantity': dispatch({ _type: 'CHANGE_QUANTITY', quantity: event.currentTarget.valueAsNumber }); break
            case 'date': dispatch({ _type: 'CHANGE_DATE', date: event.currentTarget.valueAsDate }); break
            case 'materialCode': dispatch({_type: 'CHANGE_MATERIAL_CODE', materialCode: event.currentTarget.value}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'materialMachineId': dispatch({ _type: 'CHANGE_MATERIAL_MACHINE_ID', materialMachineId: parseInt(event.currentTarget.value)}); break
            case 'unitOfMeasure': dispatch({ _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: parseInt(event.currentTarget.value)}); break
        }
    }

   function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (date !== null && materialMachineId !== '' && quantity !== '' && unitOfMeasure !== '') {
            createBatch({date, materialMachineId, quantity, unitOfMeasure})
                .then(() => {
                    history.push('/batches')
                });
        }
        else {
            alert('Error al enviar el formulario')
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle='Registrar Lote de Producción'
                        route= {[
                        {
                            label: 'Lotes de Producción',
                            link:'/batches',
                        }
                    ]}>
                        
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleAdd} autoComplete='off'>
                        <div>
                            <label>Fecha</label>
                            <input type='date' name='date' value={date?.toISOString().split('T')[0]} onChange={handleInputChange} required/>
                        </div>
                        <div>
                            <label>Material</label>
                            <input type='text' name='materialCode' value={materialCode} id='material' list='materialsList' onChange={handleInputChange}/>
                            <datalist id='materialsList'>
                                {   materials?.map((m) =>
                                        <option key={m.materialId} value={m.code}>{m.description}</option>
                                    )
                                }
                            </datalist>
                        </div>
                        <div>
                            <label>Descripción</label>
                            <span>{selectedMaterial?.description}</span>
                        </div>
                        <div>
                            <label>Versión de Fab.</label>
                            <select name='materialMachineId' id="materialMachineId" value={materialMachineId} onChange={handleSelectChange} required disabled={selectedMaterial === undefined}>
                                <SelectPlaceholder />
                            {   allowedMachines?.map((m) => 
                                    <option key={m.materialMachineId} value={m.materialMachineId}>
                                        {`#${m.materialMachineId}: ${m.machine.description}`}
                                    </option>
                                )
                            }
                            </select>
                        </div>
                        <div>
                            <label>Cantidad</label>
                            <input type='number' name='quantity' id='quantity' value={quantity} onChange={handleInputChange} required/>
                        </div>
                        <div>
                            <label>Unidad de Medida</label>
                            <select name='unitOfMeasure' id='unitOfMeasure' value={unitOfMeasure} onChange={handleSelectChange} required>
                                <SelectPlaceholder />
                            {   (quantityUnits) && 
                                    quantityUnits.map((q) =>
                                        <option key={q.key} value={q.key}>{q.value}</option>
                                )
                            }
                            </select>
                        </div>
                        <footer>
                            <button type='submit' disabled={registerIsDisabled}>Registrar</button>
                        </footer>
                    </form>
                </section>
            </div>
        </div>
    )
}
  
type State = {
    materialMachineId: number|'';
    materialCode: string;
    quantity: number|'';
    date: Date|null;
    unitOfMeasure: number|'';
}

type Action =
| { _type: 'CHANGE_MATERIAL_MACHINE_ID', materialMachineId: number}
| { _type: 'CHANGE_MATERIAL_CODE', materialCode: string}
| { _type: 'CHANGE_QUANTITY', quantity: number}
| { _type: 'CHANGE_DATE', date: Date|null}
| { _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: number}

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_MATERIAL_MACHINE_ID': return { ...state, materialMachineId: action.materialMachineId};
        case 'CHANGE_MATERIAL_CODE': return { ...state, materialCode: action.materialCode};
        case 'CHANGE_QUANTITY': return { ...state, quantity: action.quantity || ''};
        case 'CHANGE_DATE': return { ...state, date: action.date}
        case 'CHANGE_UNIT_OF_MEASURE': return { ...state, unitOfMeasure: action.unitOfMeasure};
    }
}
