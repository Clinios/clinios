import React, {
  Suspense,
  Fragment,
  lazy,
} from "react";

import {
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

import AuthGuard from "./components/AuthGuard";
import GuestGuard from "./components/GuestGuard";
import LoadingScreen from "./components/LoadingScreen";
import DashboardLayout from "./layouts/Dashboard";
// import { Reports, Myself } from "./screens/Client";
// import Home from "./screens/Home";
// import DocsLayout from './layouts/DocsLayout';
import MainLayout from "./layouts/MainLayout";
import { PlainPatientPortal, WithLeftSidebar } from "./layouts/PatientPortal";


export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
        // eslint-disable-next-line react/no-array-index-key
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: "/404",
    component: lazy(() => import("./screens/errors/NotFound")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: DashboardLayout,
    path: "/login_client",
    component: lazy(() => import("./screens/Auth/Login")),
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: DashboardLayout,
    path: "/dashboard",
    component: lazy(() => import("./screens/Client/Home/Home")),
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: PlainPatientPortal,
    path: "/patients/:patientId",
    component: lazy(() => import("./screens/Patient")),
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: DashboardLayout,
    path: "/manage/accounting-search",
    component: lazy(() => import("./screens/Client/Manage/AccountingSearch")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: DashboardLayout,
    path: "/contact",
    component: lazy(() => import("./screens/Contact")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: MainLayout,
    path: "/forgot-password",
    component: lazy(() => import("./screens/ForgetPassword")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: MainLayout,
    path: "/password/reset/:userId/:token",
    component: lazy(() => import("./screens/ResetPassword")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: MainLayout,
    path: "/email/confirmation/:userId/:token",
    component: lazy(() => import("./screens/EmailConfirmation")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: MainLayout,
    path: "/signup_client",
    component: lazy(() => import("./screens/Auth/SignUp")),
  },
  {
    path: "/manage",
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/manage/email-patients",
        component: lazy(() => import("./screens/Client/Manage/EmailPatients")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/manage/fax",
        component: lazy(() => import("./screens/Client/Manage/Fax")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/manage/merge-patient",
        component: lazy(() => import("./screens/Client/Manage/MergePatient")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/manage/delete-patient",
        component: lazy(() => import("./screens/Client/Manage/DeletePatient")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/manage/patient-search",
        component: lazy(() => import("./screens/Client/Manage/PatientSearch")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/manage/support",
        component: lazy(() => import("./screens/Client/Manage/Support")),
      },
    ],
  },
  {
    path: "/setup",
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/accounting-types",
        component: lazy(() => import("./screens/Client/Setup/AccountingTypes")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/appointment-types",
        component: lazy(() => import("./screens/Client/Setup/AppointmentTypes")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/reports/report-finance",
        component: lazy(() => import("./screens/Client/Setup/ReportFinance")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/reports/report-finance-detail/:dateFrom/:dateTo",
        component: lazy(() => import("./screens/Client/Setup/ReportFinanceDetail")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/integrations",
        component: lazy(() => import("./screens/Client/Setup/Integrations")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/appoinment-user-types",
        component: lazy(() => import("./screens/Client/Setup/AppointmentTypesUser")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/appoinment-user-types",
        component: lazy(() => import("./screens/Client/Setup/AppointmentTypesUser")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/backup",
        component: lazy(() => import("./screens/Client/Setup/Backup")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/configuration",
        component: lazy(() => import("./screens/Client/Setup/Configuration")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/ctp-codes",
        component: lazy(() => import("./screens/Client/Setup/CTPcodes")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/drugs",
        component: lazy(() => import("./screens/Client/Setup/Drugs")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/forms",
        component: lazy(() => import("./screens/Client/Setup/Forms")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/handouts",
        component: lazy(() => import("./screens/Client/Setup/Handouts")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/icd-codes",
        component: lazy(() => import("./screens/Client/Setup/ICDcodes")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/integrations",
        component: lazy(() => import("./screens/Client/Setup/Integrations")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/lab-ranges",
        component: lazy(() => import("./screens/Client/Setup/LabRanges")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/patient-portal-header",
        component: lazy(() => import("./screens/Client/Setup/PortalHeader")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/schedule",
        component: lazy(() => import("./screens/Client/Setup/Schedule")),
      },
      {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/setup/users",
        component: lazy(() => import("./screens/Client/Setup/Users")),
      },
    ],
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: DashboardLayout,
    path: "/reports",
    component: lazy(() => import("./screens/Client/Reports")),
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: DashboardLayout,
    path: "/process-lab/:userId",
    component: lazy(() => import("./screens/ProcessLab")),
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: DashboardLayout,
    path: "/process-message/:userId",
    component: lazy(() => import("./screens/ProcessMessage")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: DashboardLayout,
    path: "/signup/:clientCode",
    component: lazy(() => import("./screens/patient-portal/auth/Signup")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: DashboardLayout,
    path: "/login/:clientCode",
    component: lazy(() => import("./screens/patient-portal/auth/Login")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: DashboardLayout,
    path: "/forgot/:clientCode",
    component: lazy(() => import("./screens/patient-portal/auth/ForgotPassword")),
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: DashboardLayout,
    path: "/patient/password/reset/:patientId/:token",
    component: lazy(() => import("./screens/patient-portal/ResetPassword")),
  },
  {
    path: "/patient",
    guard: AuthGuard,
    layout: WithLeftSidebar,
    routes: [
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/",
        component: lazy(() => import("./screens/patient-portal/Home/Home")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/messages",
        component: lazy(() => import("./screens/patient-portal/Messages")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/encounters",
        component: lazy(() => import("./screens/patient-portal/Encounters")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/handouts",
        component: lazy(() => import("./screens/patient-portal/Handouts")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/labs",
        component: lazy(() => import("./screens/patient-portal/Labs")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/labs-requisition",
        component: lazy(() => import("./screens/patient-portal/Requisition")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/billing",
        component: lazy(() => import("./screens/patient-portal/Billing")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/payment-methods",
        component: lazy(() => import("./screens/patient-portal/PaymentMethods")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/allergies",
        component: lazy(() => import("./screens/patient-portal/Allergies")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/prescriptions",
        component: lazy(() => import("./screens/patient-portal/Prescriptions")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/pharmacies",
        component: lazy(() => import("./screens/patient-portal/Pharmacies")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/appointments",
        component: lazy(() => import("./screens/patient-portal/Appointments")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/profile",
        component: lazy(() => import("./screens/patient-portal/Profile")),
      },
      {
        guard: AuthGuard,
        layout: WithLeftSidebar,
        path: "/patient/forms",
        component: lazy(() => import("./screens/patient-portal/Forms")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    exact: true,
    guard: GuestGuard,
    layout: DashboardLayout,
    path: "/agreement",
    component: lazy(() => import("./screens/Agreement")),
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: DashboardLayout,
    path: "/myself",
    component: lazy(() => import("./screens/Client/Myself")),
  },
  {
    path: "*",
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: "/",
        component: lazy(() => import("./screens/Home")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

export default routes;
