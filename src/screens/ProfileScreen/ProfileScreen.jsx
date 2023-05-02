import SideBar from '../../components/SideBar';
import { Typography, Box, Divider, Grid, Avatar, Paper } from '@mui/material';
import { useState, useEffect } from "react";
import { getOrganizer } from "../../services/organizerService"
import { useParams } from "react-router-dom";

export const ProfileScreen = () => {
    const { profileId } = useParams();
    const [organizer, setOrganizer] = useState(null);
    
    async function fetchData() {
        getOrganizer(profileId).then((resp) => {
            setOrganizer(resp.data);
            console.log("Organizer",resp.data);
        });
    }
    
    useEffect( () => {
        fetchData();
    }, []);
  
  return <>
    <Box sx={{ display: 'flex' }}>
      <SideBar/>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
        {organizer && (
            <>
            <Grid container sx={{ alignItems: "center", padding: 2, minHeight:40 }}>
                <Grid item style={{ flexGrow: "1" }}>
                <Typography variant="h3" sx={{ marginRight: 2}} color="primary">{organizer.first_name} {organizer.last_name}</Typography>
                </Grid>
            </Grid>
            <Divider variant="middle"/>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}>{organizer.profession}</Typography>
              <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              paddingTop={10}
              >
                  <Grid item>
                      <Avatar alt={organizer.first_name} src={organizer.profile_picture} sx={{ width: 350, height: 350 }} />
                  </Grid>
                  <Grid item sx={{ paddingTop: 2}}>
                      <Paper elevation={10} sx={{ textAlign: 'center', backgroundColor: "#8978C7", lineHeight: '30px', padding: 2, width: "90%"}}>
                          <Typography variant="h4" color="#fff" sx={{marginBottom: 1}}>Sobre mi</Typography>
                          <Typography color="#fff">{organizer.about_me}</Typography>
                      </Paper>
                  </Grid>
              </Grid>
            </Box>
            </>
        )}
        </Box>
    </Box>
  </>
}