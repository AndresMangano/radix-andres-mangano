import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../helpers/http.helpers";
import { deleteUser, getUsers } from "../../api/users";
import { Table } from "../../controls/Table";

export function UsersView() {
    const history = useHistory();
    const [users, refreshUsers] = useRefresh(() => getUsers(), []);
    const usersData = useMemo(() => users?.map(u => ({ ...u, isAdmin: `${u.isAdmin ? 'Admin' : 'Usuario'}`})), [users]);


    function handleDeleteRow (userId: number) {
        if (window.confirm('¿Está seguro que quiere remover el usuario?')) {
            deleteUser(userId)
            .then(() => refreshUsers());
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Usuarios'>
                        
                    </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/users/Register')}>Registrar</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'userId',
                        },
                        {
                            Header: 'Email',
                            accessor: 'email'
                        },
                        {
                            Header: 'Privilegios',
                            accessor: 'isAdmin',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.userId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={usersData === undefined ? [] : usersData}  
                    />
                </section>
            </div>
        </div>
    )
}