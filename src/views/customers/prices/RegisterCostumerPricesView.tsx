import React, { useMemo, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createCustomerPrice } from "../../../api/customer-prices";
import { getMaterials } from "../../../api/materials";
import { useQuantityUnits } from "../../../api/static";
import { SelectPlaceholder } from "../../../controls/SelectPlaceholder";
import { useRefresh } from "../../../helpers/http.helpers";

export function RegisterCostumerPricesView() {
    const history = useHistory();
    const params = useParams<{customerId: string}>();
    const customerId = parseInt(params.customerId);
    const [materials] = useRefresh(() => getMaterials(), []);
    const quantityUnits  = useQuantityUnits();
    const [{ materialCode, code, unitOfMeasure, price, salesTarget }, dispatch] = useReducer (reducer, {
        materialCode: '',
        code: '',
        price: '',
        salesTarget:'',
        unitOfMeasure: '',
    })

    const selectedMaterial = useMemo(() => {
        return materials?.find(m => m.code.toString() === materialCode);
    }, [materials, materialCode])

    const registerIsDisabled = useMemo(() => {
        return selectedMaterial === undefined
    }, [selectedMaterial])

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'price': dispatch({_type: 'CHANGE_PRICE', price: parseFloat(event.currentTarget.value)}); break
            case 'salesTarget': dispatch({_type: 'CHANGE_SALES_TARGET', salesTarget: parseFloat(event.currentTarget.value)}); break
            case 'code': dispatch({ _type: 'CHANGE_CODE', code: event.currentTarget.value}); break
            case 'materialCode': dispatch({_type: 'CHANGE_MATERIAL_CODE', materialCode: event.currentTarget.value}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'unitOfMeasure': dispatch({ _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: parseInt(event.currentTarget.value)}); break
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (selectedMaterial !== undefined && price !== '' && salesTarget !== ''  && unitOfMeasure !== '') {
            createCustomerPrice({customerId, materialId: selectedMaterial.materialId, price, salesTarget, unitOfMeasure, code})
            .then(() => {
                history.push(`/customer/${customerId}/prices`)
            });
        }
        else {
            alert("Error al enviar el formulario");
        }
    }
    return(
        <form onSubmit={handleAdd} autoComplete='off'>
            <div>
                <label>Material</label>
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
                    Código
                    <p>Código de pieza que maneja el cliente.</p>
                </label>
                <input type='text' name='code' id='code' value={code} onChange={handleInputChange}
                    minLength={3} maxLength={255} required />
            </div>
            <div>
                <label>Precio</label>
                <input type='number' name='price' id='price' value={price} onChange={handleInputChange}
                    minLength={3} maxLength={255} required />
            </div>
            <div>
                <label className='tooltip bottom'>
                    Objetivo de Ventas
                    <p>Ventas mensuales que se esperan vender actualmente al cliente.</p>
                </label>
                <input type='number' name='salesTarget' id='salesTarget' value={salesTarget} onChange={handleInputChange}
                    minLength={3} maxLength={255} required />
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
                <button type='submit' disabled={registerIsDisabled}>Agregar</button>
            </footer>
        </form>
    )
}

type State = {
    materialCode: string;
    unitOfMeasure: number|'';
    price: number|'';
    salesTarget: number|'',
    code: string;
}

type Action =
| { _type: 'CHANGE_MATERIAL_CODE', materialCode: string}
| { _type: 'CHANGE_CODE', code: string}
| { _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: number}
| { _type: 'CHANGE_PRICE', price: number }
| { _type: 'CHANGE_SALES_TARGET', salesTarget: number}



function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_MATERIAL_CODE': return { ...state, materialCode: action.materialCode};
        case 'CHANGE_CODE': return { ...state, code: action.code};
        case 'CHANGE_UNIT_OF_MEASURE': return { ...state, unitOfMeasure: action.unitOfMeasure};
        case 'CHANGE_PRICE': return { ...state, price: action.price || ''};
        case 'CHANGE_SALES_TARGET': return { ...state, salesTarget: action.salesTarget||''}
    }
}