import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";
//import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  AccountCircle,
  ExitToApp,
  ManageAccounts,
  ShoppingCart,
  ContactPhone,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import IconGravatar from "./IconGravatar";
import ImageCustom from "./ImageCustom";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import { AuthContext } from "../providers/AuthProvider";
import { isAdmin } from "../libs/Validation";
import logoMain from "../assets/images/LogoMain.png";
import config from "../config";


const Header = ({ theme, toggleTheme }) => {
  const { auth, signOut } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const isLoggedIn = (auth.user !== false);

  const userItems = [
    ...(isLoggedIn && isAdmin(auth.user) ?
      [{
        label: t("Handle users"),
        icon: <ManageAccounts />,
        href: "/handle-users",
      },
      {
        label: t("Handle products"),
        icon: <ShoppingCart />,
        href: "/handle-products",
      }]
    : []),
    {
      label: t("Change theme"),
      icon: (
        <IconButton onClick={toggleTheme} sx={{ padding: 0 }}>
          {theme.palette.mode === "light" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      ),
      href: null,
      onClick: toggleTheme
    },
    ...(isLoggedIn ?
      [
        {
          label: `${t("Profile")} (${auth.user?.roles[0]?.name})`,
          icon: <AccountCircle />,
          href: `/edit-user/${auth.user?.id}/editProfile`,
        },
        {
          label: t("Sign out"),
          icon: <ExitToApp />,
          href: false,
          onClick: () => handleSignOut(),
          shortcutKey: "", //"Ctrl-Q"
        },
      ] : [ ]
    ),
  ];

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    console.log("handleSignOut");
    const ok = await signOut();
    console.log("SIGNOUT ok:", ok);
    showSnackbar(ok ? t("sign out successful") : t("signout completed"), "success");
    navigate("/", { replace: true });
  };

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
            sx={{ height: config.ui.headerHeight, marginRight: 2 }}
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
                  <AccountCircle />
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
            open={userMenuIsOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose} // to close on click everywhere
          >
            {userItems.map(({ label, icon, href, onClick, shortcutKey }) => (
              <MenuItem key={label} component={RouterLink} to={href} /*dense*/>
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

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          top: config.ui.headerHeight + "px",
          '& .MuiDrawer-paper': {
            top: config.ui.headerHeight + "px", // make sure the Drawer content also respects this offset
          },
        }}
      >
        <Box
          sx={{ width: 200 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List /*dense*/>
            <ListItem
              key="products"
              component={RouterLink}
              to="/products"
              sx={{ borderBottom: 1, borderColor: "grey.100" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", color: "text.primary" }}>
                <ShoppingCart /> &emsp; <ListItemText primary={t("Products")} />
              </Box>
            </ListItem>
            <ListItem
              key="contacts"
              component={RouterLink}
              to="/contacts"
              sx={{ borderBottom: 1, borderColor: "grey.100" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", color: "text.primary" }}>
                <ContactPhone /> &emsp; <ListItemText primary={t("Contacts")} />
              </Box>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );

};

export default Header;
