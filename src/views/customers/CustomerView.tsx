import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { deleteCustomer, getCustomer, updateCustomer } from '../../api/customers';
import { Tabs } from '../../controls/Tabs';
import { ViewHeader } from '../../controls/ViewHeader';
import { useRefresh } from '../../helpers/http.helpers';
import { CustomerPricesListView } from './list-prices/CustomerPricesListView';
import { CustomerPriceView } from './prices/customer-price/CustomerPriceView';
import { CustomerPricesView } from './prices/CustomerPricesView';
import { RegisterCostumerPricesView } from './prices/RegisterCostumerPricesView';

export function CustomerView () {
    const history = useHistory();
    const params = useParams<{customerId: string; screen: string|undefined}>();
    const customerId = parseInt(params.customerId);
    const [customer, refreshCustomer] = useRefresh(() => getCustomer(customerId), [customerId]);
    const [name, setName] = useState('');

    const buttonIsDisabled = useMemo(() => {
        return customer?.name === name 
    }, [customer?.name, name])

    useEffect(() => {
        if (customer !== undefined) {
            setName(customer.name);
        }
    }, [customer]);
    
    function handleDeleteRow (customerId: number) {
        if (window.confirm('¿Está seguro que quiere remover el cliente?')) {
        deleteCustomer(customerId)
            .then(() => {
                history.push('/customers')
            });
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        updateCustomer(customerId, {name})
            .then(() => refreshCustomer());
    }

    return(
        <>
            <div>
                <div>
                    <header>
                        <ViewHeader
                            subtitle={`Cliente - #${customerId}`}
                            route= {[
                            {
                                label: 'Clientes',
                                link:'/customers',
                            }
                        ]}>
                            En esta pantalla se gestionan los datos del cliente y su lista de precios.
                            <br /><br />
                            - Modificar el nombre del cliente 
                            <ol>
                                <li>Hacer click en el campo que sea desea modificar</li>
                                <li>Ingresar un nuevo valor</li>
                                <li>Hacer click en el botón <strong>Modificar</strong> para guardar los cambios</li>
                            </ol>
                            - Remover el cliente 
                            <ol>
                                <li>Hacer click en el botón <strong>Remover</strong> para eliminar el cliente</li>
                                <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                            </ol>
                            - Registrar un nuevo producto
                            <ol>
                                <li>Hacer click en la solapa <strong>Productos</strong>.</li>
                                <li>Hacer click en el botón <strong>Agregar Producto</strong>.</li>
                                <li>Completar el formulario.</li>
                            </ol>
                            - Eliminar un producto de la lista de precios. Tener en cuenta que esta acción elimina todos los precios históricos del material.
                            <ol>
                                <li>Hacer click en la solapa <strong>Productos</strong>.</li>
                                <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> correspondiente al producto que se desea borrar.</li>
                            </ol>
                            - Generar la apertura de costos destinada al cliente
                            <ol>
                                <li>Hacer click en la solapa <strong>Apertura de Costos</strong>.</li>
                                <li>Seleccionar la fecha <strong>Desde</strong>, la cual se utilizara para considerar gastos y lotes de producción desde dicha fecha.</li>
                                <li>Seleccionar la fecha <strong>Hasta</strong>, la cual servirá para tomar salarios y precio de materias primas.</li>
                                <li>Una vez aprobada la lista de precios por el cliente, hacer click en el botón <strong>Aprobar Lista de Precios</strong> para fijarla.</li>
                            </ol>
                        </ViewHeader>
                    </header>
                    <section>
                        <form onSubmit={handleSubmit}>
                            {
                                (customer !== undefined) &&
                                    <>
                                        <div>
                                            <label>Nombre</label>
                                            <input value={name} onChange={e => setName(e.currentTarget.value)} />
                                        </div>
                                        <footer>
                                            <button disabled={buttonIsDisabled}>Modificar</button>
                                            <button type='button' className='button-delete' onClick={() => handleDeleteRow(customer.customerId)}>Remover</button>
                                        </footer>
                                    </>
                            }
                        </form>
                    </section>
                </div>
            </div>
            <div>
                <div>
                    <header>
                        <Tabs 
                            tabs= {[
                                {
                                    label: 'Productos',
                                    link: `/customer/${customerId}/prices`,
                                    isActive: params.screen === 'prices' || params.screen === undefined,
                                },
                                {
                                    label: 'Apertura de Costos',
                                    link: `/customer/${customerId}/list`,
                                    isActive: params.screen === 'list',
                                }
                            ]}
                        />
                    </header>
                    <section>
                        <Switch>
                            <Route exact path='/customer/:customerId/list'>
                                <CustomerPricesListView />
                            </Route>
                            <Route exact path='/customer/:customerId/prices/register'>
                                <RegisterCostumerPricesView />
                            </Route>
                            <Route exact path='/customer/:customerId/prices/:customerPriceId'>
                                <CustomerPriceView />
                            </Route>
                            <Route path='/customer/:customerId'>
                                <CustomerPricesView />
                            </Route>
                        </Switch>
                    </section>
                </div>
            </div>
        </>
    )
}