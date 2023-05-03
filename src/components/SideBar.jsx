import {
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    Link,
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import { Link as RouterLink, useLocation } from 'react-router-dom';
  import EventNoteIcon from '@mui/icons-material/EventNote';
  import BarChartIcon from '@mui/icons-material/BarChart';
  import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  import LogoutIcon from '@mui/icons-material/Logout';
  import { useContext, useState } from "react";
  
  
  const DRAWER_WIDTH = 225;
  
  const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
  }));
  
  export default function SideBar() {
    const location = useLocation();
  
    const [activeItem, setActiveItem] = useState(null);
  
    const handleItemClick = (index) => {
      setActiveItem(index);
    };
  
    const data = [
      { name: "Ranking Eventos", icon: <EventNoteIcon />, navigate: '/events' },
      { name: "Ranking Organizadores", icon: <AccountCircleIcon />, navigate: '/organizers' },
      { name: "Salir", icon: <LogoutIcon />, navigate: '/' },
    ];
  
    const getList = () => (
      <div style={{ width: 250 }}>
        {data.map((item, index) => (
          <Link
            underline="none"
            component={RouterLink}
            to={item.navigate}
            key={index}
            onClick={() => handleItemClick(index)}
          >
            <ListItem
              key={index}
              sx={{
                backgroundColor: index === activeItem ? '#fff' : 'transparent',
                color: index === activeItem ? '#8978C7' : '#fff',
              }}
            >
              <ListItemIcon
                style={{
                  color: index === activeItem ? '#8978C7' : '#fff',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                style={{
                  color: index === activeItem ? '#8978C7' : '#fff',
                }}
                primary={item.name}
              />
            </ListItem>
          </Link>
        ))}
      </div>
    );
  
    return (
      <>
        <RootStyle>
          <Drawer
            PaperProps={{
              sx: {
                backgroundColor: '#8978C7',
                color: '#fff',
                borderRightStyle: 'dashed',
                width: DRAWER_WIDTH,
              },
            }}
            variant="permanent"
            anchor="left"
            open
          >
            <img src="/Logo2.png" alt="logo" />
            {getList()}
          </Drawer>
        </RootStyle>
      </>
    );
  }
  
  