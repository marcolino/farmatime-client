import React, { useState, useContext } from "react";
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton, Badge,
  ListItemText, ListItemIcon, Menu, MenuItem, Tooltip
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AccountCircle, ExitToApp,
  ShoppingCart, Category, Brightness4, Brightness7,
  ContactPhone, /*ImportExport,*/ SettingsSuggest, History,
} from "@mui/icons-material";
import IconGravatar from "./IconGravatar";
import Drawer from "./custom/Drawer";
import { cancelAllRequests } from "../middlewares/Interceptors";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { AuthContext } from "../providers/AuthContext";
import { JobContext } from '../providers/JobContext';
import { useDialog } from "../providers/DialogContext";
import { useCart } from "../providers/CartProvider";
import { isAdmin } from "../libs/Validation";
import logoMain from "../assets/images/LogoMain.png";
import logoMainText from "../assets/images/LogoText.png";
import config from "../config";

const Header = ({ theme, toggleTheme }) => {
  const { auth, isLoggedIn, signOut, didSignInBefore } = useContext(AuthContext);
  const { jobDraftIsDirty, setJobDraftDirty } = useContext(JobContext);
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  //console.log("Snackbar Context in Header:", showSnackbar); // Debugging line
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { cartItemsQuantity } = useCart();
  const { isMobile } = useMediaQueryContext();

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

  // alert(location.pathname);
  // const isAuthRoute = () => (false);  //location.pathname === "/signin");
  const isAuthRoute = () => (location.pathname === "/signin" || location.pathname === "/signup" || location.pathname === "/forgot-password" || location.pathname === "/social-signin-success" || location.pathname === "/social-signin-error");

  const userItems = [
    ...(isLoggedIn && isAdmin(auth.user) ?
      [
        // {
        //   label: t("Handle users"),
        //   icon: <ManageAccounts />,
        //   href: "/handle-users",
        // },
        ...(config.ui.products.enabled ?
          [
            {
              label: t("Handle products"),
              icon: <Category />,
              //href: "/handle-products",
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
          //href: `/edit-user/${auth?.user?.id}/editProfile`,
          onClick: () => handleEditProfile(auth?.user?.id),
        },
        {
          label: t("Advanced Options"),
          icon: <SettingsSuggest />,
          //href: false,
          onClick: () => handleAdvancedOptions(),
          shortcutKey: "", //"Ctrl-O"
        },
        {
          label: `${t("Requests History")}`,
          icon: <History />,
          //href: false,
          onClick: () => handleHistory(),
        },
        // {
        //   label: t("Export data"),
        //   icon: <ImportExport />,
        //   href: false,
        //   onClick: () => handlejobsExport(),
        //   shortcutKey: "", //"Ctrl-I"
        // },
        // {
        //   label: t("Import data"),
        //   icon: <ImportExport />,
        //   href: false,
        //   onClick: () => handlejobsImport({ onDataImported: (data) => alert(data) }),
        //   shortcutKey: "", //"Ctrl-E"
        // },
      ] : []
    ),
    {
      label: t("Change theme"),
      icon: (
        <IconButton onClick={toggleTheme} sx={{ padding: 0 }}>
          {theme.palette.mode === "light" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      ),
      //href: null,
      onClick: toggleTheme
    },
    ...(isLoggedIn ?
      [
        {
          label: t("Sign out"),
          icon: <ExitToApp />,
          //href: false,
          onClick: () => handleSignOut(),
          shortcutKey: "", //"Ctrl-Q"
        },
      ]
      : []),
  ];

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
    console.log("handleSignOut");
    //navigate("/", { replace: true });

    const proceed = async () => {
      let ok;
      try {
        cancelAllRequests(); // cancel all ongoing requests, to avoid "You must be authenticated for this action" warnings
        ok = await signOut();
        console.log("signout result:", ok);
        //navigate("/"); // navigate to home page, because guest user could not be entitled to stay on current page
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

  //console.log("sections:", sections);
  //console.log("+++++++++++++++ isAuthRoute:", isAuthRoute(), location, location.pathname);
  
  const handleCart = () => {
    const proceed = () => navigate("cart", { replace: true });
    checkJobDraftIsDirty(t("Cart"), proceed);
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ bgColor: theme.palette.ochre.light }}>
      <Toolbar>
        <Box
          //component={Link}
          //href="/"
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
            src={logoMain}
            alt="Main logo"
            sx={{
              width: 72,
              height: "auto", // let browser calculate height proportionally
              mr: 2,
              borderRadius: 2,
              display: "block", // remove inline spacing
              userSelect: "none", // avoid user select
            }}
          />
          <Box
            component="img"
            src={logoMainText}
            alt="Main text logo"
            sx={{
              width: { xs: 150, sm: 180 },
              height: "auto", // let browser calculate height proportionally
              mr: 2,
              userSelect: "none", // avoid user select
              //borderRadius: 2,
              //display: "block" // remove inline spacing
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
                onClick={() => handleCart}
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
                // component={RouterLink}
                // to={section.to}
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

          {/* <Menu
            id="menu-appbar"
            anchorEl={anchorUserMenuEl}
            open={userMenuIsOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose} // to close on click everywhere
          >
            {userItems.map(({ label, icon, href, onClick, shortcutKey }) => (
              <MenuItem
                key={label}
                component={RouterLink}
                to={href}
                {...(href ?
                  { component: RouterLink, to: href } :
                  { onClick: () => { onClick(); handleUserMenuClose(); } })
                }
              >
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText onClick={onClick}>{label}</ListItemText>
                {shortcutKey && <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                  &nbsp; {shortcutKey}
                </Typography>}
              </MenuItem>
            ))}
          </Menu> */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorUserMenuEl}
            open={userMenuIsOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose} // to close on click everywhere
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
      
    </AppBar>
  );

};

export default React.memo(Header);
