import React, { Fragment, useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../common/redux/Store';
import Header from './layoutcomponents/Header';
import Sidebar from './layoutcomponents/Sidebar';
import Footer from './layoutcomponents/Footer';
import Tabtotop from './layoutcomponents/Tabtotop';
import SuperAdminSidebar from './layoutcomponents/Sidebar/SuperAdminSidebar';
import AdminSidebar from './layoutcomponents/Sidebar/AdminSidebar';
import PropertyManagerSidebar from './layoutcomponents/Sidebar/PropertyManagerSidebar';
import EditorSidebar from './layoutcomponents/Sidebar/EditorSidebar';
import CounselorSidebar from './layoutcomponents/Sidebar/CounselorSidebar';
import CyberPartnerSidebar from './layoutcomponents/Sidebar/CyberPartnerSidebar';
import AgentSidebar from './layoutcomponents/Sidebar/AgentSidebar';
import StudentSidebar from './layoutcomponents/Sidebar/StudentSidebar';
import { toast } from 'react-hot-toast';
import { API } from '../services/API';

const App = () => {
  const [lateLoad, setLateLoad] = useState(false);
  const [User, setUser] = useState(null);

  useEffect(() => {
    setLateLoad(true);
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await API.get("/profile");
        setUser(data?.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getUserData();
  }, []);

  const renderSidebar = () => {
    switch (User?.role) {
      case 'Super Admin':
        return <SuperAdminSidebar />;
      case 'Admin':
        return <AdminSidebar />;
      case 'Property Manager':
        return <PropertyManagerSidebar />;
      case 'Editor':
        return <EditorSidebar />;
      case 'Counselor':
        return <CounselorSidebar />;
      case 'Cyber Partner':
        return <CyberPartnerSidebar />;
      case 'Agent':
        return <AgentSidebar />;
      case 'Student':
        return <StudentSidebar />;
      default:
        return <Sidebar />;
    }
  };

  return (
    <Fragment>
      <div style={{ display: lateLoad ? 'block' : 'none' }}>
        <Provider store={store}>
          <HelmetProvider>
            <Helmet
              htmlAttributes={{
                lang: 'en',
                dir: 'ltr',
                'data-nav-layout': 'vertical',
                'data-theme-mode': 'light',
                'data-header-styles': 'light',
                'data-menu-styles': 'light',
                'data-vertical-style': 'overlay',
              }}
            />
          </HelmetProvider>
          <div className="page">
            <Header />
            {renderSidebar()}
            <div className="main-content app-content">
              <div className="container-fluid">
                <Outlet />
              </div>
            </div>
            <Footer />
          </div>
        </Provider>
      </div>
      <Tabtotop />
    </Fragment>
  );
};

export default App;
