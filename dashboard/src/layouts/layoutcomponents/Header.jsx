import React, { Fragment, useEffect, useRef, useState } from 'react'
import ALLImages from '../../common/Imagesdata';
import { Dropdown, DropdownDivider, Form, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ThemeChanger, removeFromCart } from '../../common/redux/Action';
import store from '../../common/redux/Store';
import { messageData, notifications, shoppingcartData } from '../../common/Commomarreydata';
import Rightsidebar from './Rightsidebar';
import Switcher from './Switcher';
import { Modalsearch } from '../../common/Reuseablefunction';
import { MENUITEMS } from '../../common/Sidemenudata';
import { API } from '../../services/API';
import toast from 'react-hot-toast';

const Header = ({ ThemeChanger }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await API.get("/profile");
        setUser(data?.data);
      } catch (error) {
        toast.error(error.message);
      }
    }

    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await API.post("/logout");
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  // menuclose function
  function menuClose() {
    const theme = store.getState();
    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, toggled: "close" });
    }
    if (window.innerWidth >= 992) {
      ThemeChanger({ ...theme, toggled: local_varaiable.toggled ? local_varaiable.toggled : "" });
    }
  }

  //side toggle icon

  const toggleSidebar = () => {
    const theme = store.getState();
    let sidemenuType = theme.datanavlayout;

    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, "toggled": "close" });
    }
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataverticalstyle;
        const navStyle = theme.datanavstyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            ThemeChanger({ ...theme, "datanavstyle": "" });
            if (theme.toggled === "close-menu-close") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "close-menu-close" });
            }
            break;
          // icon-overlay
          case "overlay":
            ThemeChanger({ ...theme, "datanavstyle": "" });
            if (theme.toggled === "icon-overlay-close") {
              ThemeChanger({ ...theme, "toggled": "", "iconoverlay": '', "dataverticalstyle": "default" });
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger({ ...theme, "toggled": "icon-overlay-close", "iconoverlay": '' });
              }
            }
            break;
          // icon-text
          case "icontext":
            ThemeChanger({ ...theme, "datanavstyle": "" });
            if (theme.toggled === "icon-text-close") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "icon-text-close" });
            }
            break;
          // doublemenu
          case "doublemenu":
            ThemeChanger({ ...theme, "datanavstyle": "" });
            ThemeChanger({ ...theme, "datanavstyle": "" });
            if (theme.toggled === "double-menu-open") {
              ThemeChanger({ ...theme, "toggled": "double-menu-close" });
            } else {
              let sidemenu = document.querySelector(".side-menu__item.active");
              if (sidemenu) {
                ThemeChanger({ ...theme, "toggled": "double-menu-open" });
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add("double-menu-active");
                } else {

                  ThemeChanger({ ...theme, "toggled": "double-menu-close" });
                  // ThemeChanger({ ...theme, "toggled": "" });
                }
              }
            }
            // doublemenu(ThemeChanger);
            break;

          // default
          case "default":
            ThemeChanger({ ...theme, "toggled": "icon-overlay-close", "dataverticalstyle": 'overlay' });
            break;

        }
        switch (navStyle) {
          case "menu-click":
            if (theme.toggled === "menu-click-closed") {
              ThemeChanger({ ...theme, "toggled": "" });
            }
            else {
              ThemeChanger({ ...theme, "toggled": "menu-click-closed" });
            }
            break;
          // icon-overlay
          case "menu-hover":
            if (theme.toggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "menu-hover-closed" });

            }
            break;
          case "icon-click":
            if (theme.toggled === "icon-click-closed") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "icon-click-closed" });

            }
            break;
          case "icon-hover":
            if (theme.toggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "icon-hover-closed" });

            }
            break;

        }
      }
    }
    else {
      if (theme.toggled === "close") {
        ThemeChanger({ ...theme, "toggled": "open" });

        setTimeout(() => {
          if (theme.toggled == "open") {
            const overlay = document.querySelector("#responsive-overlay");

            if (overlay) {
              overlay.classList.add("active");
              overlay.addEventListener("click", () => {
                const overlay = document.querySelector("#responsive-overlay");

                if (overlay) {
                  overlay.classList.remove("active");
                  menuClose();
                }
              });
            }
          }

          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              const overlay = document.querySelector("#responsive-overlay");

              if (overlay) {
                overlay.classList.remove("active");
              }
            }
          });
        }, 100);
      } else {
        ThemeChanger({ ...theme, "toggled": "close" });
      }
    }

  };

  //search bar function

  const [searchInput, setSearchInput] = useState('');
  const [showListGroup, setShowListGroup] = useState(false);
  const menuItems = MENUITEMS;

  const filterMenuItems = (items) => {
    return items.reduce((filteredItems, item) => {
      if (item.menusub) {
        const filteredChildren = filterMenuItems(item.children || []);
        if (filteredChildren.length > 0) {
          filteredItems.push({ ...item, children: filteredChildren });
        }
      } else if (
        item.title &&
        (item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          searchInput.toLowerCase().includes(item.title.toLowerCase()))
      ) {
        filteredItems.push(item);
      }

      return filteredItems;
    }, []);
  };

  const handleListItemClick = () => {
    setShowListGroup(false);
  };

  const flattenMenuItems = (items) => {
    return items.reduce((flattenedItems, item) => {
      flattenedItems.push(item);

      if (item.children) {
        flattenedItems = flattenedItems.concat(flattenMenuItems(item.children));
      }

      return flattenedItems;
    }, []);
  };

  const filteredMenuItems = filterMenuItems(menuItems);
  const flattenedFilteredMenuItems = flattenMenuItems(filteredMenuItems);

  const listGroupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listGroupRef.current && !listGroupRef.current.contains(event.target)) {
        setShowListGroup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [listGroupRef]);

  //small screen searchbar modal visibility

  const [modalshow, setmodalShow] = useState(false);

  const handlemodalClose = () => setmodalShow(false);
  const handlemodalShow = () => setmodalShow(true);

  //Toggle Dark
  const ToggleDark = () => {
    const theme = store.getState();
    const isDarkMode = theme.datathememode === 'dark';

    const updatedTheme = {
      ...theme,
      "datathememode": isDarkMode ? 'light' : 'dark',
      "dataheaderstyles": isDarkMode ? 'light' : 'dark',
      "datamenustyles": theme.datanavlayout === 'horizontal' && !isDarkMode ? 'dark' : (isDarkMode ? 'light' : 'dark')
    };

    ThemeChanger(updatedTheme);

    if (theme.datathememode === 'light') {
      localStorage.setItem("zanexdarktheme", "dark");
      localStorage.removeItem("zanexlighttheme");
    } else {
      localStorage.setItem("zanexlighttheme", "light");
      localStorage.removeItem("zanexdarktheme");
      localStorage.removeItem("darkBgRGB1");
      localStorage.removeItem("darkBgRGB2");
      localStorage.removeItem("zanexMenu");
      localStorage.removeItem("zanexHeader");
    }
  };

  //full screen function

  const [isFullScreen, setIsFullScreen] = useState(false);

  const openFullscreen = () => {
    const elem = document.documentElement;

    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      requestFullscreen(elem);
    } else {
      exitFullscreen();
    }
  };

  const requestFullscreen = (elem) => {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsFullScreen(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullScreen(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      ) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  //notification function

  const [notificationdata, setnotificationData] = useState([]);
  const [remainingCount, setRemainingCount] = useState(notifications.length);

  const Remove = (id) => {
    if (!notificationdata.includes(id)) {
      setnotificationData((i) => [...i, id]);
      setRemainingCount((prevCount) => prevCount - 1);
    }
  };

  //message function

  const [messagedata, setmessageData] = useState([]);
  const [remainingCount1, setRemainingCount1] = useState(messageData.length);

  const Removeitem = (id) => {
    if (!messagedata.includes(id)) {
      setmessageData((i) => [...i, id]);
      setRemainingCount1((prevCount) => prevCount - 1);
    }
  };

  //Cart function

  const maxDisplayItems = 5;

  const dispatch = useDispatch();
  const reduxCart = useSelector(state => state.cart);
  const [localCart, setLocalCart] = useState(shoppingcartData);
  const [remainingCount2, setRemainingCount2] = useState(0);

  // Combine local and redux carts whenever they change
  const combinedCart = [...localCart, ...reduxCart];

  useEffect(() => {
    setRemainingCount2(combinedCart.length);
  }, [combinedCart]);

  const handleDelete = (id) => {
    // Remove item from local cart
    setLocalCart(localCart.filter(item => item.id !== id));
    // Remove item from redux cart
    dispatch(removeFromCart(id));
  };

  //Right sidebar function

  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(true);
  };

  //Switcher functionality

  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleSwitcherClick = () => {
    setShowSwitcher(true);
  };

  return (
    <Fragment>

      <header className="app-header">

        <div className="main-header-container container-fluid">

          {/* <!-- Left side content --> */}
          <div className="header-content-left">

            {/* <!-- Header Logo --> */}
            <div className="header-element">
              <div className="horizontal-logo">
                <Link to={`${import.meta.env.BASE_URL}dashboard/`} className="header-logo">
                  <img src={ALLImages('logo1')} alt="logo" className="desktop-logo" />
                  <img src={ALLImages('logo5')} alt="logo" className="toggle-logo" />
                  <img src={ALLImages('logo2')} alt="logo" className="desktop-dark" />
                  <img src={ALLImages('logo4')} alt="logo" className="toggle-dark" />
                  <img src={ALLImages('logo2')} alt="logo" className="desktop-white" />
                  <img src={ALLImages('logo6')} alt="logo" className="toggle-white" />
                </Link>
              </div>
            </div>

            {/* <!-- Side toggle icon --> */}
            <div className="header-element" onClick={() => toggleSidebar()}>
              <Link aria-label="Hide Sidebar" className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle mx-0 my-auto" to="#"><span></span></Link>
            </div>

            {/* <!-- Search Bar --> */}
            {/* <div className="header-element header-search">
              <div className="main-header-search ms-3 d-none d-lg-block my-auto">
                <Form.Control placeholder="Search for anything..." type="search" defaultValue={searchInput} onChange={(e) => { setSearchInput(e.target.value); setShowListGroup(!!e.target.value); }} />
                <button className="btn"><i className="fe fe-search" aria-hidden="true"></i></button>
                {showListGroup && (<div ref={listGroupRef}>
                  {flattenedFilteredMenuItems.length > 0 ? (
                    <ListGroup className='search_drop'>
                      {flattenedFilteredMenuItems.map((item, index) => (
                        <ListGroup.Item key={index} onClick={handleListItemClick}>
                          <Link to={item.path ?? `${import.meta.env.BASE_URL}dashboard/`}>{item.title}</Link>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className='not_found'>No results</p>
                  )}
                </div>
                )}
              </div>
            </div> */}

          </div>

          {/* <!-- Right side Content --> */}
          <div className="header-content-right">

            {/* <!-- Country Flag --> */}

            {/* <Dropdown className="header-element country-selector" autoClose="outside">
              <Dropdown.Toggle as='a' variant="" className='no-caret header-link' id="dropdown-basic"><img src={ALLImages('us')} alt="img" className="rounded-circle" /></Dropdown.Toggle>
              <Dropdown.Menu className="main-header-dropdown" align='end'>
                <Dropdown.Item className='d-flex align-items-center'>
                  <span className="avatar avatar-xs lh-1 me-2">
                    <img src={ALLImages('us')} alt="img" />
                  </span> English
                </Dropdown.Item>
                <Dropdown.Item className='d-flex align-items-center'>
                  <span className="avatar avatar-xs lh-1 me-2">
                    <img src={ALLImages('spain')} alt="img" />
                  </span> Spanish
                </Dropdown.Item>
                <Dropdown.Item className='d-flex align-items-center'>
                  <span className="avatar avatar-xs lh-1 me-2">
                    <img src={ALLImages('french')} alt="img" />
                  </span> French
                </Dropdown.Item>
                <Dropdown.Item className='d-flex align-items-center'>
                  <span className="avatar avatar-xs lh-1 me-2">
                    <img src={ALLImages('germany')} alt="img" />
                  </span> German
                </Dropdown.Item>
                <Dropdown.Item className='d-flex align-items-center'>
                  <span className="avatar avatar-xs lh-1 me-2">
                    <img src={ALLImages('italy')} alt="img" />
                  </span> Italian
                </Dropdown.Item>
                <Dropdown.Item className='d-flex align-items-center'>
                  <span className="avatar avatar-xs lh-1 me-2">
                    <img src={ALLImages('russia')} alt="img" />
                  </span> Russian
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}

            {/* <!-- Small Screen Search icon toggle --> */}
            {/* <div className="header-element header-search d-block d-lg-none">
              <Link to="#" className="header-link" onClick={handlemodalShow}><i className="ti ti-search header-link-icon"></i> </Link>
              <Modalsearch show={modalshow} handleClose={handlemodalClose} />
            </div> */}

            {/* <!-- Toggle Dark icon --> */}
            {/* <div className="header-element header-theme-mode">

              <Link to="#" className="header-link layout-setting" onClick={() => ToggleDark()}>
                <span className="light-layout"><i className="fe fe-moonfe fe-moon header-link-icon align-middle"></i></span>
                <span className="dark-layout"><i className="fe fe-sun header-link-icon"></i></span>
              </Link>

            </div> */}

            {/* <!-- Full Screen --> */}

            <li className="header-element header-fullscreen">
              <Link to="#" className="header-link" onClick={openFullscreen}>
                {isFullScreen ? (
                  <i className="fe fe-minimize full-screen-close header-link-icon"></i>
                ) : (
                  <i className="fe fe-maximize full-screen-open header-link-icon"></i>
                )}
              </Link>
            </li>

            {/* <!-- Notificatiion --> */}

            <Dropdown className="header-element notifications-dropdown" autoClose="outside">
              <Dropdown.Toggle as='a' variant="" className="no-caret header-link">
                <i className="fe fe-bell header-link-icon"></i>
                <span className="pulse-success"></span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="main-header-dropdown" align='end'>
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 fs-17 fw-semibold">Notifications</p>
                    <span className="badge bg-success fw-normal" id="notifiation-data">{remainingCount} Unread</span>
                  </div>
                </div>
                <DropdownDivider />
                <ul className="list-unstyled mb-0" id="header-notification-scroll">
                  {notifications.map((notification, index) => (
                    <Fragment key={index}>
                      {!notificationdata.includes(notification.id) && (
                        <Dropdown.Item as='li' key={index}>
                          <div className="d-flex align-items-start">
                            <div className="pe-2">
                              <span className={`avatar avatar-md box-shadow-primary avatar-rounded ${notification.bgColor}`}>
                                <i className={`ri ${notification.icon} fs-18`}></i>
                              </span>
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                              <div>
                                <p className="mb-0 fw-semibold"><Link to={`${import.meta.env.BASE_URL}advancedui/defaultchat/`}>{notification.title}</Link></p>
                                <span className="text-muted fw-normal fs-12 header-notification-text">{notification.time}</span>
                              </div>
                              <div>
                                <Link to="#" className="min-w-fit-content text-muted me-1 dropdown-item-close2" onClick={() => Remove(notification.id)}>
                                  <i className="ti ti-x fs-16"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      )}
                    </Fragment>
                  ))}
                </ul>
                {remainingCount > 0 && (
                  <div className="p-3 empty-header-item1 border-top">
                    <div className="d-grid">
                      <Link to={`${import.meta.env.BASE_URL}advancedui/defaultchat/`} className="btn text-muted p-0 border-0">View all Notification</Link>
                    </div>
                  </div>
                )}
                {remainingCount === 0 && (
                  <div className="p-5 empty-item1">
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                        <i className="ri-notification-off-line fs-2"></i>
                      </span>
                      <h6 className="fw-semibold mt-3">No New Notifications</h6>
                    </div>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* <!-- Message --> */}
            {/* <Dropdown className="header-element meassage-dropdown d-none d-xl-block" autoClose='outside'>
              <Dropdown.Toggle variant="" className='no-caret header-link' id="dropdown-basic">
                <i className="fe fe-message-square header-link-icon"></i>
                <span className="pulse-danger"></span>
              </Dropdown.Toggle>

              <Dropdown.Menu className='main-header-dropdown' align='end'>
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 fs-17 fw-semibold">You have Messages</p>
                    <span className="badge bg-success fw-normal" id="message-data">{remainingCount1} Unread</span>
                  </div>
                </div>
                <DropdownDivider />
                <ul className="list-unstyled mb-0" id="header-notification-scroll1">
                  {messageData.map((message, index) => (
                    <Fragment key={index}>
                      {!messagedata.includes(message.id) && (
                        <Dropdown.Item as='li'>
                          <div className="d-flex align-items-start">
                            <div className="pe-2">
                              <img src={ALLImages(message.image)} alt="img" className="rounded-circle avatar" />
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                              <div>
                                <p className="mb-0 fw-semibold"><Link to={message.link}>{message.name}<span className="text-muted fs-12 fw-normal ps-1 d-inline-block">{message.time}</span></Link></p>
                                <span className="text-muted fw-normal fs-12 header-notification-text">{message.message}</span>
                              </div>
                              <div>
                                <Link to="#" className="min-w-fit-content text-muted me-1 dropdown-item-close3" onClick={() => Removeitem(message.id)}><i className="ti ti-x fs-16"></i></Link>
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      )}
                    </Fragment>
                  ))}
                </ul>
                {remainingCount1 > 0 && (
                  <div className="p-3 empty-header-item1 border-top">
                    <div className="d-grid">
                      <Link to={`${import.meta.env.BASE_URL}advancedui/defaultchat/`} className="btn text-muted p-0 border-0">See all Messages</Link>
                    </div>
                  </div>
                )}

                {remainingCount1 === 0 && (
                  <div className="p-5 empty-item1">
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                        <i className="ri-notification-off-line fs-2"></i>
                      </span>
                      <h6 className="fw-semibold mt-3">No New Notifications</h6>
                    </div>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown> */}

            {/* <!-- Cart --> */}
            {/* <Dropdown className="header-element cart-dropdown" autoClose='outside'>
              <Dropdown.Toggle variant="" as='a' className='no-caret header-link' id="dropdown-basic">
                <i className="fe fe-shopping-cart header-link-icon"></i>
                <span className="badge rounded-pill bg-success cart-badge fw-normal" id="cart-icon-badge">{remainingCount2}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className='main-header-dropdown' align='end'>
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 fs-17 fw-semibold">Cart Items</p>
                    <span className="badge bg-success fw-normal" id="cart-data">{remainingCount2} Items</span>
                  </div>
                </div>
                <DropdownDivider />
                <ul className="list-unstyled mb-0" id="header-cart-items-scroll">
                  {combinedCart.slice(0, maxDisplayItems).map((cart, index) => (
                    <Fragment key={index}>
                      {!combinedCart.includes(cart.id) && (
                        <Dropdown.Item as='li'>
                          <div className="d-flex align-items-start cart-dropdown-item">
                            <img src={cart.imagesrc} alt="img" className="avatar avatar-sm avatar-rounded br-5 me-3" />
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-start justify-content-between mb-0">
                                <div className="mb-0 fs-13 text-dark fw-semibold">
                                  <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/shoppingcart/`}>{cart.itemname}</Link>
                                </div>
                                <div>
                                  <span className="text-black mb-1">${cart.newprice}</span>
                                  <Link to="#" className="header-cart-remove float-end dropdown-item-close" onClick={() => handleDelete(cart.id)}>
                                    <i className="ti ti-trash"></i>
                                  </Link>
                                </div>
                              </div>
                              <div className="min-w-fit-content d-flex align-items-start justify-content-between">
                                <ul className="header-product-item d-flex">
                                  <li>{cart.description}</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      )}
                    </Fragment>
                  ))}
                </ul>
                {remainingCount2 > 0 && (
                  <div className="p-3 empty-header-item border-top">
                    <div className="d-grid">
                      <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/checkout/`} className="btn text-muted p-0 border-0">Proceed to checkout</Link>
                    </div>
                  </div>
                )}
                {remainingCount2 === 0 && (
                  <div className="p-5 empty-item">
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-warning-transparent">
                        <i className="ri-shopping-cart-2-line fs-2"></i>
                      </span>
                      <h6 className="fw-bold mb-1 mt-3">Your Cart is Empty</h6>
                      <span className="mb-3 fw-normal fs-13 d-block">Add some items to make me happy :)</span>
                      <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/shop/`} className="btn btn-primary btn-wave btn-sm m-1" data-abc="true">continue
                        shopping <i className="bi bi-arrow-right ms-1"></i></Link>
                    </div>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown> */}

            {/* <!-- Profile --> */}
            <Dropdown className="header-element profile-1" autoClose='outside'>
              <Dropdown.Toggle variant="" className='leading-none d-flex px-1' id="dropdown-basic">
                <div className="d-flex align-items-center">
                  <div className="">
                    {user?.profile_image ? (
                      <img src={`${import.meta.env.VITE_API_URL}${user?.profile_image}`} alt="Profile Image Preview" className="rounded-circle avatar  profile-user brround cover-image" />
                    ) : (
                      <img src={ALLImages('face9')} alt="img" className="rounded-circle avatar  profile-user brround cover-image" />
                    )}
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu as='ul' className="main-header-dropdown pt-0 overflow-hidden header-profile-dropdown" align='end'>
                <Link to="/dashboard/profile" as='li' className='dropdown-item d-flex' href="#/action-1"><i className="ti ti-user-circle fs-18 me-2 op-7"></i>Profile</Link>
                {/* <Link to={`${import.meta.env.BASE_URL}pages/mailinbox/`} as='li' className='dropdown-item d-flex border-block-end' href="#/action-1"><i className="ti ti-inbox fs-18 me-2 op-7"></i>Inbox <span className="badge bg-success-transparent ms-auto">25</span></Link>
                <Link to={`${import.meta.env.BASE_URL}apps/timeline/`} as='li' className='dropdown-item d-flex' href="#/action-1"><i className="ti ti-clipboard-check fs-18 me-2 op-7"></i>Task Manager</Link>
                <Link to={`${import.meta.env.BASE_URL}pages/services/`} as='li' className='dropdown-item d-flex' href="#/action-1"><i className="ti ti-adjustments-horizontal fs-18 me-2 op-7"></i>Settings</Link>
                <Link to={`${import.meta.env.BASE_URL}pages/faqs/`} as='li' className='dropdown-item d-flex' href="#/action-1"><i className="ti ti-headset fs-18 me-2 op-7"></i>Support</Link> */}
                <Link to="#" as='li' className='dropdown-item d-flex' onClick={handleLogout}><i className="ti ti-logout fs-18 me-2 op-7"></i>Log Out</Link>
              </Dropdown.Menu>
            </Dropdown>

            {/* <!-- Right sidebar --> */}
            {/* <div className="header-element d-none d-sm-block">
              <Link to="#" className="header-link" onClick={handleClick}><i className="fe fe-menu header-link-icon"></i></Link>
              <Rightsidebar show={show} handleClose={() => setShow(false)} />
            </div> */}

            {/* <!-- Switcher --> */}
            <div className="header-element">
              <Link to="#" className="header-link switcher-icon" onClick={handleSwitcherClick}> <i className="fe fe-settings header-link-icon"></i> </Link>
              <Switcher show={showSwitcher} onClose={() => setShowSwitcher(false)} />
            </div>

          </div>

        </div>

      </header>

    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  local_varaiable: state,
  cart: state.cart
});

export default connect(mapStateToProps, { ThemeChanger })(Header);