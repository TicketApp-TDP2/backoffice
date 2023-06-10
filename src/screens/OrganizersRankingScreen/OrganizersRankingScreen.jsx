import { Typography, Grid, Box } from '@mui/material';
import SideBar from '../../components/SideBar';
import { OrganizersTable } from "../../components/OrganizersTable";

export const OrganizersRankingScreen = () => {
  return (
    <>
      <SideBar />
      <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <OrganizersTable />
        </Box>
      </Box>
    </>
  );
};
