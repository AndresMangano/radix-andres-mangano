import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { createMaterial } from "../../api/materials";
import { useMaterialSupplies, useQuantityUnits } from "../../api/static";
import { SelectPlaceholder } from "../../controls/SelectPlaceholder";
import { ViewHeader } from "../../controls/ViewHeader";

export function RegisterMaterialView()
{
    const history = useHistory();
    const quantityUnits = useQuantityUnits();
    const materialSupplies = useMaterialSupplies();
    const [{description, code, unitOfMeasure, defaultSupply, isTreatment}, dispatch] = useReducer (reducer, {
        description: '',
        code: '',
        unitOfMeasure: '',
        defaultSupply: '',
        isTreatment: 'false',
    });

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'code': dispatch({ _type: 'CHANGE_CODE', code: event.currentTarget.value}); break
            case 'description': dispatch({_type: 'CHANGE_DESCRIPTION', description: event.currentTarget.value}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'unitOfMeasure': dispatch({ _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: parseInt(event.currentTarget.value)}); break;
            case 'defaultSupply': dispatch({ _type: 'CHANGE_DEFAULT_SUPPLY', defaultSupply: parseInt(event.currentTarget.value)}); break;
            case 'isTreatment': dispatch({ _type: 'CHANGE_IS_TREATMENT', isTreatment: event.currentTarget.value}); break;
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (unitOfMeasure !== '' && defaultSupply !== '') {
            createMaterial({ code, description, unitOfMeasure, defaultSupply, isTreatment: isTreatment === 'true' })
            .then(id => {
                history.push(`/material/${id}`);
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
                        subtitle='Registrar Material'
                        route= {[
                            {
                                label: 'Materiales',
                                link:'/materials',
                            }
                    ]}>
                        
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleAdd}>
                        <div>
                            <label className='tooltip bottom'>
                                Código Interno
                                <p>Código con el que se identifíca el material internamente en la planta.</p>
                            </label>
                            <input type='text' name='code' id='code' value={code} onChange={handleInputChange}
                                minLength={3} maxLength={255} required />
                        </div>
                        <div>
                            <label>Descripción</label>
                            <input type='text' name='description' id='description' value={description} onChange={handleInputChange}
                                minLength={3} maxLength={255} required />
                        </div>
                        <div>
                            <label className='tooltip bottom'>
                                Unidad de Medida
                                <p>Unidad de medida con la que se suele gestionar el material.</p>
                            </label>
                            <select name='unitOfMeasure' id="unitOfMeasure" value={unitOfMeasure} onChange={handleSelectChange} required>
                                <SelectPlaceholder />
                            {   (quantityUnits) && 
                                    quantityUnits.map((q) => 
                                        <option key={q.key} value={q.key}>{q.value}</option>
                                )
                            }
                            </select>
                        </div>
                        <div>
                            <label className='tooltip bottom'>
                                Aprovisionamiento
                                <p>
                                    Este campo indica como obtiene el material la planta.<br /><br />
                                    - INTERNO: el material es fabricado por la planta.<br /><br />
                                    - EXTERNO: el material es comprado a un proveedor externo.
                                </p>
                            </label>
                            <select name='defaultSupply' id="defaultSupply" value={defaultSupply} onChange={handleSelectChange} required>
                                <SelectPlaceholder />
                            {
                                materialSupplies?.map((q) => 
                                    <option key={q.key} value={q.key}>{q.value}</option>
                                )
                            }
                            </select>
                        </div>
                        <div>
                            <label className='tooltip bottom'>
                                Tratamiento
                                <p>Define si el material es un tratamiento o no.</p>
                            </label>
                            <select name='isTreatment' value={isTreatment} onChange={handleSelectChange} required>
                                <option value='true'>Si</option>
                                <option value='false'>No</option>
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
    description: string;
    code: string;
    unitOfMeasure: number|'';
    defaultSupply: number|'';
    isTreatment: string;
}

type Action =
| { _type: 'CHANGE_DESCRIPTION', description: string}
| { _type: 'CHANGE_CODE', code: string}
| { _type: 'CHANGE_UNIT_OF_MEASURE', unitOfMeasure: number}
| { _type: 'CHANGE_DEFAULT_SUPPLY', defaultSupply: number}
| { _type: 'CHANGE_IS_TREATMENT', isTreatment: string}

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_DESCRIPTION': return { ...state, description: action.description};
        case 'CHANGE_CODE': return { ...state, code: action.code};
        case 'CHANGE_UNIT_OF_MEASURE': return { ...state, unitOfMeasure: action.unitOfMeasure};
        case 'CHANGE_DEFAULT_SUPPLY': return { ...state, defaultSupply: action.defaultSupply};
        case 'CHANGE_IS_TREATMENT': return { ...state, isTreatment: action.isTreatment};
    }
}