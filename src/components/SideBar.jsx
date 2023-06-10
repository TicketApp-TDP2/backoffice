import {
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    Link, Stack, Typography, IconButton, CssBaseline, Toolbar,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {styled, useTheme} from '@mui/material/styles';
import {Link as RouterLink, useLocation} from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import {useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from "@mui/material/Box";

const DRAWER_WIDTH = 225;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })
(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${DRAWER_WIDTH}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: `${DRAWER_WIDTH}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function SideBar() {
    const theme = useTheme();
    const {pathname} = useLocation();
    const [open, setOpen] = useState(false);

    const data = [
      { name: "Métricas", icon: <BarChartIcon />, navigate: '/dashboard' },
      { name: "Ranking Eventos", icon: <EventNoteIcon />, navigate: '/events' },
      { name: "Ranking Organizadores", icon: <AccountCircleIcon />, navigate: '/organizers' },
    ];

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const getList = () => (
      <>
        {data.map((item, index) => (
          <Link
            underline="none"
            component={RouterLink}
            to={item.navigate}
            key={index}
          >
            <ListItem
                key={index}
                selected={pathname === item.navigate}
                sx={{ color: "#fff" }}
            >
              <ListItemIcon
                  sx={{ color: "#fff" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name}/>
            </ListItem>
          </Link>
        ))}
      </>
    );

    return (
      <Box sx={{ display: 'flex' }} mb={5}>
          <CssBaseline />
          <AppBar position="fixed" open={open} sx={{backgroundColor: '#8978C7'}}>
              <Toolbar sx={{justifyContent: "space-between"}}>
                  <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      sx={{ mr: 2, ...(open && { display: 'none' }) }}
                  >
                      <MenuIcon />
                      <Typography variant="h4" ml={3}>
                          {data.find((d) => pathname.includes(d.navigate)).name}
                      </Typography>
                  </IconButton>
                  <Box sx={{ ...(open && { right: 0, position: 'fixed', marginRight: 3 }) }}>
                      <img src="/Logo.png" alt="logo" height={50} />
                  </Box>
              </Toolbar>
          </AppBar>
          <Drawer
            PaperProps={{
              sx: {
                backgroundColor: '#8978C7',
                color: '#fff',
                borderRightStyle: 'dashed',
                width: DRAWER_WIDTH,
              },
            }}
            sx={{
                '&& .Mui-selected, && .Mui-selected:hover': {
                    bgcolor: '#6C5483',
                    border: '1px solid #FFFFFF',
                    borderRadius: '10px'
                }
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
              <DrawerHeader>
                  <Typography sx={{fontWeight: 'bold', mr: 5}}>
                      MENU
                  </Typography>
                  <IconButton onClick={handleDrawerClose}>
                      {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>
              </DrawerHeader>
            {getList()}
            <Link
              underline="none"
              component={RouterLink}
              to="/"
            >
              <Stack direction="row" spacing={2} sx={{ margin: 2, position: 'absolute', bottom: 0 }}>
                <LogoutIcon sx={{ color: "white" }} />
                <Typography color="#fff">Salir</Typography>
              </Stack>
            </Link>
          </Drawer>
      </Box>
    );
}