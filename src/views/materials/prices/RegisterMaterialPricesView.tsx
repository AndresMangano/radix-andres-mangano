import React, { useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createMaterialPrice } from "../../../api/material-prices";
import { useCurrencies, useQuantityUnits } from "../../../api/static";
import { SelectPlaceholder } from "../../../controls/SelectPlaceholder";

export function RegisterMaterialPricesView() {
    const history = useHistory();
    const params = useParams<{materialId: string;}>();
    const materialId = parseInt(params.materialId);
    const quantityUnits  = useQuantityUnits();
    const currencies = useCurrencies();
    const [{ validFrom, base, unitOfMeasure, price, currency }, dispatch] = useReducer (reducer, {
        validFrom: new Date(),
        base: '',
        unitOfMeasure: '',
        price: '',
        currency: '',
    })
    
    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'validFrom': dispatch({ _type: 'CHANGE_VALID_FROM', validFrom: event.currentTarget.valueAsDate }); break
            case 'base': dispatch({_type: 'CHANGE_BASE', base: parseFloat(event.currentTarget.value)}); break
            case 'price': dispatch({_type: 'CHANGE_PRICE', price: parseFloat(event.currentTarget.value)}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'unitOfMeasure': dispatch({_type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: parseInt(event.currentTarget.value)}); break
            case 'currency': dispatch({_type: 'CHANGE_CURRENCY', currency: parseInt(event.currentTarget.value)}); break
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if ( validFrom !== null && base !== '' && unitOfMeasure !== '' && price !== '' && currency !== '' ) {
            createMaterialPrice({materialId, validFrom, base, unitOfMeasure, price, currency})
                .then (() => {
                    history.push(`/material/${materialId}/prices`)
                });
        }
        else {
            alert('Error al enviar el formulario')
        }
      }

    return(
        <form onSubmit={handleAdd}>
            <div>
                <label className='tooltip bottom'>
                    Valido desde
                    <p>Fecha desde la cual es efectivo el precio.</p>
                </label>
                <input type='date' name='validFrom' value={validFrom?.toISOString().split('T')[0]} onChange={handleInputChange} required/>
            </div>
            <div>
                <label className='tooltip bottom'>
                    Base
                    <p>Cantidad de unidades a las que corresponde el precio.</p>
                </label>
                <input type='number' name='base' id='base' value={base} onChange={handleInputChange}
                    minLength={3} maxLength={255} required />
            </div>
            <div>
                <label className='tooltip bottom'>
                    Unidad de Medida
                    <p>Unidad de medida de la base.</p>
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
            <div>
                <label>Precio</label>
                <input type='number' name='price' id='price' value={price} onChange={handleInputChange}
                    minLength={3} maxLength={255} required />
            </div>
            <div>
                <label>Moneda</label>
                <select name='currency' id='currency' value={currency} onChange={handleSelectChange} required>
                    <SelectPlaceholder />
                {   (currencies) && 
                        currencies.map((c) =>
                            <option key={c.key} value={c.key}>{c.value}</option>
                    )
                }
                </select>
            </div>
            <footer>
                <button type='submit'>Agregar</button>
            </footer>
        </form>
    )
}

type State = {
    validFrom: Date|null;
    base: number|'';
    unitOfMeasure: number|'';
    price: number|'';
    currency: number|'';
}

type Action =
| { _type: 'CHANGE_VALID_FROM', validFrom: Date|null}
| { _type: 'CHANGE_BASE', base: number }
| { _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: number}
| { _type: 'CHANGE_PRICE', price: number }
| { _type: 'CHANGE_CURRENCY', currency: number}


function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_VALID_FROM': return { ...state, validFrom: action.validFrom}
        case 'CHANGE_BASE': return { ...state, base: action.base || ''};
        case 'CHANGE_UNIT_OF_MEASURE': return { ...state, unitOfMeasure: action.unitOfMeasure};
        case 'CHANGE_PRICE': return { ...state, price: action.price || ''};
        case 'CHANGE_CURRENCY': return { ...state, currency: action.currency};
    }
}