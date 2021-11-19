import './App.css';
import { Sidebar } from './controls/Sidebar';
import { Route, Switch } from 'react-router-dom';
import { RegisterBatchView } from './views/batches/RegisterBatchView';
import { BatchesView } from './views/batches/BatchesView';
import { ExpensesView } from './views/expenses/ExpensesView';
import { MaterialsView } from './views/materials/MaterialsView';
import { MachinesView } from './views/machines/MachinesView';
import { LaborsView } from './views/labors/LaborsView';
import { EmployeesView } from './views/employees/EmployeesView';
import { UsersView } from './views/users/UsersView';
import { CustomersView } from './views/customers/CustomersView';
import { AccountsView } from './views/accounts/AccountsView';
import { CostPoolsView } from './views/cost-pools/CostPoolsView';
import { RegisterAccountView } from './views/accounts/RegisterAccountView';
import { CreateCostPoolView } from './views/cost-pools/CreateCostPoolView';
import { RegisterCustomersView } from './views/customers/RegisterCustomerView';
import { RegisterEmployeeView } from './views/employees/RegisterEmployeeView';
import { RegisterExpensesView } from './views/expenses/RegisterExpensesView';
import { RegisterLaborsView } from './views/labors/RegisterLaborView';
import { RegisterMachineView } from './views/machines/RegisterMachineView';
import { RegisterMaterialView } from './views/materials/RegisterMaterialView';
import { RegisterUsersView } from './views/users/RegisterUsersView';
import { LoginView } from './views/users/LoginView';
import { MaterialView } from './views/materials/MaterialView';
import { AccountView } from './views/accounts/AccountView';
import { EmployeeView } from './views/employees/EmployeeView';
import { MachineView } from './views/machines/MachineView';
import { CustomerView } from './views/customers/CustomerView';
import { HelpView } from './views/help/HelpView';
import { HelpControlsView } from './views/help/HelpControlsView';
import { HelpGettingStartedView } from './views/help/HelpGettingStarted';
import { HelpCostingView } from './views/help/HelpCostingView';
import { CostPoolView } from './views/cost-pools/CostPoolView';
import { LaborView } from './views/labors/LaborView';
import { useSystemVersion } from './api/status';
import { logOut, useLoggedInUser } from './api/users';



export function App() {
    const userEmail = useLoggedInUser();
    const version = useSystemVersion();

    return (
        <div className='app'>
            <nav className='navbar'>
                <a href='/'>radiX <span>{version}</span></a>
                <ul>
                    { userEmail &&
                        <li>
                            <span>{userEmail}<small style={{fontSize: '0.7em'}}> ▼ </small></span>
                            <ul>
                                <li>
                                    <button onClick={logOut}>Cerrar Sesión</button>
                                </li>
                            </ul>
                        </li>
                    }
                </ul>
            </nav>
            <div className='main'>
            {
                userEmail !== null &&
                <Sidebar folders={[
                    {
                        label: "Transacciones",
                        items: [
                            { label: 'Lotes de producción', path: '/batches'},
                            { label: 'Gastos', path: '/expenses' }
                        ]
                    },
                    {
                        label: 'Datos Maestros',
                        items: [
                            { label: 'Materiales', path: '/materials' },
                            { label: 'Sectores', path: '/machines' },
                            { label: 'Mano de Obra', path: '/labors' },
                            { label: 'Empleados', path: '/employees' },
                            { label: 'Centros de Costo', path: '/cost-pools' },
                            { label: 'Cuentas', path: '/accounts' },
                            { label: 'Clientes', path: '/customers'}
                        ]
                    },
                    {
                        label: 'Administración',
                        items: [
                            { label: 'Usuarios' , path: '/users'},
                        ]
                    },
                    {
                        label: "Ayuda",
                        items: [
                            { label: 'Controles básicos', path: '/help/controls' },
                            { label: 'Puesta a punto', path: '/help/getting-started' },
                            { label: 'Cálculo de costos', path: '/help/costing' }
                        ]
                    }
                ]} />
            }
                <div className='main-panel'>
                { (userEmail) === null 
                    ? <LoginView/>
                    : <Switch>
                        <Route path='/batches' exact component={BatchesView}/>
                        <Route path='/batches/register' component={RegisterBatchView}/>

                        <Route path='/expenses' exact component={ExpensesView}/>
                        <Route path='/expenses/register' component={RegisterExpensesView}/>
                        
                        <Route path='/materials' exact component={MaterialsView}/>
                        <Route path='/materials/register' component={RegisterMaterialView}/>
                        <Route path='/material/:materialId/:screen?'>
                            <MaterialView />
                        </Route>

                        <Route path='/machines' exact component={MachinesView}/>
                        <Route path='/machines/register' component={RegisterMachineView}/>
                        <Route path='/machine/:machineId/:screen?'>
                            <MachineView />
                        </Route>

                        <Route path='/labors' exact component={LaborsView}/>
                        <Route path='/labors/register' component={RegisterLaborsView}/>
                        <Route path='/labor/:laborId/:screen?'>
                            <LaborView />
                        </Route>
                        
                        <Route path='/employees' exact component={EmployeesView}/>
                        <Route path='/employees/register' component={RegisterEmployeeView}/>
                        <Route path='/employee/:employeeId/:screen?'>
                            <EmployeeView />
                        </Route>
        
                        <Route path='/accounts' exact component={AccountsView}/>
                        <Route path='/accounts/register' component={RegisterAccountView}/>
                        <Route path='/account/:accountId/:screen?'>
                            <AccountView />
                        </Route>

                        <Route path='/customers' exact component={CustomersView}/>
                        <Route path='/customers/register' component={RegisterCustomersView}/>
                        <Route path='/customer/:customerId/:screen?'>
                            <CustomerView />
                        </Route>

                        <Route path='/cost-pools' exact component={CostPoolsView}/>
                        <Route path='/cost-pools/create' component={CreateCostPoolView}/>
                        <Route path='/cost-pool/:costPoolId/:screen?'>
                            <CostPoolView />
                        </Route>

                        <Route path='/users' exact component={UsersView}/>
                        <Route path='/users/register' component={RegisterUsersView}/>

                        <Route path='/help/controls'>
                            <HelpControlsView />
                        </Route>
                        <Route path='/help/getting-started'>
                            <HelpGettingStartedView />
                        </Route>
                        <Route path='/help/costing'>
                            <HelpCostingView />
                        </Route>
                        <Route path='/'>
                            <HelpView />
                        </Route>
                    </Switch>
                }
                </div>
            </div>
        </div>
    );
}