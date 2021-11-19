import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { deleteMachine, getMachine, updateMachine } from '../../api/machines';
import { Tabs } from '../../controls/Tabs';
import { ViewHeader } from '../../controls/ViewHeader';
import { useRefresh } from '../../helpers/http.helpers';
import { MachineCostPoolsView } from './cost-pools/MachineCostPoolsView';
import { MachineLaborsView } from './labors/MachineLaborsView';
import { RegisterMachineLaborsView } from './labors/RegisterMachineLaborsView';
import { MachineMaterialsView } from './materials/MachineMaterialsView';

export function MachineView () {
    const history = useHistory();
    const params = useParams<{machineId: string; screen: string|undefined}>();
    const machineId = parseInt(params.machineId);
    const [machine, refreshMachine] = useRefresh(() => getMachine(machineId), [machineId]);
    const [description, setDescription] = useState('');

    const buttonIsDisabled = useMemo(() => {
        return machine?.description === description 
    }, [machine?.description, description])

    useEffect(() => {
        if (machine !== undefined) {
            setDescription(machine.description);
        }
    }, [machine]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        updateMachine(machineId, {description})
            .then(() => refreshMachine());
    }

    function handleDeleteRow (machineId: number) {
        if (window.confirm('¿Está seguro que quiere desactivar el sector?')) {
            deleteMachine(machineId)
            .then(() => {
                history.push('/machines')
            });
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle={`Sector - #${machineId}`}
                        route= {[
                        {
                            label: 'Sectores',
                            link:'/machines',
                        }
                    ]}>
                        En esta pantalla se gestionan los datos correspondientes a un sector productivo de la planta.
                        <br /><br />
                        - Modificar la descripción del sector
                        <ol>
                            <li>Hacer click en el campo que sea desea modificar</li>
                            <li>Ingresar un nuevo valor</li>
                            <li>Hacer click en el botón <strong>Modificar</strong> para guardar los cambios</li>
                        </ol>
                        - Desactivar el sector
                            <ol>
                                <li>Hacer click en el botón <strong>Desactivar</strong> para inhabilitar el sector</li>
                                <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                            </ol>
                        - Definir operadores necesarios para que el sector pueda producir
                        <ol>
                            <li>Hacer click en el botón <strong>Definir Operador</strong>.</li>
                            <li>Completar el formulario.</li>
                        </ol>
                        - Eliminar un operador
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> de la tabla correspondiente al operador que se desea borrar.</li>
                        </ol>
                        - Pestaña de Centros de Costo
                        <ol>
                            <li>En esta pestaña podrá ver los centros de costo asignados al sector.</li>
                        </ol>
                        - Pestaña de Materiales
                        <ol>
                            <li>En esta pestaña podrá ver los materiales asignados al sector.</li>
                        </ol>
                        - Eliminar un Material
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> del material que desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li> 
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleSubmit}>
                        {
                        (machine !== undefined) &&
                            <>
                                <div>
                                    <label>Descripción</label>
                                    <input value={description} onChange={e => setDescription(e.currentTarget.value)} />
                                </div>
                                <footer>
                                    <button disabled={buttonIsDisabled}>Modificar</button>
                                    <button type='button' className='button-delete' onClick={() => handleDeleteRow(machine.machineId)}>Remover</button>
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
                                label: 'Operadores',
                                link: `/machine/${machineId}/labors`,
                                isActive: params.screen === 'labors' || params.screen === undefined,
                            },
                            {
                                label: 'Centros de Costo',
                                link: `/machine/${machineId}/costPools`,
                                isActive: params.screen === 'costPools'
                            },
                            {
                                label: 'Materiales',
                                link: `/machine/${machineId}/materials`,
                                isActive: params.screen === 'materials'
                            }
                        ]}
                    />
                </header>
                <section>
                <Switch>
                    <Route exact path='/machine/:machineId/labors/register'>
                        <RegisterMachineLaborsView />
                    </Route>
                    <Route exact path='/machine/:machineId/costPools'>
                        <MachineCostPoolsView />
                    </Route>
                    <Route exact path='/machine/:machineId/materials'>
                        <MachineMaterialsView />
                    </Route>
                    <Route path='/machine/:machineId'>
                        <MachineLaborsView />
                    </Route>
                </Switch>
                </section>
	        </div>
        </div>
    )
}