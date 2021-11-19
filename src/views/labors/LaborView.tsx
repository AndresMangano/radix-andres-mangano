import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { deleteLabor, getLabor, updateLabor } from '../../api/labors';
import { Tabs } from '../../controls/Tabs';
import { ViewHeader } from '../../controls/ViewHeader';
import { useRefresh } from '../../helpers/http.helpers';
import { LaborEmployeesView } from './employees/LaborEmployeesView';
import { LaborMachinesView } from './machines/LaborMachinesView';


export function LaborView () {
    const history = useHistory();
    const params = useParams<{laborId: string; screen: string|undefined}>();
    const laborId = parseInt(params.laborId);
    const [labor, refreshLabor] = useRefresh(() => getLabor(laborId), [laborId]);
    const [description, setDescription] = useState('');

    const buttonIsDisabled = useMemo(() => {
        return labor?.description === description
    }, [labor?.description, description])
    
    useEffect(() => {
        if (labor !== undefined) {
            setDescription(labor.description);
        }
    }, [labor]);

    function handleDeleteRow (laborId: number) {
        if (window.confirm('¿Está seguro que quiere remover la mano de obra?')) {
        deleteLabor(laborId)
            .then(() => {
                history.push('/labors')
            });
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        updateLabor(laborId, {description})
            .then(() => refreshLabor());
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader 
                        subtitle={`Mano de Obra - #${laborId}`}
                        route={[
                        {
                            label: 'Mano de Obra',
                            link:'/labors',
                        }
                    ]}>
                        En esta pantalla se puede modificar la mano de obra.
                        <br /><br />
                        - Modificar la descripción de la mano de obra
                        <ol>
                            <li>Hacer click en el campo que se desea modificar</li>
                            <li>Ingresar un nuevo valor</li>
                            <li>Hacer click en el botón <strong>Modificar</strong> para guardar los cambios</li>
                        </ol>
                        - Remover la mano de obra 
                        <ol>
                            <li>Hacer click en el botón <strong>Remover</strong> para eliminar la mano de obra</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                        - Pestaña de Empleados
                        <ol>
                            <li>En esta pestaña podrá ver los empleados asociados a la mano de obra.</li>
                        </ol>
                        - Pestaña de Sectores
                        <ol>
                            <li>En esta pestaña podrá ver los sectores asociados al tipo de mano de obra.</li>
                        </ol>
                        - Eliminar un Sector asociado
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> del sector asociado que desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleSubmit}>
                        {
                            (labor !== undefined) &&
                            <>
                                <div>
                                    <label>Descripción</label>
                                    <input value={description} onChange={e => setDescription(e.currentTarget.value)} />
                                </div>
                                <footer>
                                    <button disabled={buttonIsDisabled}>Modificar</button>
                                    <button type='button' className='button-delete' onClick={() => handleDeleteRow(labor.laborId)}>Remover</button>
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
                                label: 'Empleados',
                                link: `/labor/${laborId}/employees`,
                                isActive: params.screen === 'employees' || params.screen === undefined,
                            },
                            {
                                label: 'Sectores',
                                link: `/labor/${laborId}/machines`,
                                isActive: params.screen === 'machines'
                            }
                        ]}
                    />
                </header>
                <section>
                    <Switch>
                        <Route exact path='/labor/:laborId/machines'>
                            <LaborMachinesView />
                        </Route>
                        <Route path='/labor/:laborId'>
                            <LaborEmployeesView />
                        </Route>
                    </Switch>
                </section>
            </div>
        </div>
    )
}