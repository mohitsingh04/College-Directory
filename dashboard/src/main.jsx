import ReactDOM from 'react-dom/client';
import './index.scss';
import 'sweetalert2/src/sweetalert2.scss';
import "react-data-table-component-extensions/dist/index.css";
import 'react-loading-skeleton/dist/skeleton.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'react-dropzone-uploader/dist/styles.css';
import 'react-phone-input-2/lib/style.css';
import 'react-image-crop/dist/ReactCrop.css';

import { Toaster } from "react-hot-toast";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Scrolltotop from './Scrolltotop';
import App from "./layouts/App";
import Dashboard from './components/Dashboard';
import Error500 from './components/authentication/errorpages/Error500';
import Custompage from './layouts/Custompage';
import Terms from './components/pages/Terms';

// Auth Route
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Forgotpassword from './pages/auth/ForgotPassword';
import SendVerifyEmail from './pages/auth/email/SendVerifyEmail';
import VerifyEmail from './pages/auth/email/VerifyEmail';
import ResetPassword from './pages/auth/password/ResetPassword';

// Profile Route
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';

// Status Route
import AllStatus from './pages/status/AllStatus';
import AddStatus from './pages/status/AddStatus';
import EditStatus from './pages/status/EditStatus';
import ViewStatus from './pages/status/ViewStatus';

// Exam Route
import AllExam from './pages/exam/AllExam';
import AddExam from './pages/exam/AddExam';
import EditExam from './pages/exam/EditExam';
import ViewExam from './pages/exam/ViewExam';
import GetCookies from './pages/cookies/Cookies';

// User Route
import AllUser from './pages/users/AllUser';
import AddUser from './pages/users/AddUser';
import EditUser from './pages/users/EditUser';
import ViewUser from './pages/users/ViewUser';

// Category Route
import AllCategory from './pages/category/AllCategory';
import AddCategory from './pages/category/AddCategory';
import EditCategory from './pages/category/EditCategory';
import ViewCategory from './pages/category/ViewCategory';

// Course Route
import AllCourse from './pages/course/AllCourse';
import AddCourse from './pages/course/AddCourse';
import EditCourse from './pages/course/EditCourse';
import ViewCourse from './pages/course/ViewCourse';

// Property Route
import AllProperty from './pages/property/AllProperty';
import AddProperty from './pages/property/AddProperty';
import EditProperty from './pages/property/EditProperty';
import ViewProperty from './pages/property/ViewProperty';

import GuestRoute from './components/protectedRoutes/GuestRoute';
import AuthorizedUser from './components/protectedRoutes/AuthorizedUser';
import ProtectedRoutes from './components/protectedRoutes/ProtectedRoutes';

// Front
import VerifyOtp from './pages/auth/VerifyOtp';
import Role from './pages/users/Role';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import store from './common/redux/Store';

const AppWrapper = () => {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Scrolltotop />
            <Toaster />
            <Routes>

              {/* Public Routes */}
              <Route path='/' element={<Custompage />}>
                <Route path='/' element={<GuestRoute><Login /></GuestRoute>} />
                <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />
                <Route path='/verify-otp' element={<GuestRoute><VerifyOtp /></GuestRoute>} />
                <Route path='/forgot-password' element={<GuestRoute><Forgotpassword /></GuestRoute>} />
                <Route path='/reset-password' element={<GuestRoute><ResetPassword /></GuestRoute>} />
                <Route path='/verifyemail' element={<GuestRoute><VerifyEmail /></GuestRoute>} />
                <Route path='/verify-email' element={<GuestRoute><SendVerifyEmail /></GuestRoute>} />
                <Route path='/terms-and-policy' element={<Terms />} />
                <Route path='/*' element={<Error500 />} />
              </Route>

              {/* Authenticated Routes */}
              <Route path='/' element={<ProtectedRoutes><App /></ProtectedRoutes>}>
                {/* Dashboard */}
                <Route path='/dashboard' element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
                <Route path='/dashboard/profile' element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
                <Route path='/dashboard/edit-profile' element={<ProtectedRoutes><EditProfile /></ProtectedRoutes>} />

                {/* Status */}
                <Route path='/dashboard/status' element={<ProtectedRoutes><AllStatus /></ProtectedRoutes>} />
                <Route path='/dashboard/status/add' element={<ProtectedRoutes><AddStatus /></ProtectedRoutes>} />
                <Route path='/dashboard/status/edit/:objectId' element={<ProtectedRoutes><EditStatus /></ProtectedRoutes>} />
                <Route path='/dashboard/status/view/:objectId' element={<ProtectedRoutes><ViewStatus /></ProtectedRoutes>} />

                {/* Exam */}
                <Route path='/dashboard/exam' element={<ProtectedRoutes><AllExam /></ProtectedRoutes>} />
                <Route path='/dashboard/exam/add' element={<ProtectedRoutes><AddExam /></ProtectedRoutes>} />
                <Route path='/dashboard/exam/edit/:objectId' element={<ProtectedRoutes><EditExam /></ProtectedRoutes>} />
                <Route path='/dashboard/exam/view/:objectId' element={<ProtectedRoutes><ViewExam /></ProtectedRoutes>} />
                <Route path='/dashboard/cookies' element={<ProtectedRoutes><GetCookies /></ProtectedRoutes>} />

                {/* User */}
                <Route path='/dashboard/:role' element={<ProtectedRoutes><Role /></ProtectedRoutes>} />
                <Route path='/dashboard/users' element={<ProtectedRoutes><AllUser /></ProtectedRoutes>} />
                <Route path='/dashboard/user/add' element={<ProtectedRoutes><AddUser /></ProtectedRoutes>} />
                <Route path='/dashboard/user/edit/:objectId' element={<ProtectedRoutes><EditUser /></ProtectedRoutes>} />
                <Route path='/dashboard/user/view/:objectId' element={<ProtectedRoutes><ViewUser /></ProtectedRoutes>} />

                {/* Category */}
                <Route path='/dashboard/category' element={<ProtectedRoutes><AllCategory /></ProtectedRoutes>} />
                <Route path='/dashboard/category/add' element={<ProtectedRoutes><AddCategory /></ProtectedRoutes>} />
                <Route path='/dashboard/category/edit/:objectId' element={<ProtectedRoutes><EditCategory /></ProtectedRoutes>} />
                <Route path='/dashboard/category/view/:objectId' element={<ProtectedRoutes><ViewCategory /></ProtectedRoutes>} />

                {/* Course */}
                <Route path='/dashboard/course' element={<ProtectedRoutes><AllCourse /></ProtectedRoutes>} />
                <Route path='/dashboard/course/add' element={<ProtectedRoutes><AddCourse /></ProtectedRoutes>} />
                <Route path='/dashboard/course/edit/:objectId' element={<ProtectedRoutes><EditCourse /></ProtectedRoutes>} />
                <Route path='/dashboard/course/view/:objectId' element={<ProtectedRoutes><ViewCourse /></ProtectedRoutes>} />

                {/* Property */}
                <Route path='/dashboard/property' element={<ProtectedRoutes><AllProperty /></ProtectedRoutes>} />
                <Route path='/dashboard/property/add' element={<ProtectedRoutes><AddProperty /></ProtectedRoutes>} />
                <Route path='/dashboard/property/view/:uniqueId' element={<ProtectedRoutes><ViewProperty /></ProtectedRoutes>} />

              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<AppWrapper />);
