import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AvatarMenu from './AvatarMenu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Header = ({ isLoggedIn }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {!isMobile && (
            <Typography variant="h6" component="div" sx={{ fontFamily: 'Open Sans', flexGrow: 1 }} >
              My App
            </Typography>
          )}
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
        </Box>
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={Button/*Link*/} to="/products">Products</Button>
            <Button color="inherit" component={Button/*Link*/} to="/contacts">Contacts</Button>
            {isLoggedIn ? (
              <AvatarMenu />
            ) : (
              <Button color="inherit">Enter!</Button>
            )}
          </Box>
        )}
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Button/*Link*/} to="/products">
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem button component={Button/*Link*/} to="/contacts">
              <ListItemText primary="Contacts" />
            </ListItem>
            {isLoggedIn ? (
              <>
                <ListItem button component={Button/*Link*/} to="/admin">
                  <ListItemText primary="Admin" />
                </ListItem>
                <ListItem button component={Button/*Link*/} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={() => alert('Logged out')}>
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