import classNames from "classnames";
import { useHistory } from "react-router-dom"


export type TabsProps = {
    tabs?: {
        label: string;
        link: string;
        isActive: boolean;
    }[]
}

export function Tabs ({tabs}: TabsProps) {
    const history = useHistory();

    return (
        <div className='tabs'>
            {
                tabs?.map((t, index) => 
                    <button key={index} className={classNames('pills', {
                        'active': t.isActive
                    })} onClick={() => history.push(t.link)}>{t.label}</button>
            )}
        </div>
        
    )
}