import React, { useState, useContext } from "react";
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Link, Drawer, List, ListItem, ListItemText, useMediaQuery } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, ListItemIcon, Tooltip} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconGravatar from "./IconGravatar";
import ImageCustom from "./ImageCustom";
import { useSnackbar } from "../providers/SnackbarManager";
import { AuthContext } from "../providers/AuthProvider";
import { isAdmin } from "../libs/Validation";
import logoMain from "../assets/icons/LogoMain.png";
//import config from "../config";


const Header = ({ theme, toggleTheme }) => {
  const { auth, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();
  
  const isLoggedIn = (auth.user !== false);

  const userItems = [
    ...(isLoggedIn && isAdmin(auth.user) ?
      [{
        label: t("Handle users"),
        icon: <ManageAccountsIcon />,
        href: "/handle-users",
      },
      {
        label: t("Handle products"),
        icon: <ShoppingCartIcon />,
        href: "/handle-products",
      }]
    : []),
    {
      label: t("Change theme"),
      icon: (
        <IconButton onClick={toggleTheme} sx={{ padding: 0 }}>
          {theme.palette.mode === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      ),
      href: null,
      onClick: toggleTheme
    },
    ...(isLoggedIn ?
      [
        {
          label: `${t("Profile")} (${auth.user?.roles[0]?.name})`,
          icon: <AccountCircleIcon />,
          href: `/edit-user/${auth.user?.id}/editProfile`,
        },
        {
          label: t("Sign out"),
          icon: <ExitToAppIcon />,
          href: false,
          onClick: () => handleSignOut(),
          shortcutKey: "", //"Ctrl-Q"
        },
      ] : [
        // {
        //   label: t("Sign in"),
        //   icon: <VpnKeyIcon />,
        //   href: "/signin",
        //   shortcutKey: ""
        // },
        // {
        //   label: t("Sign up"),
        //   icon: <AssignmentTurnedInIcon />,
        //   href: "/signup",
        // },
      ]
    ),
  ];
  
  // if (isLoggedIn && isAdmin(auth.user)) {
  //   userItems.unshift(
  //     {
  //       label: t("Admin panel"),
  //       icon: <SecurityIcon />,
  //       href: "/admin-panel",
  //     }
  //   );
  // };
  
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // TODO: why "sm"? Decide it in config?

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
  
  const handleUserJoin = (event) => {
    navigate("/signin", { replace: true });
  };

  const handleSignOut = async () => {
    await signOut();
    showSnackbar(t("sign out successful"), "success");
    navigate("/", { replace: true });
  };

  // const [isDarkMode, setIsDarkMode] = useState(false); // TODO: from user's prop...

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ backgroundColor: theme.palette.ochre.light }}>
      <Toolbar>
        <Box
          component={Link}
          href="/"
          display="flex"
          alignItems="center"
          sx={{ textDecoration: "none" }}
        >
          <Box
            component="img"
            src={logoMain}
            alt="Main logo"
            sx={{ height: 64, marginRight: 2 }}
          />
          {/* <Typography variant="h6" component="span" sx={{ color: theme.palette.text.secondary, flexGrow: 1, }}>
            {config.title}
          </Typography> */}
        </Box>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
        }}>
        </Box>

        {isMobile && (
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
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button color="inherit" component={RouterLink} to="/products">{t("Products")}</Button>
            <Button color="inherit" component={RouterLink} to="/contacts">{t("Contacts")}</Button>
            {/* {isLoggedIn ? (
              <>A<AvatarMenu />V</>
            ) : (
              <Button color="inherit">Enter!</Button>
            )} */}
          </Box>
        )}
        
        {/* user menu */}
        <>
          {isLoggedIn ?
            <Tooltip title={`${auth?.user?.email} (${auth?.user?.roles[0]?.name})`}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                {isLoggedIn ?
                  auth.user.profileImage ?
                    <ImageCustom src={auth.user.profileImage} alt="user's icon" width={30} style={{ borderRadius: "50%" }} />
                  :
                  <IconGravatar
                    email={auth.user.email}
                    size={30}
                  />
                :
                  <AccountCircleIcon />
                }
              </IconButton>
            </Tooltip>
          :
            (auth.user === false) && // if auth.user is false, we show the "Join" button;
                                      // otherwise (it's null), we don't know yet, so do not show anything...
              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleUserJoin}
              >
                {t("Join !")}
              </Button>
          }

          <Menu
            id="menu-appbar"
            anchorEl={anchorUserMenuEl}
            // anchorOrigin={{
            //   vertical: "top",
            //   horizontal: "right",
            // }}
            open={userMenuIsOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose} // to close on click everywhere
            //keepMounted
            // transformOrigin={{
            //   vertical: "top",
            //   horizontal: "right",
            // }}
          >
            {/* {getUserMenuItems()} */}
            {userItems.map(({ label, icon, href, onClick, shortcutKey }) => (
              // <MenuItem key={label} component={RouterLink} to={href} dense>
              <MenuItem key={label} component={RouterLink} to={href} dense>
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText onClick={onClick}>{label}</ListItemText>
                {shortcutKey && <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                  &nbsp; {shortcutKey}
                </Typography>}
              </MenuItem>
            ))}
          </Menu>
        </>
        
      </Toolbar>

      {/* TODO: review this Drawer... */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/products">
              <ListItemText primary={t("Products")} />
            </ListItem>
            <ListItem button component={Link} to="/contacts">
              <ListItemText primary={t("Contacts")} />
            </ListItem>
            {auth.user ? (
              <>
                <ListItem button component={Link} to="/admin-panel">
                  <ListItemText primary="Admin" />
                </ListItem>
                <ListItem button component={Link} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={() => alert("Logged out")}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : null
            //(
              // <ListItem button>
              //   <ListItemText primary="Enter!" /> {/* TODO: never used???*/}
              // </ListItem>
              //)
            }
          </List>
        </Box>
      </Drawer>

    </AppBar>
  );

};

export default Header;
