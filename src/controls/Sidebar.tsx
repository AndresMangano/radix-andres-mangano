import classNames from "classnames";
import { Fragment, useMemo, useState } from "react";
import { useHistory, useLocation } from 'react-router-dom';

export type SidebarProps = {
    folders: {
        label: string;
        items: {
            label: string;
            path: string;
        }[]
    }[]
}
export function Sidebar({folders}: SidebarProps) {
    const location = useLocation();
    const history = useHistory();
    const initialMenu = useMemo(() => {
        return folders
            .findIndex(f =>f.items
                .find(i => location.pathname.startsWith(i.path)) !== undefined);
    }, [location, folders]);
    const [openedMenu, setOpenedMenu] = useState<number>(initialMenu);

    return (
        <ul className='sidebar'>
        {
            folders.map((f, fIndex) =>
                <Fragment key={f.label}>
                    <li className={classNames({ active: openedMenu === fIndex })} onClick={() => setOpenedMenu(fIndex)}>
                        {f.label}
                    </li>
                    <li className={classNames('sub-list', { open: openedMenu === fIndex })}>
                        <ul>
                        {
                            f.items.map(i =>
                                <li key={i.label} className={classNames({
                                    active: location.pathname.startsWith(i.path)
                                })} onClick={() => history.push(i.path)}>
                                    {i.label}
                                </li>
                            )
                        }
                        </ul>
                    </li>
                </Fragment>
            )
        }
        </ul>
    );
}