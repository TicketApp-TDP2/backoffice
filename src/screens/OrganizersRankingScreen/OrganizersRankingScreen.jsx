import { Typography, Grid, Box } from '@mui/material';
import SideBar from '../../components/SideBar';
import { OrganizersTable } from "../../components/OrganizersTable";

export const OrganizersRankingScreen = () => {

  return (
    <>
      <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            sx={{ alignItems: "center", padding: 2, minHeight: 40 }}
          >
            <Grid item style={{ flexGrow: "1" }}>
              <Typography
                variant="h3"
                sx={{ marginRight: 2, marginLeft: 2 }}
                color="primary"
              >
                Ranking de organizadores denunciados
              </Typography>
            </Grid>
          </Grid>
          <OrganizersTable />
        </Box>
      </Box>
    </>
  );
};
