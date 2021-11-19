import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { Fragment, ReactNode } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

export type ViewHeaderProps = {
    route?: {
        label: string;
        link: string;
    }[]
    subtitle: string;
    children?: ReactNode;
}

export function ViewHeader({route, subtitle, children}: ViewHeaderProps) {
    const [infoOpened, setInfoOpened] = useState(false);    

    return (
        <div className='view-header'>
            <div>
                <h3>
                { route?.map((r, index) => 
                    <Fragment key={index}>                            
                        { (route.length - index) > 1
                            ?   <>
                                    <Link to={r.link}> {r.label}</Link>
                                    <span>{"  >> "}</span>
                                </>
                            :   <>
                                    <Link to={r.link}> {r.label}</Link>
                                </>
                        }
                    </Fragment>
                )}
                </h3>
                <h2>
                    {subtitle} { children !== undefined &&
                        <button onClick={() => setInfoOpened(prev => !prev)}><FontAwesomeIcon icon={faInfoCircle} /></button>
                    }
                </h2>
                { infoOpened &&
                    <div>
                        {children}
                    </div>
                }
            </div>
        </div>
    )
}