import React, { useMemo, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createMaterialComponent } from "../../../api/material-components";
import { getMaterials } from "../../../api/materials";
import { useQuantityUnits } from "../../../api/static";
import { SelectPlaceholder } from "../../../controls/SelectPlaceholder";
import { useRefresh } from "../../../helpers/http.helpers";

export function RegisterMaterialComponentsView() {
    const history = useHistory();
    const params = useParams<{
        materialId: string;
    }>();
    const materialId = parseInt(params.materialId);
    const quantityUnits  = useQuantityUnits();
    const [materials] = useRefresh(() => getMaterials(), []);


    const [{ materialCode, quantity, unitOfMeasure }, dispatch] = useReducer (reducer, {
        materialCode: '',
        quantity: '',
        unitOfMeasure: '',
    });

    const selectedMaterial = useMemo(() => {
        return materials?.find(m => m.code.toString() === materialCode);
    }, [materials, materialCode])

    const registerIsDisabled = useMemo(() => {
        return selectedMaterial === undefined
    }, [selectedMaterial])
    
    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'quantity': dispatch({_type: 'CHANGE_QUANTITY', quantity: event.currentTarget.valueAsNumber}); break
            case 'materialCode': dispatch({_type: 'CHANGE_MATERIAL_CODE', materialCode: event.currentTarget.value}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'unitOfMeasure': dispatch({_type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: parseInt(event.currentTarget.value)}); break
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if ( selectedMaterial !== undefined && unitOfMeasure !== '' && quantity !== '') {
            createMaterialComponent({materialId, componentMaterialId: selectedMaterial.materialId , quantity, unitOfMeasure})
            .then(() => {
                history.push(`/material/${materialId}/components`)
            });
        }
        else {
            alert("Error al enviar el formulario");
        }
    }
    return(
        <form onSubmit={handleAdd} autoComplete='off'>
            <div>
                <label className='tooltip bottom'>
                    Componente
                    <p>Componente utilizado para fabricar el material.</p>
                </label>
                <input type='text' name='materialCode' value={materialCode} id='material' list='materialsList' onChange={handleInputChange}/>
                <datalist id='materialsList'>
                    {   (materials) && 
                            materials.map((m) =>
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
                <label className='tooltip bottom'>
                    Utilización
                    <p>Cantidad del componente utilizada para fabricar el material expresada en la unidad de medida indicada en el campo siguiente.</p>
                </label>
                <input type='number' name='quantity' id='quantity' value={quantity} onChange={handleInputChange}
                    minLength={3} maxLength={255} required />
            </div>
            <div>
                <label className='tooltip bottom'>
                    Unidad de Medida
                    <p>Unidad de medida en la que está expresada la utilización.</p>
                </label>
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
    )
}

type State = {
    materialCode: string;
    quantity: number|'';
    unitOfMeasure: number|'';
}

type Action =
| { _type: 'CHANGE_MATERIAL_CODE', materialCode: string}
| { _type: 'CHANGE_QUANTITY', quantity: number }
| { _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: number}

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_MATERIAL_CODE': return { ...state, materialCode: action.materialCode };
        case 'CHANGE_QUANTITY': return { ...state, quantity: action.quantity || '' };
        case 'CHANGE_UNIT_OF_MEASURE': return { ...state, unitOfMeasure: action.unitOfMeasure };
    }
}