import React, { useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { updateAccountDistribution } from "../../../api/account-distribution";
import { getCostPools } from "../../../api/cost-pools";
import { SelectPlaceholder } from "../../../controls/SelectPlaceholder";
import { useRefresh } from "../../../helpers/http.helpers";

export function RegisterAccountDistributionView() {
    const history = useHistory();
    const params = useParams<{accountId: string;}>();
    const accountId = parseInt(params.accountId);
    const [costPools] = useRefresh(() => getCostPools({}), []);
    const [{ costPoolId, percent }, dispatch] = useReducer (reducer, {
        costPoolId: '',
        percent: '',
    })

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        switch(event.currentTarget.name) {
            case 'percent': dispatch({_type: 'CHANGE_PERCENT', percent: parseFloat(event.currentTarget.value)}); break
        }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
        switch(event.currentTarget.name) {
            case 'costPoolId': dispatch({_type: 'CHANGE_COST_POOL_ID', costPoolId: parseInt(event.currentTarget.value)}); break
        }
    }

    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (costPoolId !== '' && percent !== '') {
            updateAccountDistribution({accountId, costPoolId, percent: percent/100})
            .then(() => {
                history.push(`/account/${accountId}/distributions`)
            });
        }
        else {
            alert("Error al enviar el formulario");
        }
    }
    return(
        <form onSubmit={handleAdd}>
            <div>
                <label>Centro de Costos</label>
                <select name='costPoolId' id='costPoolId' value={costPoolId} onChange={handleSelectChange} required>
                    <SelectPlaceholder />
                {   (costPools) && 
                        costPools.map((c) =>
                            <option key={c.costPoolId} value={c.costPoolId}>{c.description}</option>
                    )
                }
                </select>
            </div>
            <div>
                <label className='tooltip bottom'>Porcentaje %
                    <p>Procentaje de gastos de la cuenta que serán imputados a este centro de costos</p>
                </label>
                <input type='number' step='.0001' min="0" max="100" name='percent' id='percent' value={percent} onChange={handleInputChange} required/>
            </div>
            <footer>
                <button type='submit'>Definir</button>
            </footer>
        </form>
    )
}

type State = {
    costPoolId: number|'';
    percent: number|'';
}

type Action =
| { _type: 'CHANGE_COST_POOL_ID', costPoolId: number }
| { _type: 'CHANGE_PERCENT', percent: number }

function reducer (state: State, action: Action) : State {
    switch (action._type) {
        case 'CHANGE_COST_POOL_ID': return { ...state, costPoolId: action.costPoolId };
        case 'CHANGE_PERCENT': return { ...state, percent: action.percent };
    }
}