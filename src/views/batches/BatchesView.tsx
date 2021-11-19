import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { deleteBatch, getBatches } from "../../api/batches";
import { useRefresh } from "../../helpers/http.helpers";
import { Table } from "../../controls/Table";
import { useMemo } from "react";

export function BatchesView() {
    const history = useHistory();
    const [batches, refreshBatches] = useRefresh(() => getBatches(), []);
    const batchesData = useMemo(() => batches?.map(b => ({ ...b, date: `${moment(b.date).format('DD/MM/yyyy')}`}) ), [batches]);

    function handleDeleteRow (batchId: number) {
        if (window.confirm('¿Está seguro que quiere remover el lote de producción?')) {
            deleteBatch(batchId)
            .then(() => refreshBatches());
        }
    }
    
    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Lotes de Producción'>
                        En esta pantalla se cargan los lotes de producción que fabrique la planta.
                        - Registrar un lote de producción
                        <ol>
                            <li>Hacer click en el botón <strong>Registrar Lote</strong>.</li>
                            <li>Completar el formulario</li>
                        </ol>
                        - Eliminar un lote de producción
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> correspondiente al lote en la tabla.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                        <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/batches/register')}>Registrar Lote</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'batchId',
                        },
                        {
                            Header: 'Fecha',
                            accessor: 'date',
                        },
                        {
                            Header: 'Version Fab.',
                            accessor: 'materialMachine.materialMachineId',
                        },
                        {
                            Header: 'Sector',
                            accessor: 'materialMachine.machine.description',
                            Cell: ({row}) => 
                                <Link to={`/machine/${row.original.materialMachine.machine.machineId}`}>{row.original.materialMachine.machine.description}</Link>,
                        },
                        {
                            Header: 'Material',
                            accessor: 'materialMachine.material.description',
                            Cell: ({row}) => 
                                <Link to={`/material/${row.original.materialMachine.material.materialId}`}>{row.original.materialMachine.material.description}</Link>,
                        },
                        {
                            Header: 'Cantidad',
                            accessor: 'quantity' && 'unitOfMeasureKV.value', 
                            Cell: ({row}) => 
                                <>{row.original.quantity} {row.original.unitOfMeasureKV.value}</>
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.batchId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={batchesData === undefined ? [] : batchesData}  
                    />
                </section>
            </div>
        </div>
    )
}