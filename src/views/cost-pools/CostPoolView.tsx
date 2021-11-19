import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { deleteCostPool, DRIVER_MACHINE_HOURS, getCostPool, updateCostPool } from '../../api/cost-pools';
import { Tabs } from '../../controls/Tabs';
import { ViewHeader } from '../../controls/ViewHeader';
import { useRefresh } from '../../helpers/http.helpers';
import { CostPoolsAccountsView } from './CostPoolsAccountsView/CostPoolsAccountsView';

export function CostPoolView () {
    const history = useHistory();
    const params = useParams<{costPoolId: string; screen: string|undefined}>();
    const costPoolId = parseInt(params.costPoolId);
    const [costPool, refreshCostPool] = useRefresh(() => getCostPool(costPoolId), [costPoolId]);
    const [description, setDescription] = useState('');

    const buttonIsDisabled = useMemo(() => {
        return  costPool?.description === description
    }, [costPool?.description, description])

    useEffect(() => {
        if (costPool !== undefined) {
            setDescription(costPool.description);
        }
    }, [costPool]);

    function handleDeleteRow (costPoolId: number) {
        if (window.confirm('¿Está seguro que quiere remover el centro de costos?')) {
            deleteCostPool(costPoolId)
            .then(() => {
                history.push('/cost-pools')
            });
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        updateCostPool(costPoolId, {description})
            .then(() => refreshCostPool());
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader 
                        subtitle={`Centros de Costo - #${costPoolId}`}
                        route={[
                        {
                            label: 'Centros de Costo',
                            link:'/cost-pools',
                        }
                    ]}>
                        En esta pantalla se puede modificar los centros de costo.
                        <br /><br />
                        - Modificar la descripción del centro de costo 
                        <ol>
                            <li>Hacer click en el campo que se desea modificar</li>
                            <li>Ingresar un nuevo valor</li>
                            <li>Hacer click en el botón <strong>Modificar</strong> para guardar los cambios</li>
                        </ol>
                        - Remover el centro de costo 
                        <ol>
                            <li>Hacer click en el botón <strong>Remover</strong> para eliminar el centro de costo</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                        - Pestaña de Cuentas
                        <ol>
                            <li>En esta pestaña podrá ver las cuentas asociadas al centro de costo.</li>
                        </ol>
                        - Eliminar una Cuenta
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> de la cuenta asociada al centro de costo que desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleSubmit}>
                        {
                            (costPool !== undefined) &&
                            <>
                                <div>
                                    <label>Descripción</label>
                                    <input value={description} onChange={e => setDescription(e.currentTarget.value)} />                                    
                                </div>
                                <div>
                                    <label>Factor</label>
                                    <span>{costPool.costDriverKV.value}</span>
                                </div>
                                { costPool.costDriverKV.key === DRIVER_MACHINE_HOURS &&
                                    <div>
                                        <label>Sector</label>
                                        <span>{costPool.machine === null ? 'Todos' : costPool.machine.description}</span>
                                    </div>
                                }
                                <footer>
                                    <button disabled={buttonIsDisabled}>Modificar</button>
                                    <button type='button' className='button-delete' onClick={() => handleDeleteRow(costPool.costPoolId)}>Remover</button>
                                </footer>
                            </>
                        }
                    </form>
                </section>
                </div>
            <div>
                <header>
                    <Tabs 
                        tabs= {[
                            {
                                label: 'Cuentas',
                                link: `/cost-pool/${costPoolId}/accounts`,
                                isActive: params.screen === 'accounts' || params.screen === undefined,
                            }
                        ]}
                    />
                </header>
                <section>
                    <Switch>
                        <Route path='/cost-pool/:costPoolId'>
                            <CostPoolsAccountsView />
                        </Route>
                    </Switch>
                </section>
            </div>
        </div>
    )
}