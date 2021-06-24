import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink } from 'react-router-dom'
import { Button, AppBar, Toolbar, Typography, Link, Box, Menu, MenuItem, IconButton } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Home from './features/home';
import { getloggedUser, loggout, logoutAsync, selectLoggedUser, } from './features/session/sessionSlice';
import './App.scss';
import LoginForm from './features/session/LoginFrom';
import Gallery from './features/gallery';
import React from 'react';
import MoreIcon from '@material-ui/icons/MoreVert';
import LoginRedirect from './features/session/LoginRedirect';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    }
  }))

function App() {
  const classes = useStyles();

  const dispatch = useAppDispatch()
  const user = useAppSelector(selectLoggedUser)
  
  const handleLogout = () => {
    if (user) {
      dispatch(logoutAsync(user.id))
    }
    dispatch(loggout()) 
  }
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {user ? [
        <MenuItem key='logged'>
          <Link color='primary' >
            <Typography>
              {user.username}
            </Typography>
          </Link>
        </MenuItem>,
        <MenuItem key='logout'>
          <Button color='primary' variant='outlined' onClick={handleLogout}>Logout</Button>
        </MenuItem>
      ]
        :
        [
          < MenuItem key='login'>
            <LoginForm />
          </MenuItem>,
          // <MenuItem key='register'>
          //   <RegisterForm />
          // </MenuItem>
        ]
      }
    </Menu >
  );

  useEffect(() => {
    dispatch(getloggedUser())
  }, [dispatch])

  let currentDate = new Date();

  return (
    <>
      <div className="App">
        <Router>
          <AppBar color="transparent">
            <Toolbar >
              <Link color="inherit" component={RouterLink} to="/">
                <Typography variant="h6" color='textSecondary' >
                  randomTartan.com
                </Typography>
              </Link>

              <Box mx={3}>
                <Link color="inherit" component={RouterLink} to="/gallery">
                  <Typography  >
                    Gallery
                  </Typography>
                </Link>
              </Box>
              <Box flexGrow={1} ></Box>
              {user ?
                <>
                  <Box mx={3} className={classes.sectionDesktop}>
                    <Link color='primary' >
                      <Typography>
                        {user.username}
                      </Typography>
                    </Link>
                  </Box>
                  <Button color='primary' variant='outlined' onClick={handleLogout} className={classes.sectionDesktop}>Logout</Button>
                </>
                :
                <>
                  <Box mr={3} className={classes.sectionDesktop}>
                    <LoginForm />
                  </Box>
                  {/* <Box className={classes.sectionDesktop}>
                    <RegisterForm />
                  </Box> */}
                </>}

              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}

          <Switch>
            <Route path="/gallery">
              <Gallery />
            </Route>
            <Route exact path="/redirect" >
              <LoginRedirect />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>

        <footer>
          <Box p={6} className='footer'>
            <p>designed and coded by Yinyin Lu <Button href="mailto:yaralu37@gmail.com">📧</Button> </p>
            <Button color='secondary' href="https://www.buymeacoffee.com/ynynl">
              Buy me a coffee
            </Button>

            <p>🤍</p>
            <Typography>
              Copyright &copy; {currentDate.getFullYear()} Yinyin Lu <br />
            </Typography>
          </Box>
        </footer>
      </div>
    </>
  );
}

export default App;
