import React, { useState, useEffect, useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SecurityIcon from "@material-ui/icons/Security";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import IconCustom from "./IconCustom";
import IconGravatar from "./IconGravatar";
import ImageCustom from "./ImageCustom";
import { AuthContext } from "../providers/AuthProvider";
import { isAdmin } from "../libs/Validation";
import config from "../config";

const useStyles = makeStyles((theme) => ({
  root: {},
  offset: theme.mixins.toolbar,
  header: {
    fontSize: "1.15em",
    backgroundColor: theme.palette.header.backgroundColor,
    color: theme.palette.header.color,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  logo: {
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(2),
  },
  menuLink: {
    marginRight: theme.spacing(2),
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  menuLabel: {
    paddingLeft: theme.spacing(1.5),
  },
  title: {
    flexGrow: 1,
    color: "#222",
    fontWeight: 700,
    fontSize: "1.5em",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawerContainer: {},
  menuItem: {
    borderBottom: "1px solid #eaeaea",
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: "0.4em",
    paddingBottom: "0.4em",
  },
  menuItemMobile: {
    borderBottom: "1px solid #eaeaea",
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: "0.8em",
    paddingBottom: "0.8em",
    marginBottom: "-1.5em",
  },
  menuPadding: {
    padding: 0,
    lineHeight: 0,
  },
}));

const elevation = 3;

function Header() {
  const classes = useStyles();
  const { auth } = useContext(AuthContext);
  const history = useHistory();
  const { t } = useTranslation();

  const [state, setState] = useState({
    view: "mobile",
    drawerOpen: false,
    userMenuIsOpen: false,
  });

  const anchorUserMenuRef = useRef(null);

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < config.ui.mobileDesktopWatershed
        ? setState((prevState) => ({ ...prevState, view: "mobile" }))
        : setState((prevState) => ({ ...prevState, view: "desktop" }));
    };
    setResponsiveness();
    window.addEventListener("resize", setResponsiveness);
    return () => {
      window.removeEventListener("resize", setResponsiveness);
    };
  }, []);

  const handleDrawerOpen = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: true }));
  const handleDrawerClose = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: false }));

  const handleUserMenuOpen = () => {
    setState((prevState) => ({ ...prevState, userMenuIsOpen: true }));
  };

  const handleUserMenuClose = () => {
    setState((prevState) => ({ ...prevState, userMenuIsOpen: false }));
  };

  const handleUserJoin = () => {
    history.push("/signin");
  };

  const mainItems = [
    {
      label: t("Home"),
      icon: <HomeIcon />,
      href: "/",
      showInDesktopMode: false,
    },
    {
      label: t("Contacts"),
      icon: <ListAltIcon />,
      href: "/contacts",
    },
    {
      label: t("Articles"),
      icon: <ListAltIcon />,
      href: "/articles",
    },
  ];

  const userItems = auth.user
    ? [
        {
          label: t("Profile"),
          icon: <AccountCircleIcon />,
          href: "/profile",
        },
        {
          label: t("Sign out"),
          icon: <ExitToAppIcon />,
          href: "/signout",
        },
      ]
    : [
        {
          label: t("Sign in"),
          icon: <VpnKeyIcon />,
          href: "/signin",
        },
        {
          label: t("Sign up"),
          icon: <AssignmentTurnedInIcon />,
          href: "/signup",
        },
      ];

  if (auth.user && isAdmin(auth.user)) {
    userItems.unshift({
      label: t("Admin panel"),
      icon: <SecurityIcon />,
      href: "/admin-panel",
    });
  }

  const getMobileMainMenuItems = () => {
    return mainItems.map(({ label, icon, href }) => (
      <Link
        key={label}
        component={RouterLink}
        to={href}
        color="inherit"
        className={classes.menuLink}
      >
        <MenuItem
          key={label}
          className={[classes.menuItem, classes.menuItemMobile]}
          dense
        >
          <Grid container spacing={0} alignItems="center">
            {icon}
            <span className={classes.menuLabel}>{label}</span>
          </Grid>
        </MenuItem>
      </Link>
    ));
  };

  const getDesktopMainHeaderItems = () => {
    return mainItems
      .filter((item) => item.showInDesktopMode !== false)
      .map(({ label, icon, href }) => (
        <Link
          key={label}
          component={RouterLink}
          to={href}
          color="inherit"
          className={classes.menuLink}
        >
          <span className={classes.headerLabel}>{label}</span>
        </Link>
      ));
  };

  const getUserMenuItems = () => {
    return userItems.map(({ label, icon, href }) => (
      <Link
        key={label}
        component={RouterLink}
        to={href}
        color="inherit"
        className={classes.menuLink}
      >
        <MenuItem key={label} className={classes.menuItem}>
          <Grid container spacing={0} alignItems="center">
            {icon}
            <span className={classes.menuLabel}>{label}</span>
          </Grid>
        </MenuItem>
      </Link>
    ));
  };

  return (
    <header>
      <AppBar className={classes.header} elevation={elevation} position="fixed">
        <Toolbar variant="dense">
          {state.view === "mobile" && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              aria-haspopup="true"
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          )}

          {state.view === "mobile" && (
            <Drawer
              anchor="left"
              open={state.drawerOpen}
              onClose={handleDrawerClose}
              onClick={handleDrawerClose}
            >
              <div className={classes.drawerContainer}>
                {getMobileMainMenuItems()}
              </div>
            </Drawer>
          )}

          <RouterLink to="/">
            <IconCustom name="LogoMain" size={60} className={classes.logo} />
          </RouterLink>

          <div className={classes.title}>{config.title}</div>

          {state.view === "desktop" && (
            <div>{getDesktopMainHeaderItems()}</div>
          )}

          <>
            {auth.user ? (
              <IconButton
                ref={anchorUserMenuRef}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                {auth.user.profileImage ? (
                  <ImageCustom
                    src={auth.user.profileImage}
                    alt="user's icon"
                    width={30}
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <IconGravatar email={auth.user.email} size={30} />
                )}
              </IconButton>
            ) : (
              auth.user === false &&

 (
                <Button onClick={handleUserJoin} color="inherit">
                  {t("Sign in")}
                </Button>
              )
            )}

            {auth.user && (
              <Menu
                id="menu-appbar"
                anchorEl={anchorUserMenuRef.current}
                keepMounted
                open={state.userMenuIsOpen}
                onClose={handleUserMenuClose}
              >
                {getUserMenuItems()}
              </Menu>
            )}
          </>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </header>
  );
}

export default Header;