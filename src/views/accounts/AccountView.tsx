import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { deleteAccount, getAccount, updateAccount } from '../../api/accounts';
import { Tabs } from '../../controls/Tabs';
import { ViewHeader } from '../../controls/ViewHeader';
import { useRefresh } from '../../helpers/http.helpers';
import { AccountDistributionView } from './distributions/AccountDistributionView';
import { RegisterAccountDistributionView } from './distributions/RegisterAccountDistributionView';

export function AccountView () {
    const history = useHistory();
    const params = useParams<{accountId: string; screen: string|undefined}>();
    const accountId = parseInt(params.accountId);
    const [account, refreshAccount] = useRefresh(() => getAccount(accountId), [accountId]);
    const [description, setDescription] = useState('');

    const buttonIsDisabled = useMemo(() => {
        return account?.description === description
    }, [account?.description, description])
    

    useEffect(() => {
        if (account !== undefined) {
            setDescription(account.description);
        }
    }, [account]);

    function handleDeleteRow (accountId: number) {
        if (window.confirm('¿Está seguro que quiere desactivar la cuenta?')) {
        deleteAccount(accountId)
            .then(() =>   {
                history.push('/accounts')
            });
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        updateAccount(accountId, {description})
            .then(() => refreshAccount());
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader 
                        subtitle={`Cuenta - #${accountId}`}
                        route={[
                        {
                            label: 'Cuentas',
                            link:'/accounts',
                        }
                    ]}>
                        En esta pantalla se pueden modificar los datos de una cuenta y su distribución en los distintos centros de costos.
                        Se debe tener en cuenta que la suma de todos los porcentajes asignados no puede ser mayor a 100%.
                        <br /><br />
                        - Modificar la descripción de la cuenta 
                        <ol>
                            <li>Hacer click en el campo que se desea modificar</li>
                            <li>Ingresar un nuevo valor</li>
                            <li>Hacer click en el botón <strong>Modificar</strong> para guardar los cambios</li>
                        </ol>
                        - Desactivar la cuenta 
                            <ol>
                                <li>Hacer click en el botón <strong>Desactivar</strong> para inhabilitar la cuenta</li>
                                <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                            </ol>
                        - Activar la cuenta 
                            <ol>
                                <li>Hacer click en el botón <strong>Activar</strong> para habilitar la cuenta</li>
                            </ol>
                        - Definir el porcentaje de gastos que debe ser asignado a un centro de costos determinado
                        <ol>
                            <li>Hacer click en el botón <strong>Definir Asignación</strong>.</li>
                            <li>Completar formulario</li>
                        </ol>
                        - Eliminar la asignación a un centro de costo
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> correspondiente al centro de costos que se desea desvincular.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <form onSubmit={handleSubmit}>
                        {
                            (account !== undefined) &&
                            <>
                                <div>
                                    <label>Descripción</label>
                                    <input value={description} onChange={e => setDescription(e.currentTarget.value)} />
                                </div>
                                <footer> 
                                    <button disabled={buttonIsDisabled}>Modificar</button>
                                    <button type='button' className='button-delete' onClick={() => handleDeleteRow(account.accountId)}>Remover</button>
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
                                label: 'Distribución',
                                link: `/account/${accountId}/distributions`,
                                isActive: params.screen === 'distributions' || params.screen === undefined,
                            }
                        ]}
                    />
                </header>
                <section>
                    <Switch>
                        <Route exact path='/account/:accountId/distributions/register'>
                            <RegisterAccountDistributionView />
                        </Route>
                        <Route path='/account/:accountId'>
                            <AccountDistributionView />
                        </Route>
                    </Switch>
                </section>
            </div>
        </div>
    )
}