import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteMaterialPrice, getMaterialPrices } from "../../../api/material-prices";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";


export function MaterialPricesView() {
    const history = useHistory();
    const params = useParams<{materialId: string;}>();
    const materialId = parseInt(params.materialId);
    const [prices, refreshPrices] = useRefresh(() => getMaterialPrices({materialId}), [materialId]);
    const pricesData = useMemo(() => prices?.map(p => ({ ...p, validFrom: `${moment(p.validFrom).format('DD/MM/yyyy')}`,
                                                               base: `${p.base + ' ' + p.unitOfMeasureKV.value}`,
                                                               price: `${p.price + ' ' + p.currencyKV.value}`,
                                                        }) ), [prices]);

    function handleDeleteRow (materialPriceId: number) {
        if (window.confirm('¿Está seguro que quiere remover el precio del material?')) {
            deleteMaterialPrice(materialPriceId)
            .then(() => refreshPrices());
        }
    }
    
    return(
        <div>
            <div>
            <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push(`/material/${materialId}/prices/register`)}>Registrar Precio</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'materialPriceId',
                        },
                        {
                            Header: 'Válido Desde',
                            accessor: 'validFrom',
                        },
                        {
                            Header: 'Base',
                            accessor: 'base',
                        },
                        {
                            Header: 'Precio',
                            accessor: 'price',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.materialPriceId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={pricesData === undefined ? [] : pricesData}  
                    />
                </section>
            </div>
        </div>
    )
}

/* <tr key={m.materialPriceId} className={classNames({ 'highlighted': i === 0})}> */