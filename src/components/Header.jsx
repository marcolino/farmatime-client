import React, { useState, useEffect, useContext, useCallback } from "react"; 
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton, Badge,
  ListItemText, ListItemIcon, Menu, MenuItem, Tooltip,
  //Fab,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AccountCircle, ExitToApp,
  ShoppingCart, Category, Brightness4, Brightness7,
  ContactPhone, /*ImportExport,*/ SettingsSuggest, History,
  InfoOutline as InfoIcon,
  //NotificationsActive,
} from "@mui/icons-material";
import IconGravatar from "./IconGravatar";
import Drawer from "./custom/Drawer";
import { cancelAllRequests } from "../middlewares/Interceptors";
import FloatingBell from "../components/FloatingBell";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { AuthContext } from "../providers/AuthContext";
import { JobContext } from '../providers/JobContext';
import { useDialog } from "../providers/DialogContext";
import { useCart } from "../providers/CartProvider";
import { apiCall } from "../libs/Network";
import logoMainHeader from "../assets/images/LogoMainHeader.png";
import { isAdmin } from "../libs/Validation";
import { fetchBuildInfoData } from "../libs/Misc";
import { useInfo } from "../hooks/useInfo";
import logoTextHeader from "../assets/images/LogoTextHeader.png";
//import serverPackageJson from "../../../farmatime-server/package.json"; // WARNING: this depends on folders structure...
import config from "../config";

const Header = ({ theme, toggleTheme }) => {
  const { auth, isLoggedIn, signOut, didSignInBefore, /*requestErrors,*/ setRequestErrors } = useContext(AuthContext);
  const { jobDraftIsDirty, setJobDraftDirty } = useContext(JobContext);
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { cartItemsQuantity } = useCart();
  const { isMobile } = useMediaQueryContext();
  const [buildInfo, setBuildInfo] = useState(null);
  const { info } = useInfo();


  const sections = React.useMemo(() => [
    ...(config.ui.cart.enabled && config.ecommerce.enabled ? [{ // add cart to sections only if ui.cart and ecommerce is enabled
      key: "cart",
      to: "/cart",
      icon:
        cartItemsQuantity() ?
          <Badge badgeContent={cartItemsQuantity()} color="primary"><ShoppingCart /></Badge>
          :
          <ShoppingCart />
      ,
      text:
        cartItemsQuantity() && !isMobile ?
          <Badge badgeContent={cartItemsQuantity()} color="primary">{t("Cart")}</Badge>
          :
          t("Cart")
    }] : []),
    ...(config.ui.products.enabled ? [{
      key: "products",
      to: "/products",
      icon: <Category />,
      text: t("Products"),
    }] : []),
    ...(config.ui.contacts.enabled ? [{
      key: "contacts",
      to: "/contacts",
      icon: <ContactPhone />,
      text: t("Contacts"),
    }] : []),
  ], [
    cartItemsQuantity,
    isMobile,
    t
  ]);

  // the highest priority role name
  const roleNameHighestPriority = isLoggedIn ? auth.user.roles.reduce(
    (previous, current) => previous.priority > current.priority ? previous : current
  ).name : "guest";

  const isAuthRoute = () => (location.pathname === "/signin" || location.pathname === "/signup" || location.pathname === "/forgot-password" || location.pathname === "/social-signin-success" || location.pathname === "/social-signin-error");

  // TODO: put info in a component, to be used also from Footer ...
  /*
  const infoTitle = t('Informations about this app');
  const mode =
    config.mode.production ? "production" :
      config.mode.staging ? "staging" :
        config.mode.development ? "development" :
          config.mode.test ? "test" :
            config.mode.testInCI ? "testInCI" :
              "?"
  ;
  const infoContents = (
    <Box>
      <Grid
        container
        alignItems="center"
        sx={{
          width: "100%",
          backgroundColor: "tertiary.dark",
          borderRadius: 2,
        }}
      >
        {/* Left column * /}
        <Grid size={{ xs: 3, md: 1 }} display="flex" alignItems="center">
          <Box
            component="img"
            src={logoMainHeader}
            alt="Main logo"
            sx={{
              width: {xs: 40, md: 48},
              height: "auto",
              my: 1,
              ml: 1,
              borderRadius: 2,
            }}
          />
        </Grid>

        {/* Middle column * /}
        <Grid size={{ xs: 6, md: 10 }} textAlign="center">
          <Typography
            variant="h4"
            align="center"
            sx={{
              width: "100%",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              color: "background.default",
            }}
          >
            {config.title}
          </Typography>
        </Grid>

        {/* Right column (empty, balances left) * /}
        <Grid size={{ xs: 3, md: 1 }}></Grid>
      </Grid>

      <Typography variant="body1" sx={{ mt: 4 }}>
        {t("This app is produced by")} {config.company.owner.name}<br />
        {t("You can reach us at email")} &lt;{config.company.email}&gt;<br />
        {t("App mode")} {t("is")} {t(mode)}<br />
        {t("Version")} {t("is")} v{serverPackageJson.version} © {new Date().getFullYear()}<br />
        {t("Client build")} {t("is")} {t("n.")} {buildInfo?.client ? buildInfo.client.buildNumber : "?"} {t("on date")} {buildInfo?.client ? buildInfo.client.buildDateTime : "?"}<br />
        {t("Server build")} {t("is")} {t("n.")} {buildInfo?.server ? buildInfo.server.buildNumber : "?"} {t("on date")} {buildInfo?.server ? buildInfo.server.buildDateTime : "?"}<br />
      </Typography>
    </Box >
  );
  // {t("Phone is")}: ${config.company.phone}.<br />
  // {t("Street address is")}: ${config.company.streetAddress}.<br />
  // {t("Email address is")}: ${config.company.email}.<br />

  const info = () => {
    showDialog({
      title: infoTitle,
      message: infoContents,
      confirmText: t("Ok"),
    })
  };
*/
  
  const userItems = [
    ...(isLoggedIn && isAdmin(auth.user) ?
      [
        ...(config.ui.products.enabled ?
          [
            {
              label: t("Handle products"),
              icon: <Category />,
              onClick: handleProducts,
            },
          ]
          : []),
      ]
      : []),
    ...(isLoggedIn ?
      [
        {
          label: `${t("Profile")} (${roleNameHighestPriority})`,
          icon: <AccountCircle />,
          onClick: () => handleEditProfile(auth?.user?.id),
        },
        {
          label: t("Advanced Options"),
          icon: <SettingsSuggest />,
          onClick: () => handleAdvancedOptions(),
          shortcutKey: "", //"Ctrl-O"
        },
        {
          label: `${t("Requests History")}`,
          icon: <History />,
          onClick: () => handleHistory(),
          shortcutKey: "",
        },
        /*
        {
          label: t("Export data"),
          icon: <ImportExport />,
          href: false,
          onClick: () => handlejobsExport(),
          shortcutKey: "", //"Ctrl-I"
        },
        {
          label: t("Import data"),
          icon: <ImportExport />,
          href: false,
          onClick: () => handlejobsImport({ onDataImported: (data) => alert(data) }),
          shortcutKey: "", //"Ctrl-E"
        },
        */
      ] : []
    ),
    {
      label: t("Change theme"),
      icon: theme.palette.mode === "light" ? <Brightness7 /> : <Brightness4 />,
      onClick: () => toggleTheme()
    },
    {
      label: t("Info"),
      icon: (
        <IconButton onClick={info} sx={{ padding: 0 }}>
          <InfoIcon />
        </IconButton>
      ),
      onClick: () => info()
    },
    ...(isLoggedIn ?
      [
        {
          label: t("Sign out"),
          icon: <ExitToApp />,
          onClick: () => handleSignOut(),
          shortcutKey: "", //"Ctrl-Q"
        },
      ]
      : []),
  ];

  useEffect(() => { // read build info from file on disk
    if (!buildInfo) {
      (async function () {
        const data = await fetchBuildInfoData();
        setBuildInfo(data);
      })();
    }
  }, [buildInfo]);
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const [anchorUserMenuEl, setAnchorUserMenuEl] = React.useState(null);
  const userMenuIsOpen = Boolean(anchorUserMenuEl);

  const handleUserMenuOpen = (event) => {
    setAnchorUserMenuEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorUserMenuEl(null);
  };
  
  const handleUserJoin = () => {
    navigate(
      didSignInBefore ? "/signin" : "/signup",
      { replace: true }
    );
  };

  const handleSignOut = async () => {
    const proceed = async () => {
      let ok;
      try {
        cancelAllRequests(); // cancel all ongoing requests, to avoid "You must be authenticated for this action" warnings
        ok = await signOut();
      } catch (err) {
        console.error("signout error:", err);
      }
      navigate("/", { replace: true });
      showSnackbar(ok ? t("Sign out successful") : t("Sign out completed"), "success");
    };

    checkJobDraftIsDirty(t("Signout"), proceed);
  };

  const checkJobDraftIsDirty = (title, proceed) => {
    if (!jobDraftIsDirty) {
      proceed();
    } else {
      showDialog({
        title,
        message: t("Are you sure you want to cancel the job edits you have just done? All changes will be lost."),
        confirmText: t("Yes, cancel changes"),
        cancelText: t("No, continue"),
        onConfirm: () => {
          setJobDraftDirty(false);
          proceed();
        },
      });
    }
  };

  const handleHomeLink = () => {
    const proceed = () => navigate("/", { replace: true });
    checkJobDraftIsDirty(t("Home"), proceed);
  };

  
  const handleSectionLink = (destination) => {
    const proceed = () => navigate(destination.to ?? '/', { replace: true });
    checkJobDraftIsDirty(destination.text, proceed);
  };

  const handleProducts = () => {
    const proceed = () => navigate('/handle-products', { replace: true });
    checkJobDraftIsDirty(t("Handle Products"), proceed);
  };
  
  const handleEditProfile = (id) => {
    const proceed = () => navigate(`/edit-user/${id}/editProfile`, { replace: true });
    checkJobDraftIsDirty(t("Edit Profile"), proceed);
  };

  const handleAdvancedOptions = () => {
    const proceed = () => navigate("/advanced-options", { replace: true });
    checkJobDraftIsDirty(t("Advanced options"), proceed);
  };

  const handleHistory = () => {
    const proceed = () => navigate("/requests-history", { replace: true });
    checkJobDraftIsDirty(t("Requests history"), proceed);
  };

  // const handlejobsExport = () => {
  //   navigate("/job-data-export", { replace: true });
  // };

  // const handlejobsImport = () => {
  //   navigate("/job-data-import", { replace: true });
  // };

  const handleCart = () => {
    const proceed = () => navigate("cart", { replace: true });
    checkJobDraftIsDirty(t("Cart"), proceed);
  };

  // const handleRequestsErrorsPolling = async () => {
  //   return await apiCall("post", "/auth/requestErrors", { userId: auth.user._id });
  // };
  const handleRequestsErrorsPolling = useCallback(async () => {
    return await apiCall("post", "/auth/requestErrors"/*, { userId: auth.user._id }*/);
  }, [/*auth.user._id*/]);

  const handleRequestsErrorsNotification = () => {
    showDialog({
      title: t("Some errors in email requests"),
      message: t("Some email requests could not be completed: it is possible some doctor email address is incorrect, or there was some network error") + ".",
      confirmText: t("Show last requests"),
      onConfirm: () => {
        setRequestErrors(false);
        navigate("/requests-history");
      },
      cancelText: t("Cancel"),
    });
  };


  return (
    <AppBar
      position="sticky"
      elevation={1}
    >
      <Toolbar>
        <Box
          onClick={handleHomeLink}
          display="flex"
          alignItems="center"
          sx={{
            //textDecoration: "none",
            alignItems: "center", // Vertically centers the child
            userSelect: "none"
           }}
        >
          <Box
            component="img"
            src={logoMainHeader}
            alt="Main logo"
            sx={{
              width: 48,
              height: "auto", // Let browser calculate height proportionally
              _mt: 0.5,
              mr: 3,
              borderRadius: 2,
              display: "block", // Remove inline spacing
              userSelect: "none", // Avoid user select
            }}
          />
          <Box
            component="img"
            src={logoTextHeader}
            alt="Main text logo"
            sx={{
              width: { xs: 200, sm: 210 },
              height: "auto", // Let browser calculate height proportionally
              mt: 1,
              userSelect: "none", // Avoid user select
            }}
          />
        </Box>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          userSelect: "none"
        }}>
        </Box>

        {isMobile ?
          <>
            {config.ui.cart.enabled && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleCart}
                sx={{ mr: 2 }}
              >
                {cartItemsQuantity() ?
                  <Badge badgeContent={cartItemsQuantity()} color="primary"><ShoppingCart /></Badge>
                  :
                  <ShoppingCart />
                }
              </IconButton>
            )}
            {(sections.length > 0) && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </>
        :
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {sections.map(section => (
              <Button
                key={section.key}
                color="inherit"
                onClick={() => handleSectionLink(section)}
              >
                {section.text}
              </Button>
            ))}
          </Box>
        }
        
        <> {/* user menu */}
          {isLoggedIn ?
            <Tooltip title={`${auth.user.email} (${roleNameHighestPriority})`}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                {isLoggedIn ?
                  auth.user.profileImage ?
                    <img src={auth.user.profileImage} alt="user's icon" width={30} style={{ borderRadius: "50%" }} />
                  :
                  <IconGravatar
                    email={auth.user.email}
                    size={30}
                  />
                :
                  <AccountCircle />
                }
              </IconButton>
            </Tooltip>
          :
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleUserJoin}
              disabled={isAuthRoute()} 
            >
              {t("Join !")}
            </Button>
          }

          <Menu
            id="menu-appbar"
            anchorEl={anchorUserMenuEl}
            open={userMenuIsOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose} // To close on click everywhere
          >
            {userItems.map(({ label, icon, href, onClick, shortcutKey }) => (
              href
                ? (
                  <MenuItem
                    key={label}
                    component={RouterLink}
                    to={href}
                  >
                    <ListItemIcon>
                      {icon}
                    </ListItemIcon>
                    <ListItemText>{label}</ListItemText>
                    {shortcutKey && <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                      &nbsp; {shortcutKey}
                    </Typography>}
                  </MenuItem>
                )
                : (
                  <MenuItem
                    key={label}
                    onClick={() => {
                      if (onClick) onClick();
                      handleUserMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      {icon}
                    </ListItemIcon>
                    <ListItemText>{label}</ListItemText>
                    {shortcutKey && <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                      &nbsp; {shortcutKey}
                    </Typography>}
                  </MenuItem>
                )
            ))}
          </Menu>
        </>
        
      </Toolbar>

      <Drawer
        theme={theme}
        sections={sections}
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
      />
      
      {/*
          TODO: To avoid unwanted scrolls in home page:
            - Move the FAB outside of any scrollable container (ideally near the root).
            - Use bottom: 24, right: 24 instead of "3em".
            - Add zIndex: 9999 for safety.
            - Optionally, disable scroll bounce with "overscroll-behavior: none" in the outermost container.
      */}
      
      {/* TODO: put in a new component */}
      <FloatingBell
        warning={auth.user.requestErrors}
        pollingCallback={handleRequestsErrorsPolling}
        onOkCallback={handleRequestsErrorsNotification}
      />
      {/* {requestErrors && (
        <Fab
          onClick={handleRequestsErrorsNotification}
          color="error"
          aria-label="notification icon"
          sx={{
            position: "fixed",
            bottom: 32, // distance from bottom
            right: 32, // distance from right
            zIndex: 9999, // on top of everything else, but should not be necessary...
          }}
        >
          <NotificationsActive />
        </Fab>
      )} */}
      
    </AppBar>
  );

};

export default React.memo(Header);
