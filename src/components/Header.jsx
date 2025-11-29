import React, { useState, useEffect, useContext, useCallback } from "react"; 
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton, Badge,
  ListItemText, ListItemIcon, Menu, MenuItem, Tooltip,
  //Fab,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
//import MenuIcon from "@mui/icons-material/Menu";
import {
  AccountCircle, ExitToApp,
  ShoppingCart, Category, Brightness4, Brightness7,
  ContactPhone, /*ImportExport,*/ SettingsSuggest, History, ScheduleSend,
  Menu as MenuIcon, /*LunchDining,*/ FormatListBulleted, Share, InfoOutline as InfoIcon,
  EmojiObjects,
} from "@mui/icons-material";
import IconGravatar from "./IconGravatar";
import Drawer from "./custom/Drawer";
import { cancelAllRequests } from "../middlewares/Interceptors";
import FloatingBellRequestErrors from "./FloatingBellRequestErrors";
import FloatingBellHelp from "./FloatingBellHelp";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { AuthContext } from "../providers/AuthContext";
import { JobContext } from '../providers/JobContext';
import { useDialog } from "../providers/DialogContext";
import { HelpContext } from "../providers/HelpContext";
import { useCart } from "../hooks/useCart";
import { apiCall } from "../libs/Network";
import logoMainHeader from "../assets/images/LogoMainHeader.png";
import { isAdmin } from "../libs/Validation";
import { fetchBuildInfoData } from "../libs/Misc";
import { useInfo } from "../hooks/useInfo";
//import { useOpenHelpDialog } from "../hooks/useOpenHelpDialog";
import logoTextHeader from "../assets/images/LogoTextHeader.png";
//import serverPackageJson from "../../../farmatime-server/package.json"; // WARNING: this depends on folders structure...
import config from "../config";


const Header = ({ theme, toggleTheme }) => {
  const { auth, isLoggedIn, signOut, didSignInBefore } = useContext(AuthContext);
  const { jobDraftIsDirty, setJobDraftDirty } = useContext(JobContext);
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { cartItemsQuantity } = useCart();
  const { isMobile } = useMediaQueryContext();
  const [buildInfo, setBuildInfo] = useState(null);
  const [pollingRefreshKey, setPollingRefreshKey] = useState(0);
  const { info } = useInfo();
  const { openHelp } = useContext(HelpContext);
  //const help = useOpenHelpDialog();

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
          label: `${t("Activities List")}`,
          icon: <FormatListBulleted />,
          onClick: () => handleJobs(),
        },
        {
          label: `${t("Requests History")}`,
          icon: <History />,
          onClick: () => handleHistory(),
          shortcutKey: "",
        },
        {
          label: `${t("Future Requests")}`,
          icon: <ScheduleSend />,
          onClick: () => handleScheduled(),
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
      label: t("Share this app"),
      icon: <Share />,
      onClick: () => handleShare()
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
    {
      label: t("Help"),
      icon: (
        <IconButton onClick={openHelp} sx={{ padding: 0 }}>
          <EmojiObjects />
        </IconButton>
      ),
      onClick: () => openHelp()
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

  const handleJobs = () => {
    const proceed = () => navigate("/jobs-handle", { replace: true });
    checkJobDraftIsDirty(t("Handle jobs"), proceed);
  };

  const handleHistory = () => {
    const proceed = () => navigate("/requests-history", { replace: true });
    checkJobDraftIsDirty(t("Requests history"), proceed);
  };

  const handleScheduled = () => {
    const proceed = () => navigate("/requests-scheduled", { replace: true });
    checkJobDraftIsDirty(t("Future requests"), proceed);
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

  const getRequestErrors = useCallback(async () => {
    return isLoggedIn ? await apiCall("get", "/request/getRequestErrors") : [];
  }, [isLoggedIn]);

  const handleRequestsErrors = async () => {
    showDialog({
      title: t("Some errors in email requests"),
      message: t("Some email requests were not successful: it is possible some doctor email address is incorrect, or there was some network error") + ".",
      confirmText: t("Show last requests"),
      onConfirm: async () => {
        await apiCall("post", "/request/setRequestErrorsSeen");
        setPollingRefreshKey(prev => prev + 1); // trigger re-poll
        navigate("/requests-history", { replace: true });
      },
      cancelText: t("Cancel"),
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: t("Check out this app!"),
      text: t("I’ve been using this web app — you should try it, it's really useful!"),
      url: config.api.productionDomains[0] // app base URL, not naked
    };

    if (navigator.share) { // current browser support share API
      try {
        await navigator.share(shareData);
      } catch (err) {
        const isCancel = err.name === "AbortError" ||
          /cancel/i.test(err.message)
        ;
        if (isCancel) {
          //console.log("User cancelled share");
          showSnackbar(t("Share canceled"), "info");
        } else {
          showSnackbar(t("Share failed: {{err}}", { err: err.message ?? err.name }), "warning");
        }
      }
    } else { // fallback for desktop or unsupported browsers
      navigator.clipboard.writeText(shareData.url);
      showSnackbar(t("Link copied to clipboard"), "success");
    }
  };

  /*
      <Button
        variant="contained"
        color="primary"
        startIcon={<ShareIcon />}
        onClick={handleShare}
        sx={{ borderRadius: "2rem", textTransform: "none" }}
      >
        Share this app
      </Button>
  */

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
              mr: { xs: 1, sm: 2 },
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
              width: { xs: 180, sm: 210 },
              height: "auto", // Let browser calculate height proportionally
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
          <Tooltip title={t("Main menu")}>
            <IconButton
              aria-label="main menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
              sx={{ pr: { xs: 1, sm: 2, md: 4 } }}
            >
              <MenuIcon /*LunchDining*/ fontSize="small" />
            </IconButton>
          </Tooltip>
          {isLoggedIn ?
            <Tooltip title={`${auth.user.email} (${roleNameHighestPriority})`}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                //onClick={handleUserMenuOpen}
                onClick={() => showDialog({
                  title: t("Current user"),
                  message: `${t("Name")}: ${auth.user.firstName} ${auth.user.lastName}\n${t("Role")}: ${t(auth.user.roles[0]?.name)}\n${t("Email")}: ${auth.user.email}`,
                  cancelText: t("Ok"),
                })}
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
      
      <FloatingBellRequestErrors
        pollingCallback={getRequestErrors}
        onOkCallback={handleRequestsErrors}
        pollingRefreshKey={pollingRefreshKey}
      />

      <FloatingBellHelp
        pollingCallback={getRequestErrors}
        onOkCallback={handleRequestsErrors}
        pollingRefreshKey={pollingRefreshKey}
      />
      
    </AppBar>
  );

};

export default React.memo(Header);
