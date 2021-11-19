import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { Tabs } from '../../controls/Tabs';
import { ViewHeader } from '../../controls/ViewHeader';
import { MaterialComponentsView } from './components/MaterialComponentsView';
import { RegisterMaterialComponentsView } from './components/RegisterMaterialComponentsView';
import { MaterialMachinesView } from './machines/MaterialMachinesView';
import { RegisterMaterialMachinesView } from './machines/RegisterMaterialMachinesView';
import { MaterialCostingView } from './costing/MaterialCostingView';
import { MaterialPricesView } from './prices/MaterialPricesView';
import { RegisterMaterialPricesView } from './prices/RegisterMaterialPricesView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { SelectPlaceholder } from '../../controls/SelectPlaceholder';
import { useMaterialSupplies } from '../../api/static';
import { useRefresh } from '../../helpers/http.helpers';
import { deleteMaterial, getMaterial, updateMaterial } from '../../api/materials';
import { MaterialUsageView } from './usage/MaterialUsageView';
import { MaterialMachineView } from './machines/material-machine/MaterialMachineView';

export function MaterialView () {
    const history = useHistory();
    const params = useParams<{materialId: string; screen: string|undefined}>();
    const materialId = parseInt(params.materialId);
    const [material, refreshMaterial] = useRefresh(() => getMaterial(materialId), [materialId]);
    const materialSupplies = useMaterialSupplies();
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [defaultSupply, setDefaultSupply] = useState(0);
    const [isTreatment, setIsTreatment] = useState('false');

    const buttonIsDisabled = useMemo(() => {
        return material?.code === code && material?.description === description  &&
                material.defaultSupplyKV.key === defaultSupply && material.isTreatment.toString() === isTreatment
                
    }, [material?.code, code, material?.description, description, material?.defaultSupplyKV.key, defaultSupply, material?.isTreatment, isTreatment ])

    useEffect(() => {
        if (material !== undefined) {
            setCode(material.code);
            setDescription(material.description);
            setDefaultSupply(material.defaultSupplyKV.key);
            setIsTreatment(material.isTreatment ? 'true' : 'false');
        }
    }, [material]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        updateMaterial(materialId, {code, description, defaultSupply, isTreatment: isTreatment === 'true'})
            .then(() => refreshMaterial());
    }

    function handleDeleteRow (materialId: number) {
        if (window.confirm('¿Está seguro que quiere desactivar el material?')) {
            deleteMaterial(materialId)
            .then(() => {
                history.push('/materials')
            });
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader
                        subtitle={`Material - #${materialId}`}
                        route= {[
                        {
                            label: 'Materiales',
                            link:'/materials',
                        }
                    ]}>
                        En esta pantalla se definen varios aspectos del material.
                        <br /><br />
                        - Modificar la descripción, el aprovisionamiento y / o el tratamiento del material 
                            <ol>
                                <li>Hacer click en el campo que sea desea modificar</li>
                                <li>Ingresar un nuevo valor</li>
                                <li>Hacer click en el botón <strong>Modificar</strong> para guardar los cambios</li>
                            </ol>
                        - Desactivar el material 
                            <ol>
                                <li>Hacer click en el botón <strong>Desactivar</strong> para inhabilitar el material</li>
                                <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                            </ol>
                        - Activar el material 
                            <ol>
                                <li>Hacer click en el botón <strong>Activar</strong> para habilitar el material</li>
                            </ol>
                        En el caso de los materiales que se fabrican internamente <i>(Aprovisionamiento Interno)</i> se deben definir los siguientes aspectos:
                        <ol>
                            <li>
                                <strong>Componentes:</strong> materiales y cantidades que se necesitan para fabricar la pieza que estamos configurando.
                                Aquí se deben definir tanto materias primas como tratamientos.
                                <br />
                                - Registrar un componente
                                <ol>
                                    <li>Hacer click en la pestaña <strong>Componentes</strong></li>
                                    <li>Hacer click en el botón <strong>Registrar Componente</strong>.</li>
                                    <li>Completar el formulario.</li>
                                </ol>
                                - Eliminar un componente
                                <ol>
                                    <li>Hacer click en la pestaña <strong>Componentes</strong></li>
                                    <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> en la tabla de componentes.</li>
                                    <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                                </ol>
                            </li>
                            <br />
                            <li>
                                <strong>Procesos:</strong> etapas de transformación del material. 
                                Aquí se debe especificar cada una de las etapas por las que pasa el material en el proceso productivo.
                                <br />
                                - Registrar un proceso de fabricación
                                <ol>
                                    <li>Hacer click en la pestaña <strong>Procesos</strong></li>
                                    <li>Hacer click en el botón <strong>Registrar Proceso</strong>.</li>
                                    <li>Completar el formulario.</li>
                                </ol>
                                - Eliminar un proceso de fabricación
                                <ol>
                                    <li>Hacer click en la pestaña <strong>Procesos</strong></li>
                                    <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> en la tabla de procesos.</li>
                                    <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                                </ol>
                            </li>
                        </ol>
                        Para los materiales que son comprados a proveedores externos <i>(Aprovisionamiento Externo)</i> se debe definir el siguiente aspecto:
                        <ol>
                            <li>
                                <strong>Precios:</strong> historial de precios del material.
                                <br />
                                - Registrar un componente
                                <ol>
                                    <li>Hacer click en la pestaña <strong>Componentes</strong></li>
                                    <li>Hacer click en el botón <strong>Registrar Componente</strong>.</li>
                                    <li>Completar el formulario.</li>
                                </ol>
                                - Eliminar un componente
                                <ol>
                                    <li>Hacer click en la pestaña <strong>Componentes</strong></li>
                                    <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> en la tabla de componentes.</li>
                                    <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                                </ol>
                            </li>
                        </ol>
                        - Pestaña de Utilización
                        <ol>
                            <li>En esta pestaña podrá ver la composición de un material.</li>
                        </ol>
                        - Eliminar un Material 
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> del material que desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                        Para generar un reporte de costos del material para análisis interno se deben seguir los siguientes pasos:
                        <ol>
                            <li>Hacer click en la pestaña <strong>Costos</strong>.</li>
                            <li>Indicar la fecha <strong>Desde</strong>, la cual se utiliza para traer lotes de producción y gastos al cálculo de costos.</li>
                            <li>Indicar la fecha <strong>Hasta</strong>, la cual se utilizara para tomar precios de materias primas y salarios.</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleSubmit}>
                    {
                        (material !== undefined) &&
                        <>
                            <div>
                                <label>Código Interno</label>
                                <input value={code} onChange={e => setCode(e.currentTarget.value)} /> 
                            </div>
                            <div>
                                <label>Descripción</label>
                                <input value={description} onChange={e => setDescription(e.currentTarget.value)} /> 
                            </div>
                            <div>
                                <label>Unidad de Medida</label>
                                <span>{material.unitOfMeasureKV.value}</span>
                            </div>
                            <div>
                                <label>Aprovisionamiento</label>
                                <select name='defaultSupply' id="defaultSupply" value={defaultSupply} onChange={e => setDefaultSupply(parseInt(e.currentTarget.value, 10))} required>
                                <SelectPlaceholder />
                                {
                                    materialSupplies?.map((q) => 
                                        <option key={q.key} value={q.key}>{q.value}</option>
                                    )
                                }
                            </select>
                            </div>
                            <div>
                                <label>Tratamiento</label>
                                <select name='isTreatment' value={isTreatment} onChange={e => setIsTreatment(e.currentTarget.value)} required>
                                    <option value='false'>No</option>
                                    <option value='true'>Si</option>
                            </select>
                            </div>
                            <footer>
                                <button disabled={buttonIsDisabled}>Modificar</button>
                                <button type='button' className='button-delete' onClick={() => handleDeleteRow(material.materialId)}>Desactivar</button>    
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
                                label: 'Componentes',
                                link: `/material/${materialId}/components`,
                                isActive: params.screen === 'components' || params.screen === undefined,
                            },
                            {
                                label: 'Sectores',
                                link: `/material/${materialId}/machines`,
                                isActive: params.screen === 'machines',
                            },
                            {
                                label: 'Precios',
                                link: `/material/${materialId}/prices`,
                                isActive: params.screen === 'prices',
                            },
                            {
                                label: 'Utilización',
                                link: `/material/${materialId}/usage`,
                                isActive: params.screen === 'usage',
                            },
                            {
                                label: 'Costos',
                                link: `/material/${materialId}/costing`,
                                isActive: params.screen === 'costing'
                            }
                        ]}
                    />
                </header>
                <section>
                    <Switch>
                        <Route exact path='/material/:materialId/prices/register'>
                            <RegisterMaterialPricesView />
                        </Route>
                        <Route exact path='/material/:materialId/components/register'>
                            <RegisterMaterialComponentsView />
                        </Route>

                        <Route exact path='/material/:materialId/machines/register'>
                            <RegisterMaterialMachinesView />
                        </Route>
                        <Route exact path='/material/:materialId/machines/:materialMachineId'>
                            <MaterialMachineView />
                        </Route>
                        <Route exact path='/material/:materialId/machines'>
                            <MaterialMachinesView />
                        </Route>
                        <Route exact path='/material/:materialId/prices'>
                            <MaterialPricesView />
                        </Route>
                        <Route exact path='/material/:materialId/usage'>
                            <MaterialUsageView />
                        </Route>
                        <Route exact path='/material/:materialId/costing'>
                            <MaterialCostingView />
                        </Route>
                        <Route path='/material/:materialId'>
                            <MaterialComponentsView />
                        </Route>
                    </Switch>
                </section>
            </div>
        </div>
    )
}