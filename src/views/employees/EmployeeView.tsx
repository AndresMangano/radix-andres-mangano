import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { deleteEmployee, getEmployee, updateEmployee } from '../../api/employees';
import { getLabors } from '../../api/labors';
import { SelectPlaceholder } from '../../controls/SelectPlaceholder';
import { Tabs } from '../../controls/Tabs';
import { ViewHeader } from '../../controls/ViewHeader';
import { useRefresh } from '../../helpers/http.helpers';
import { EmployeeSalariesView } from './salaries/EmployeeSalariesView';
import { RegisterEmployeeSalariesView } from './salaries/RegisterEmployeeSalariesView';

export function EmployeeView () {
    const history = useHistory();
    const params = useParams<{employeeId: string; screen: string|undefined}>();
    const employeeId = parseInt(params.employeeId);
    const [employee, refreshEmployee] = useRefresh(() => getEmployee(employeeId), [employeeId]);
    const [labors] = useRefresh(() => getLabors(), []);
    const [name, setName] = useState('');
    const [laborId, setLaborId] = useState(0);

    const buttonIsDisabled = useMemo(() => {
        return employee?.labor.laborId === laborId && employee?.name === name
    }, [employee?.labor.laborId, laborId, employee?.name, name])

    useEffect(() => {
        if (employee !== undefined) {
            setName(employee.name);
            setLaborId(employee.labor.laborId);
        }
    }, [employee]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        updateEmployee(employeeId, {laborId, name})
        .then(() => refreshEmployee());
    }

    function handleDeleteRow (employeeId: number) {
        if (window.confirm('¿Está seguro que quiere remover el empleado?')) {
        deleteEmployee(employeeId)
            .then(() => history.push('/employees'));
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle={`Empleado - #${employeeId}`}
                        route= {[
                            {
                                label: 'Empleados',
                                link:'/employees',
                            }
                    ]}>
                        En esta pantalla de pueden modificar los datos del empleado. Para poder generar el reporte de costos,
                        todo empleado debe tener al menos un valor salarial registrado.
                        <br /><br />
                        - Modificar el nombre del empleado y / o su mano de obra 
                        <ol>
                            <li>Hacer click en el campo que se desea modificar</li>
                            <li>Ingresar un nuevo valor</li>
                            <li>Hacer click en el botón <strong>Modificar</strong> para guardar los cambios</li>
                        </ol>
                        - Remover el empleado 
                        <ol>
                            <li>Hacer click en el botón <strong>Remover</strong> para eliminar el empleado</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                        - Registrar un nuevo valor salarial
                        <ol>
                            <li>Hacer click en el botón <strong>Registrar Salario</strong> localizado en la parte superior de la tabla de salarios</li>
                            <li>Completar el formulario.</li>
                        </ol>
                        - Eliminar un salario histórico
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> en la fila correspondiente al salario que se desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleSubmit}>
                        {
                            (employee !== undefined) &&
                            <>
                                <div>
                                    <label className='tooltip bottom'>
                                        Nombre
                                        <p>Nombre completo del empleado.</p>
                                    </label>
                                    <input value={name} onChange={e => setName(e.currentTarget.value)} />
                                </div>
                                <div>
                                    <label>Categoría</label>
                                    <select name='laborId' id='laborId' value={laborId} onChange={e => setLaborId(parseInt(e.currentTarget.value))} required>
                                        <SelectPlaceholder />
                                        {
                                            labors?.map((l) =>
                                                <option key={l.laborId} value={l.laborId}>{l.description}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <footer>
                                    <button disabled={buttonIsDisabled}>Modificar</button>
                                    <button type='button' className='button-delete' onClick={() => handleDeleteRow(employee.employeeId)}>Remover</button>
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
                                label: 'Salarios',
                                link: `/employee/${employeeId}/salaries`,
                                isActive: params.screen === 'salaries' || params.screen === undefined,
                            }
                        ]}
                    />
                </header>
                <section>
                    <Switch>
                        <Route exact path='/employee/:employeeId/salaries/register'>
                            <RegisterEmployeeSalariesView />
                        </Route>
                        <Route path='/employee/:employeeId'>
                            <EmployeeSalariesView />
                        </Route>
                    </Switch>
                </section>
            </div>
	    </div>
    )
}