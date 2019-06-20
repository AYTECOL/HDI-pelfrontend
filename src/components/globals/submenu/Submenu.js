import React from 'react';

const Submenu = (props) => {
    return (
        <aside className="cotizaciones-aside">
            <div className="container">
                <div className="row">
                    <div id="id-cotizacion" className="col col-12 col-sm-2 col-md-2 col-lg-2">
                        <p>{props.name} <span className="value">{props.number}</span></p>
                    </div>
                    <div id="cotizacion-menu" className="col col-12 col-sm-8 col-md-8 col-lg-8">
                        <ul>
                            {props.options.map((item, key)=>
                                <li key={key} className={props.step === (key+1) ? 'active' : ''}><span>{key+1}</span>{item}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    )
};

export default Submenu;