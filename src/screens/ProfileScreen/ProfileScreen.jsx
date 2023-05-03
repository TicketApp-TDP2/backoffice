import SideBar from '../../components/SideBar';
import { Typography, Box, Divider, Grid, Avatar, Paper, CircularProgress, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useState, useEffect } from "react";
import { getOrganizer } from "../../services/organizerService"
import { useParams } from "react-router-dom";
import { suspendOrganizer, unsuspendOrganizer, getComplaintByOrganizer } from '../../services/organizerService';
import Swal from 'sweetalert2';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { ProfileState } from '../../components/ProfileState';

export const ProfileScreen = () => {
    const { profileId } = useParams();
    const [organizer, setOrganizer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const navigate = useNavigate();

    
    async function fetchData() {
      getOrganizer(profileId).then((resp) => {
          setOrganizer(resp.data);
          console.log("Organizer",resp.data);
      });
      setIsLoading(true);
      getComplaintByOrganizer(profileId).then((resp) => {
        setComplaints(resp.data);
        console.log("Complaints",resp.data);
      });
      setIsLoading(false);
    }
    
    useEffect( () => {
        fetchData();
    }, []);

    const handleSuspendOrganizer = async () => {
        setIsLoadingButton(true);
        await suspendOrganizer(profileId)
          .then((result) => {
            setIsLoadingButton(false);
            Swal.fire({
              title: '¡Éxito!',
              text: 'El organizador se ha suspendido correctamente',
              icon: 'success',
              confirmButtonColor: 'green',
            }).then(function() {
              navigate("/organizers");
            });
            console.log("response", result);
          })
          .catch((error) => {
            setIsLoadingButton(false);
            let errorText = "Ocurrió un error."
            errorText = errorText.concat(` ${error.response.data.detail}`);
            Swal.fire({
              title: '¡Error!',
              text: errorText,
              icon: 'error',
              confirmButtonColor: 'red',
            });
            console.log("publish error", error);
          });
    }

    const handleUnsuspendOrganizer = async () => {
        setIsLoadingButton(true);
        await unsuspendOrganizer(profileId)
          .then((result) => {
            setIsLoadingButton(false);
            Swal.fire({
              title: '¡Éxito!',
              text: 'El organizador se ha desuspendido correctamente',
              icon: 'success',
              confirmButtonColor: 'green',
            }).then(function() {
              navigate("/organizers");
            });
            console.log("response", result);
          })
          .catch((error) => {
            setIsLoadingButton(false);
            let errorText = "Ocurrió un error."
            errorText = errorText.concat(` ${error.response.data.detail}`);
            Swal.fire({
              title: '¡Error!',
              text: errorText,
              icon: 'error',
              confirmButtonColor: 'red',
            });
            console.log("publish error", error);
          });
      }
  
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
            <Grid container justifyContent="flex-end" sx={{paddingRight: 3, paddingTop: 3}}>
              <ProfileState state={organizer.state} />
            </Grid>
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
                  <Grid mt={5} mb={5}>
                    <Typography
                      variant="h6"
                      sx={{ marginRight: 2, marginLeft: 2 }}
                    >
                      <strong>Denuncias</strong>
                    </Typography>
                    {isLoading && (
                      <Box sx={{ display: 'flex', justifyContent: "center", marginTop: 4 }}>
                        <CircularProgress color="primary" />
                      </Box>
                    )}
                    {complaints.map((complaint, idx) => (
                      <>
                      <strong>{complaint.event}</strong>
                      <Accordion style={{ margin: 10 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          sx={{
                            backgroundColor: "#8978C7",
                            borderRadius: 1,
                          }}
                        >
                          <Typography color="white">Denuncia de {complaint.complainer}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: "#e0e0e0" }}>
                          <Typography>Motivo: {complaint.type}</Typography>
                        </AccordionDetails>
                      </Accordion>
                      </>
                    ))}
                  </Grid>
                  <Grid item sx={{ paddingTop: 2}}>
                  {!isLoadingButton && !organizer.suspended && (
                    <Button
                      variant="contained"
                      size="large"
                      color="error"
                      onClick={handleSuspendOrganizer}
                    >
                      Suspender Organizador
                    </Button>
                  )}
                  {!isLoadingButton && organizer.suspended && (
                    <Button
                      variant="contained"
                      size="large"
                      color="error"
                      onClick={handleUnsuspendOrganizer}
                    >
                      Desuspender Organizador
                    </Button>
                  )}
                  {isLoadingButton && <CircularProgress color="primary" />}
                </Grid>
              </Grid>
            </Box>
            </>
        )}
        </Box>
    </Box>
  </>
}