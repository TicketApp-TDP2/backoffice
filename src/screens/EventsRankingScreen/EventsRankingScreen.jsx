import { Typography, Grid, Box } from '@mui/material';
import SideBar from '../../components/SideBar';
import { EventsTable } from "../../components/EventsTable";

export const EventsRankingScreen = () => {

  return (
    <>
      <SideBar />
      <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {/*<Grid
            container
            sx={{ alignItems: "center", padding: 2, minHeight: 40 }}
          >
            <Grid item style={{ flexGrow: "1" }}>
              <Typography
                variant="h3"
                sx={{ marginRight: 2, marginLeft: 2 }}
                color="primary"
              >
                Ranking de eventos denunciados
              </Typography>
            </Grid>
          </Grid>*/}
          <EventsTable />
        </Box>
      </Box>
    </>
  );
};
