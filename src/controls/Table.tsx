import { usePagination, useSortBy, useTable, useGlobalFilter } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type TableProps = {
    buttons?: React.ReactNode,
    columns: {
        Header: string;
        accessor: ((row: any) => JSX.Element | string) | string;
        Cell?: (row: any) => JSX.Element | string;
        disableSortBy?: boolean;
    }[],
    data: any[],
}



export function Table({buttons, columns, data}: TableProps) {

    const { getTableProps, 
            getTableBodyProps, 
            headerGroups, 
            page,
            nextPage,
            previousPage,
            canPreviousPage,
            canNextPage,
            pageOptions,
            state,
            setGlobalFilter,
            gotoPage,
            pageCount,
            prepareRow,
    } = useTable({columns, data}, useGlobalFilter, useSortBy, usePagination);

    return(
        <div className='card'> 
            <div>
                {buttons}
                <span style={{color: 'white'}}>
                    <input type='search' value={state.globalFilter} placeholder='Buscar...' onChange={e => setGlobalFilter(e.currentTarget.value)} />
                    {' '}   <FontAwesomeIcon icon={faSearch} />
                </span>
            </div>
                <table {... getTableProps()}>
                    <thead >
                        {
                            headerGroups.map((headerGroup) => (
                                <tr {... headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
                                            <span>
                                                { 
                                                    column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''
                                                }       
                                            </span>
                                            
                                        </th>
                                    ))}
                                </tr>
                        ))}
                    </thead>
                    <tbody {... getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>◀</button>
                <span style={{color: 'white'}}>
                        {' '} Página: {' '}
                    <strong>
                        <input type='number' max={pageOptions.length} value={state.pageIndex + 1} 
                        onChange={e => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(pageNumber)
                        }}
                        style={{width: '2.5em'}}/>
                        {' '} de {pageOptions.length} {' '}
                    </strong>
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>▶</button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
            </div>
        </div>
    )
}