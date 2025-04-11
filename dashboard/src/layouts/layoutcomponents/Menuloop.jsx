import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

export const Menuloop = ({ MENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${MENUITEMS?.selected ? "active" : "active"}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, MENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && MENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{MENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${MENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{MENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${MENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{MENUITEMS.title}</span>

                {MENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={MENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{MENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${MENUITEMS.active ? "double-menu-active" : ""} 
                          ${MENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={MENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{MENUITEMS.title}</Link> </li> : ""}

                {MENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop MENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export const SuperAdminMenuloop = ({ SUPERADMINMENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${SUPERADMINMENUITEMS?.selected ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, SUPERADMINMENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && SUPERADMINMENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{SUPERADMINMENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${SUPERADMINMENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{SUPERADMINMENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${SUPERADMINMENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{SUPERADMINMENUITEMS.title}</span>

                {SUPERADMINMENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={SUPERADMINMENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{SUPERADMINMENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${SUPERADMINMENUITEMS.active ? "double-menu-active" : ""} 
                          ${SUPERADMINMENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={SUPERADMINMENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{SUPERADMINMENUITEMS.title}</Link> </li> : ""}

                {SUPERADMINMENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop SUPERADMINMENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export const AdminMenuloop = ({ ADMINMENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${ADMINMENUITEMS?.selected ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, ADMINMENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && ADMINMENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{ADMINMENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${ADMINMENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{ADMINMENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${ADMINMENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{ADMINMENUITEMS.title}</span>

                {ADMINMENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={ADMINMENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{ADMINMENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${ADMINMENUITEMS.active ? "double-menu-active" : ""} 
                          ${ADMINMENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={ADMINMENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{ADMINMENUITEMS.title}</Link> </li> : ""}

                {ADMINMENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop ADMINMENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export const PropertyMangerMenuloop = ({ PROPERTYMANAGERMENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${PROPERTYMANAGERMENUITEMS?.selected ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, PROPERTYMANAGERMENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && PROPERTYMANAGERMENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{PROPERTYMANAGERMENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${PROPERTYMANAGERMENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{PROPERTYMANAGERMENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${PROPERTYMANAGERMENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{PROPERTYMANAGERMENUITEMS.title}</span>

                {PROPERTYMANAGERMENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={PROPERTYMANAGERMENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{PROPERTYMANAGERMENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${PROPERTYMANAGERMENUITEMS.active ? "double-menu-active" : ""} 
                          ${PROPERTYMANAGERMENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={PROPERTYMANAGERMENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{PROPERTYMANAGERMENUITEMS.title}</Link> </li> : ""}

                {PROPERTYMANAGERMENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop PROPERTYMANAGERMENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export const EditorMenuloop = ({ EDITORMENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${EDITORMENUITEMS?.selected ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, EDITORMENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && EDITORMENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{EDITORMENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${EDITORMENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{EDITORMENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${EDITORMENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{EDITORMENUITEMS.title}</span>

                {EDITORMENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={EDITORMENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{EDITORMENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${EDITORMENUITEMS.active ? "double-menu-active" : ""} 
                          ${EDITORMENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={EDITORMENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{EDITORMENUITEMS.title}</Link> </li> : ""}

                {EDITORMENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop EDITORMENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export const CounselorMenuloop = ({ COUNSELORMENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${COUNSELORMENUITEMS?.selected ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, COUNSELORMENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && COUNSELORMENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{COUNSELORMENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${COUNSELORMENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{COUNSELORMENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${COUNSELORMENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{COUNSELORMENUITEMS.title}</span>

                {COUNSELORMENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={COUNSELORMENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{COUNSELORMENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${COUNSELORMENUITEMS.active ? "double-menu-active" : ""} 
                          ${COUNSELORMENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={COUNSELORMENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{COUNSELORMENUITEMS.title}</Link> </li> : ""}

                {COUNSELORMENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop COUNSELORMENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export const CyberPartnerMenuloop = ({ CYBERPARTNERMENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${CYBERPARTNERMENUITEMS?.selected ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, CYBERPARTNERMENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && CYBERPARTNERMENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{CYBERPARTNERMENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${CYBERPARTNERMENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{CYBERPARTNERMENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${CYBERPARTNERMENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{CYBERPARTNERMENUITEMS.title}</span>

                {CYBERPARTNERMENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={CYBERPARTNERMENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{CYBERPARTNERMENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${CYBERPARTNERMENUITEMS.active ? "double-menu-active" : ""} 
                          ${CYBERPARTNERMENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={CYBERPARTNERMENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{CYBERPARTNERMENUITEMS.title}</Link> </li> : ""}

                {CYBERPARTNERMENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop CYBERPARTNERMENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export const AgentMenuloop = ({ AGENTMENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${AGENTMENUITEMS?.selected ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, AGENTMENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && AGENTMENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{AGENTMENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${AGENTMENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{AGENTMENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${AGENTMENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{AGENTMENUITEMS.title}</span>

                {AGENTMENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={AGENTMENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{AGENTMENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${AGENTMENUITEMS.active ? "double-menu-active" : ""} 
                          ${AGENTMENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={AGENTMENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{AGENTMENUITEMS.title}</Link> </li> : ""}

                {AGENTMENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop AGENTMENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export const StudentMenuloop = ({ STUDENTMENUITEMS, toggleSidemenu, level }) => {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <Fragment>
            <Link to="#!" className={`side-menu__item ${STUDENTMENUITEMS?.selected ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSidemenu(event, STUDENTMENUITEMS); }}>


                {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

                {((level <= 1) && STUDENTMENUITEMS.icon) && (
                    (localStorage.zanexverticalstyles === 'doublemenu') && (localStorage.zanexlayout !== 'horizontal') ? (
                        <div className="custom-tooltip">
                            <OverlayTrigger placement={localStorage.zanexrtl ? 'left' : 'right'} overlay={<Tooltip>{STUDENTMENUITEMS.title}</Tooltip>}>
                                <i className={`fe ${STUDENTMENUITEMS.icon} side-menu__icon`}></i>
                            </OverlayTrigger>
                            <Badge bg='success' className="side-badge fs-11">{STUDENTMENUITEMS.badgetxt}</Badge>
                        </div>
                    ) : (
                        <i className={`fe ${STUDENTMENUITEMS.icon} side-menu__icon`}></i>
                    )
                )}


                <span className={`${level === 1 ? "side-menu__label" : ""}`}>{STUDENTMENUITEMS.title}</span>

                {STUDENTMENUITEMS.badgetxt ? (
                    <Fragment>
                        <Badge bg={STUDENTMENUITEMS.title == 'Tables' ? 'secondary' : 'success'} className="side-badge fs-11">{STUDENTMENUITEMS.badgetxt}</Badge>
                        <i className="fe fe-chevron-right side-menu__angle hor-rightangle"></i>
                    </Fragment>
                ) : (<i className="fe fe-chevron-right side-menu__angle"></i>)}


            </Link>

            <ul className={`slide-menu child${level}  
                          ${STUDENTMENUITEMS.active ? "double-menu-active" : ""} 
                          ${STUDENTMENUITEMS?.dirchange ? "force-left" : ""}  `}
                style={STUDENTMENUITEMS.active ? { display: "block" } : { display: "none" }}>

                {level <= 1 ? <li className='slide side-menu__label1'> <Link to="#!">{STUDENTMENUITEMS.title}</Link> </li> : ""}

                {STUDENTMENUITEMS.children?.map((firstlevel) => (
                    <li className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${firstlevel?.type === "empty" ? "slide" : ""} 
                                            ${firstlevel?.type === "link" ? "slide" : ""} 
                                            ${firstlevel?.type === "sub" ? "slide has-sub" : ""} 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${firstlevel?.selected ? "active" : ""}`}
                        key={Math.random()}>

                        {/* if it is a single link like Dashboard or Widgets or landingpage */}

                        {firstlevel.type === "link" ? (
                            <Link to={firstlevel.path || "#!"} className={`side-menu__item ${firstlevel.selected ? "active" : ""}`}>
                                {firstlevel.icon} <span className="">{firstlevel.title}</span>
                            </Link>
                        ) : ""}

                        {/* if empty type  */}

                        {firstlevel.type === "empty" ? (
                            <Link to="#!" className='side-menu__item' onClick={handleClick}>
                                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
                            </Link>
                        ) : ""}

                        {/* //for sub level refer the Menuloop.jsx component */}


                        {firstlevel.type === "sub" ? (
                            <Menuloop STUDENTMENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                        ) : ""}

                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

// export { Menuloop, SuperAdminMenuloop, AdminMenuloop, PropertyMangerMenuloop, EditorMenuloop, CounselorMenuloop, CyberPartnerMenuloop, AgentMenuloop, StudentMenuloop };