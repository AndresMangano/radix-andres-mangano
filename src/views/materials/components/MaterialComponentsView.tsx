import { Link, useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteMaterialComponent, getMaterialComponents } from "../../../api/material-components";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function MaterialComponentsView() {
    const history = useHistory();
    const params = useParams<{
        materialId: string;
    }>();
    const materialId = parseInt(params.materialId);
    const [components, refreshComponents] = useRefresh(() => getMaterialComponents({materialId}), [materialId]);
    const componentsData = useMemo(() => components?.map(c => ({ ...c, quantity: `${c.quantity + ' ' + c.unitOfMeasureKV.value}` })), [components]);

    function handleDeleteRow(materialComponentId: number) {
        if (window.confirm('¿Está seguro que quiere remover el componente del material aquí y en la tabla asociada?')) {
            deleteMaterialComponent(materialComponentId)
            .then(() => refreshComponents());
        }
    }

    return (
        <div>
            <div>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push(`/material/${materialId}/components/register`)}>Registrar Componente</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'Material',
                            accessor: 'component.description',
                            Cell: ({row}) => 
                                <Link to={`/material/${row.original.component.materialId}`}>{row.original.component.description}</Link>,
                        },
                        {
                            Header: 'Cantidad',
                            accessor: 'quantity',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                <button className='danger' onClick={() => handleDeleteRow(row.original.materialComponentId)}>
                                    <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                </button>,
                        }
                    ]}
                        data={componentsData === undefined ? [] : componentsData}  
                    />
                </section>
            </div>
        </div>
    );
}