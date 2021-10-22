import React, { Suspense, useContext } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import AppContext from "../components/Context/context";
import Footer from "../components/footer";
import Header from "../components/header";
const ArticleMore = React.lazy(() => import("./articleMore"));
const Articles = React.lazy(() => import("./articles"));
const ForgotPass = React.lazy(() => import("./forgotPass"));
const GoogleRedirect = React.lazy(() => import("./googleRedirect"));
const Home = React.lazy(() => import("./home"));
const Images = React.lazy(() => import("./images"));
const Login = React.lazy(() => import("./login"));
const NotFound = React.lazy(() => import("./notFound"));
const Recherche = React.lazy(() => import("./recherche"));
const ResetPassword = React.lazy(() => import("./resetPassword"));
const Sendemailconfirmation = React.lazy(() =>
  import("./sendemailconfirmation")
);
const Signin = React.lazy(() => import("./signin"));
const Test = React.lazy(() => import("../components/test"));
const Users = React.lazy(() => import("./users"));
const AboutUs = React.lazy(() => import("./aboutUs"));
const InfoEdit = React.lazy(() => import("../components/Info/InfoEdit"));

const routeArray = [
  {
    id: 5546,
    path: "/",
    component: Home,
    admin: false,
    authentication: false,
  },
  {
    id: 5547,
    path: "/articles",
    component: Articles,
    admin: true,
    authentication: false,
  },
  {
    id: 5549,
    path: "/users",
    component: Users,
    admin: true,
    authentication: false,
  },
  {
    id: 5550,
    path: "/login",
    component: Login,
    admin: false,
    authentication: true,
  },
  {
    id: 5551,
    path: "/signin",
    component: Signin,
    admin: false,
    authentication: true,
  },
  {
    id: 5552,
    path: "/forgetpassword",
    component: ForgotPass,
    admin: false,
    authentication: true,
  },
  {
    id: 6001,
    path: "/test",
    component: Test,
    admin: false,
    authentication: false,
  },
  {
    id: 6002,
    path: "/images",
    component: Images,
    admin: true,
    authentication: false,
  },
  {
    id: 6003,
    path: "/sendemailconfirmation",
    component: Sendemailconfirmation,
    admin: false,
    authentication: true,
  },
  {
    id: 5548,
    path: "/articlemore/:id",
    component: ArticleMore,
    admin: false,
    authentication: false,
  },
  {
    id: 6004,
    path: "/resetpassword/:code",
    component: ResetPassword,
    admin: false,
    authentication: true,
  },
  {
    id: 5553,
    path: "/connect/google/redirect",
    component: GoogleRedirect,
    admin: false,
    authentication: true,
  },
  {
    id: 6000,
    path: "/notFound",
    component: NotFound,
    admin: false,
    authentication: false,
  },
  {
    id: 6005,
    path: "/recherche",
    component: Recherche,
    admin: false,
    authentication: false,
  },
  {
    id: 6006,
    path: "/aboutus",
    component: AboutUs,
    admin: false,
    authentication: false,
  },
  {
    id: 6007,
    path: "/info",
    component: InfoEdit,
    admin: true,
    authentication: false,
  },
];

const AdminRoute = ({ component: Component, ...rest }) => {
  const appContext = useContext(AppContext);
  const isAdmin =
    appContext.isAuthenticated && appContext.user?.role?.name === "Admin";
  return (
    <Route
      {...rest}
      component={(props) =>
        isAdmin ? <Component {...props} /> : <NotFound {...props} />
      }
    />
  );
};
const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const appContext = useContext(AppContext);
  return (
    <Route
      {...rest}
      component={(props) =>
        appContext.isAuthenticated ? (
          <Redirect to='/' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
const routeConcat = routeArray.map((item) => {
  if (item.admin === true) {
    return (
      <AdminRoute
        key={item.id}
        exact={true}
        path={item.path}
        component={item.component}
      />
    );
  } else if (item.authentication === true) {
    return (
      <AuthenticatedRoute
        key={item.id}
        exact={true}
        path={item.path}
        component={item.component}
      />
    );
  } else {
    return (
      <Route
        key={item.id}
        exact={true}
        path={item.path}
        component={item.component}
      />
    );
  }
});

const Routes = () => {
  const location = useLocation();
  const pathuser = location.pathname;
  var exist = false;
  exist = routeArray.some((item) => {
    const pathbd = item.path;
    if (pathbd === pathuser) {
      return true;
    }
    if (pathuser.includes("/connect/google/redirect")) {
      return true;
    }
    if (
      pathuser.includes("/resetpassword/") &&
      !pathuser.includes("/", pathuser.indexOf("/", 1) + 1)
    ) {
      return true;
    }
    if (
      pathuser.includes("/articlemore/") &&
      !pathuser.includes("/", pathuser.indexOf("/", 1) + 1)
    ) {
      return true;
    }
    return false;
  });
  return (
    <Switch>
      <Suspense fallback={<></>}>
        <Route path='/' component={Header} />
        <div className='container-body' id='container-body'>
          <Suspense fallback={<div className='loading'></div>}>
            {exist ? (
              routeConcat
            ) : (
              <Route path={location.pathname} component={NotFound} />
            )}
          </Suspense>
        </div>
        <Route path='/' component={Footer} />
      </Suspense>
    </Switch>
  );
};
export default Routes;
