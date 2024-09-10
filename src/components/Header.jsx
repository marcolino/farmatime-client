// components/Header.js
import React, { useState, useContext } from "react";
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Link, Drawer, List, ListItem, ListItemText, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";
//import ListAltIcon from "@mui/icons-material/ListAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

//import IconCustom from "./IconCustom";
import IconGravatar from "./IconGravatar";
import ImageCustom from "./ImageCustom";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import AvatarMenu from "./AvatarMenu";
import { AuthContext } from "../providers/AuthProvider";
import config from "../config";

import logoMain from "../assets/icons/LogoMain.png";

const Header = ({ isLoggedIn }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  
  const userItems = auth.user ?
  [
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
  ] : [
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
  ]
  ;
  if (auth.user && isAdmin(auth.user)) {
    userItems.unshift(
      {
        label: t("Admin panel"),
        icon: <SecurityIcon />,
        href: "/admin-panel",
      }
    );
  };
  
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
    navigate("/signin");
  };

  const getUserMenuItems = () => {
    return userItems.map(({ label, icon, href }) => (
      <Link key={label} {...{
        component: RouterLink,
        to: href,
        color: "inherit",
        //className: classes.menuLink,
      }}>
        <MenuItem
        key={label}
        //className={classes.menuItem}
        no_dense="true"
        >
          <Grid container spacing={0} alignItems="center">
            {icon}
            {/* <span className={classes.menuLabel}>{label}</span> */}
            <span>{label}</span>
          </Grid>
        </MenuItem>
      </Link>
    ));
  };

  return (
    <AppBar position="sticky">
      <Toolbar>

        {/* <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: "none", boxShadow: "none" }}>
          {/* main brand logo icon * /}
          <RouterLink to="/" sx={{ textDecoration: "none", boxShadow: "none" }}>
            <IconCustom name="LogoMain" size={50} />
            {config.title}
          </RouterLink>

          {/* main brand logo text * /}
          <div>
          </div>
        </Typography> */}

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
          <Typography variant="h6" component="span" sx={{ color: theme.palette.primary.text, flexGrow: 1, }}>
            {config.title}
          </Typography>
        </Box>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
        }}>
          {/* {!isMobile && (
            <Typography variant="h6" component="div" sx={{ fontFamily: "Open Sans", flexGrow: 1 }} >
              My App
            </Typography>
          )} */}
          {/* {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )} */}
          {/* {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button color="inherit" component={Link} to="/products">Products</Button>
              <Button color="inherit" component={Link} to="/contacts">Contacts</Button>
              {isLoggedIn ? (
                <AvatarMenu />
              ) : (
                <Button color="inherit">Enter!</Button>
              )}
            </Box>
          )} */}
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
        {/* <Typography variant="h6" sx={{ flexGrow: 1, alignItems: "start" }}>
          React MUI App
        </Typography> */}
        
        {/* <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/contacts">
          Contacts
        </Button> */}
         {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button color="inherit" component={RouterLink} to="/products">Products</Button>
              <Button color="inherit" component={RouterLink} to="/contacts">Contacts</Button>
              {isLoggedIn ? (
                <AvatarMenu />
              ) : (
                <Button color="inherit">Enter!</Button>
              )}
            </Box>
        )}
        
        {/* user menu */}
        <>
          {auth.user ?
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
            >
              {auth.user ?
                auth.user.profileImage ?
                  <ImageCustom src={auth.user.profileImage} alt="user's icon" width={30} style={{borderRadius: "50%"}} />
                :
                  <IconGravatar
                    email={auth.user.email}
                    size={30}
                  />
              :
                <AccountCircleIcon />
              }
            </IconButton>
          :
            (auth.user === false) && // if auth.user is false, we show the "Join" button;
                                      // otherwise (it's null), we don't kow yet, so do not show anything...
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
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={userMenuIsOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose} // to close on click everywhere
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            // MenuListProps={{
            //   classes: { padding: classes.menuPadding }
            // }}
          >
            {getUserMenuItems()}
          </Menu>
        </>
        
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/products">
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem button component={Link} to="/contacts">
              <ListItemText primary="Contacts" />
            </ListItem>
            {isLoggedIn ? (
              <>
                <ListItem button component={Link} to="/admin">
                  <ListItemText primary="Admin" />
                </ListItem>
                <ListItem button component={Link} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={() => alert("Logged out")}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <ListItem button>
                <ListItemText primary="Enter!" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

    </AppBar>
  );

};

export default Header;
