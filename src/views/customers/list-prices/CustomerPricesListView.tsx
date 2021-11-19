import moment from "moment";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCustomerMaterialPrices } from "../../../api/costing";
import { useRefresh } from "../../../helpers/http.helpers";

const DEFAULT_CURRENCY: string = process.env.REACT_APP_DEFAULT_CURRENCY || '';

export function CustomerPricesListView() {
    const [start, setStart] = useState(moment(new Date()).add(-6, 'months').toDate());
    const [end, setEnd] = useState(new Date())
    const params = useParams<{customerId: string;}>();
    const customerId = parseInt(params.customerId);
    const [prices, refreshPrices] = useRefresh(() => getCustomerMaterialPrices(customerId, {start, end}), [customerId, start, end]);

    const handleInputChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStart(e.target.valueAsDate || new Date())
    }

    const handleInputChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnd(e.target.valueAsDate || new Date())
    }
    
    return (
        <div>
            <div>
                <section>
                    {
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <button onClick={() => refreshPrices()}>Refrescar</button>
                                    </th>
                                    <th colSpan={3}>
                                        <label className='tooltip bottom'>
                                            Desde
                                            <p>Fecha desde la cual se quieren tomar registros para el cálculo de costos.</p>
                                        </label>
                                        <input type='date' value={start?.toISOString().split('T')[0]} onChange={handleInputChangeStart} max={end?.toISOString().split('T')[0]} required/>
                                    </th>
                                    <th colSpan={4}>
                                        <label className='tooltip bottom'>
                                            Hasta
                                            <p>Fecha a la cual se quieren tomar los costos.</p>
                                        </label>
                                        <input type='date' value={end?.toISOString().split('T')[0]} onChange={handleInputChangeEnd} min={start?.toISOString().split('T')[0]} required/>
                                    </th>
                                    <th colSpan={3}>
                                        <button>Aprobar Lista de Precios</button>
                                    </th>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th>Pieza</th>
                                    <th>Descripción Interna</th>
                                    <th>Ranking Ventas</th>
                                    <th>Materia Prima</th>
                                    <th>Mano de Obra</th>
                                    <th>Trat. Term</th>
                                    <th>GG</th>
                                    <th>Otros</th>
                                    <th>Costo Total</th>
                                    <th>UM</th>
                                    <th>FM</th>
                                    <th>Precio Aprobado</th>
                                    <th>Nuevo Precio</th>
                                    <th>Aumento</th>
                                    <th>Renta %</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                prices?.map((m) =>
                                    <tr key={m.code}>
                                        <td>{m.code}</td>
                                        <td>
                                            <Link to={`/material/${m.material.id}`}>
                                                {m.material.description}
                                            </Link>
                                        </td>
                                        <td>{m.salesTarget}</td>
                                        <td>{m.rawMaterialCost.toLocaleString('en-US', { style: 'currency', currency: DEFAULT_CURRENCY, currencyDisplay: 'code' })}</td>
                                        <td>{m.laborCost.toLocaleString('en-US', { style: 'currency', currency: DEFAULT_CURRENCY, currencyDisplay: 'code' })}</td>
                                        <td>{m.treatmentsCost.toLocaleString('en-US', { style: 'currency', currency: DEFAULT_CURRENCY, currencyDisplay: 'code' })}</td>
                                        <td>{m.generalExpenses.toLocaleString('en-US', { style: 'currency', currency: DEFAULT_CURRENCY, currencyDisplay: 'code' })}</td>
                                        <td>{m.others.toLocaleString('en-US', { style: 'currency', currency: DEFAULT_CURRENCY, currencyDisplay: 'code' })}</td>
                                        <td>{m.totalCost.toLocaleString('en-US', { style: 'currency', currency: DEFAULT_CURRENCY, currencyDisplay: 'code' })}</td>
                                        <td>{m.unitOfMeasure.description}</td>
                                        <td>{Math.round(m.fm * 100) / 100}</td>
                                        <td>{m.lastApprovedPrice?.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code'})}</td>
                                        <td>{m.price.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code'})}</td>
                                        <td>{Math.round(m.increase * 10000) / 100}%</td>
                                        <td>{Math.round(m.profit * 10000) / 100}%</td>
                                    </tr> 
                            )}
                            </tbody>
                        </table>
                    }
                </section>
            </div>
        </div>
    );
}