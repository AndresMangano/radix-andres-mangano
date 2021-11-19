import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../helpers/http.helpers";
import { deleteCostPool, DRIVER_MACHINE_HOURS, getCostPools } from "../../api/cost-pools";
import { Table } from "../../controls/Table";

export function CostPoolsView() {
    const history = useHistory();
    const [costPools, refreshCostPools] = useRefresh(() => getCostPools({}), []);

    function handleDeleteRow (costPoolId: number) {
        if (window.confirm('¿Está seguro que quiere remover el centro de costos?')) {
            deleteCostPool(costPoolId)
                .then(() => refreshCostPools());
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Centros de Costo'>
                        En esta pantalla se administran los centros de costo a los cuales serán asignados los gastos correspondientes a cada cuenta.
                        Estos corresponden a actividades de la empresa que generan un costo, algunos ejemplos pueden ser: <i>Estampado, Roscado, Empaquetado, Venta, etc.</i>
                        <br /><br />
                        - Crear un centro de costo
                        <ol>
                            <li>Hacer click en el botón <strong>Crear Centro de Costo</strong></li>
                            <li>Completar el formulario</li>
                        </ol>
                        - Eliminar un centro de costo
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> correspondiente al centro que se desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>    
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/cost-pools/create')}>Crear Centro de Costo</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'costPoolId',
                            Cell: ({row}) => 
                                <Link to={`/cost-pool/${row.original.costPoolId}`}>{row.original.costPoolId}</Link>,
                        },
                        {
                            Header: 'Descripción',
                            accessor: 'description'
                        },
                        {
                            Header: 'Factor',
                            accessor: 'costDriverKV.value'
                        },
                        {
                            Header: 'Sector',
                            accessor: 'machine.description',
                            Cell: ({row}) => (row.original.machine !== null)  
                                    ? <Link to={`/machine/${row.original.machine.machineId}`}>{row.original.machine.description}</Link>
                                    : (row.original.costDriverKV.key === DRIVER_MACHINE_HOURS)
                                        ?  'Todos'
                                        : ''    
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.costPoolId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={costPools === undefined ? [] : costPools}  
                    />
                </section>
            </div>
        </div>                       
    )
}