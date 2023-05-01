import './App.css';
import {
  createHashRouter,
  RouterProvider
} from "react-router-dom";
import { LandingScreen } from './screens/LandingScreen/LandingScreen';
import { EventsRankingScreen } from './screens/EventsRankingScreen/EventsRankingScreen';
//import { OrganizersRankingScreen } from './screens/OrganizersRankingScreen/OrganizersRankingScreen';
//import { ProfileScreen } from './screens/ProfileScreen/ProfileScreen';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import {EventDetailScreen} from "./screens/EventDetailScreen/EventDetailScreen";

const router = createHashRouter([
  {
    path: '/',
    element: <LandingScreen />
  }, {
    path: '/events',
    element: <EventsRankingScreen />
  }, {
    path: '/events/:eventId',
    element: <EventDetailScreen />
  }
]);

/*
, {
    path: '/organizers',
    element: <OrganizersRankingScreen />
  }, {
    path: '/profile',
    element: <ProfileScreen />
  }
*/

const theme = createTheme({
  palette: {
    primary: {
      main: '#61309b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8978C7',
      contrastText: '#fff',
    },
    third: {
        main: '#beb4e8',
        contrastText: '#fff',
    },
    fourth: {
      main: '#94a5dd',
      contrastText: '#fff',
    },
  },
  typography: {
    button: {
      textTransform: 'none'
    },
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
