import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../helpers/http.helpers";
import { deleteMaterial, getMaterials } from "../../api/materials";
import { Table } from "../../controls/Table";
import { useMemo } from "react";

export function MaterialsView() {
    const history = useHistory();
    const [materials, refreshMaterial] = useRefresh(() => getMaterials(), []);
    const materialsData = useMemo(() => materials?.map(m => ({ ...m, isTreatment: `${m.isTreatment ? 'Sí' : 'No'}`})), [materials]);

    
    function handleDeleteRow (materialId: number) {
        if (window.confirm('¿Está seguro que quiere desactivar el material?')) {
            deleteMaterial(materialId)
            .then(() => refreshMaterial());
        }
    }
    

    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Materiales'>
                        En esta sección se gestionan los distintos materiales de la planta,
                        tanto materias primas compradas a otros proveedores como productos de fabricación propia.
                        <br /><br />
                        - Registrar un material
                        <ol>
                            <li>Hacer click en el botón <strong>Registrar Material</strong>.</li>
                            <li>Completar el formulario.</li>
                        </ol>
                        - Modificar los datos de un material
                        <ol>
                            <li>Hacer click en la celda de la columna <strong>ID</strong> correspondiente al material que se desea modificar.</li>
                        </ol>
                        - Desactivar un material
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> correspondiente al material que se desea borrar.</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/materials/register')}>Registrar Material</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'materialId',
                            Cell: ({row}) => 
                                <Link to={`/material/${row.original.materialId}`}>{row.original.materialId}</Link>,
                        },
                        {
                            Header: 'Código',
                            accessor: 'code'
                        },
                        {
                            Header: 'Descripción',
                            accessor: 'description'
                        },
                        {
                            Header: 'Unidad de Medida',
                            accessor: 'unitOfMeasureKV.value'
                        },
                        {
                            Header: 'Aprovisionamiento',
                            accessor: 'defaultSupplyKV.value'
                        },
                        {
                            Header: 'Tratamiento',
                            accessor: 'isTreatment',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.materialId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={materialsData === undefined ? [] : materialsData}  
                    />
                </section>
            </div>
        </div>
    )
}


