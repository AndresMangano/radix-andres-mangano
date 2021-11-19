import moment from "moment";
import React, { useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useMaterialCosting } from "../../../api/costing";

const DEFAULT_CURRENCY: string = process.env.REACT_APP_DEFAULT_CURRENCY || '';

export function MaterialCostingView()
{
    const [start, setStart] = useState(moment(new Date()).add(-6, 'months').toDate());
    const [end, setEnd] = useState(new Date())
    const params = useParams<{ materialId: string;}>();
    const materialId = parseInt(params.materialId);
    const materialCosting = useMaterialCosting({materialId, start, end});

    const handleInputChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStart(e.target.valueAsDate || new Date())
    }

    const handleInputChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnd(e.target.valueAsDate || new Date())
    }
    
    const totalMPD = materialCosting?.directMaterialCosts.reduce((prev, curr) => prev + curr.cost, 0) || 0;
    const totalMOD = materialCosting?.directLaborCosts.reduce((prev, curr) => prev + curr.cost, 0) || 0;
    const totalCIF = (materialCosting?.indirectCosts.reduce((prev, curr) => prev + curr.cost, 0) || 0);
    const totalCost = totalMPD + totalMOD + totalCIF;

    return (
        <div>
            <div>
                <section>
                {
                materialCosting !== undefined &&
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan={5}>Costo Total del Material</th>
                                </tr>
                                <tr>
                                    <th>Cantidad</th>
                                    <th>MPD</th>
                                    <th>MOD</th>
                                    <th>CIF</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>por 1 {materialCosting.unitOfMeasure.description}</td>
                                    <td>{totalMPD.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code' })}</td>
                                    <td>{totalMOD.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code' })}</td>
                                    <td>{totalCIF.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code' })}</td>
                                    <td>
                                        <strong>{totalCost.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code' })}</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan={5}>Costo de Material Prima (MPD)</th>
                                </tr>
                                <tr>
                                    <th>Componente</th>
                                    <th>Actualización</th>
                                    <th>Utilización</th>
                                    <th>Precio Unitario</th>
                                    <th>Costo</th>
                                </tr>
                            </thead>
                            <tbody>
                                { materialCosting.directMaterialCosts.map(dmc =>
                                    <tr key={dmc.material?.id}>
                                        <td>
                                            <Link to={`/material/${dmc.material.id}`}>
                                                {dmc.material.description}
                                            </Link>
                                        </td>
                                        <td>{moment(dmc.price.validFrom).format('DD/MM/yyyy')}</td>
                                        <td>{dmc.quantity} {dmc.unitOfMeasure.description}</td>
                                        <td>{dmc.price.unitPrice.toLocaleString('en-US', { style: 'currency', currency: dmc.price.currency?.description, currencyDisplay: 'code' })}</td>
                                        <td>{dmc.cost.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code' })}</td>
                                    </tr>)
                                }
                                <tr>
                                    <td colSpan={4}>Total</td>
                                    <td>
                                        <strong>{totalMPD.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code' })}</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan={5}>Costo de Mano de Obra (MOD)</th>
                                </tr>
                                <tr>
                                    <th>Sector</th>
                                    <th>Categoría</th>
                                    <th>Utilización</th>
                                    <th>Valor Hora</th>
                                    <th>Costo</th>
                                </tr>
                            </thead>
                            <tbody>
                                { materialCosting.directLaborCosts.map(dlc =>
                                    <tr key={`${dlc.labor?.id}:${dlc.machine?.id}`}>
                                        <td>
                                            <Link to={`/machine/${dlc.machine.id}`}>
                                                {dlc.machine.description}
                                            </Link>
                                        </td>
                                        <td>{dlc.labor?.description}</td>
                                        <td>{(Math.round(dlc.hours * 100) / 100)} hs</td>
                                        <td>{dlc.hourlyRate.toLocaleString('en-US', { style: 'currency', currency: DEFAULT_CURRENCY, currencyDisplay: 'code' })}</td>
                                        <td>{dlc.cost.toLocaleString('en-US', { style: 'currency', currency: DEFAULT_CURRENCY, currencyDisplay: 'code' })}</td>
                                    </tr>)
                                }
                                <tr>
                                    <td colSpan={4}>Total</td>
                                    <td>
                                        <strong>{totalMOD.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code' })}</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan={7}>Costos Indirectos de Fabricación (CIF)</th>
                                </tr>
                                <tr>
                                    <th colSpan={3}>
                                        <label className='tooltip bottom'>
                                            Desde
                                            <p>Fecha desde la cual se quieren contemplar datos para el costeo.</p>
                                        </label>
                                        <input type='date' value={start?.toISOString().split('T')[0]} onChange={handleInputChangeStart} max={end?.toISOString().split('T')[0]} required/>
                                    </th>
                                    <th colSpan={4}>
                                        <label className='tooltip bottom'>
                                            Hasta
                                            <p>Fecha a la cual se quiere generar el costeo.</p>
                                        </label>
                                        <input type='date' value={end?.toISOString().split('T')[0]} onChange={handleInputChangeEnd} min={start?.toISOString().split('T')[0]} required/>
                                    </th>
                                </tr>
                                <tr>
                                    <th rowSpan={2}>Actividad</th>
                                    <th rowSpan={2}>Gatos Asignados</th>
                                    <th colSpan={4}>Asignación</th>
                                    <th rowSpan={2}>Costo Unitario</th>
                                </tr>
                                <tr>
                                    <th>Driver</th>
                                    <th>Unitaria</th>
                                    <th>Período</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                { materialCosting.indirectCosts.map(ic =>
                                    <tr key={ic.costPool.id}>
                                        <td>{ic.costPool.description}</td>
                                        <td>{ic.totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code'})}</td>
                                        <td>{ic.costDriver.description}</td>
                                        <th>{Math.round(ic.unitUsage * 100) / 100}</th>
                                        <td>{Math.round(ic.usage * 100) / 100}</td>
                                        <td>{Math.round(ic.totalUsage * 100) / 100}</td>
                                        <td>{ic.cost.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code'})}</td>
                                    </tr>)
                                }
                                <tr>
                                    <td colSpan={6}>Total</td>
                                    <td>
                                        <strong>{totalCIF.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code' })}</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
            }
                </section>
            </div>
        </div>
    );
}