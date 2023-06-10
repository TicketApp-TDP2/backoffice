import { Typography, Grid, Box } from '@mui/material';
import SideBar from '../../components/SideBar';
import { EventsTable } from "../../components/EventsTable";

export const EventsRankingScreen = () => {

  return (
    <>
      <SideBar />
      <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <EventsTable />
        </Box>
      </Box>
    </>
  );
};
