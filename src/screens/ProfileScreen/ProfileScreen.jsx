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

    useEffect( () => {
      async function fetchData() {
        setIsLoading(true);
        getOrganizer(profileId).then((resp) => {
            setOrganizer(resp.data);
        });
        getComplaintByOrganizer(profileId).then((resp) => {
          setComplaints(resp);
          setIsLoading(false);
        });
      }
      fetchData();
    }, [profileId]);

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
                <Typography variant="h3" my={1} color="primary">{organizer.first_name} {organizer.last_name}</Typography>
                <Divider />
                <Grid container display="flex" justifyContent="space-between" pt={3}>
                    <Grid item>
                        <Typography variant="h5">{organizer.profession}</Typography>
                    </Grid>
                    <Grid item>
                        <ProfileState state={organizer.suspended} />
                    </Grid>
                </Grid>
                <Box>
                  <Grid
                      container
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      paddingTop={5}
                  >
                      <Grid item>
                          <Avatar alt={organizer.first_name} src={organizer.profile_picture} sx={{ width: 200, height: 200 }} />
                      </Grid>
                      <Grid item sx={{ paddingTop: 2, width: '80%'}} mt={2}>
                          {organizer.about_me !== "" && (
                            <Paper elevation={10} sx={{ textAlign: 'left', padding: 2}}>
                                <Typography variant="h5" sx={{marginBottom: 1}}>Sobre mi</Typography>
                                <Typography style={{ wordWrap: "break-word" }}>{organizer.about_me}</Typography>
                            </Paper>
                          )}
                      </Grid>
                      <Grid mt={8} mb={10} sx={{width: '83%'}}>
                        <Typography
                          variant="h5"
                          sx={{ marginRight: 2, marginLeft: 2 }}
                        >
                          <strong>Denuncias</strong>
                        </Typography>
                        {isLoading && (
                          <Box sx={{ display: 'flex', justifyContent: "center", marginTop: 4 }}>
                            <CircularProgress color="primary" />
                          </Box>
                        )}
                        {!isLoading && (
                          <>
                              {complaints.length === 0 && (
                                  <Typography mt={5} ml={2}>
                                      No hay denuncias
                                  </Typography>
                              )}
                              {complaints.map((complaint, idx) => (
                                <>
                                <Typography
                                  variant="h6"
                                  sx={{ marginRight: 2, marginLeft: 2 }}
                                >
                                  {complaint.event}
                                </Typography>
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
                          </>
                        )}
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