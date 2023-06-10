import SideBar from '../../components/SideBar';
import { Typography, Box, Divider, Grid, Avatar, Paper, CircularProgress, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import {useState, useEffect, useContext} from "react";
import { getOrganizer } from "../../services/organizerService"
import { useParams } from "react-router-dom";
import { suspendOrganizer, unsuspendOrganizer, getComplaintByOrganizer } from '../../services/organizerService';
import Swal from 'sweetalert2';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { ProfileState } from '../../components/ProfileState';
import {getEventsByOrganizer, getUsersEnrolled} from "../../services/eventService";
import {
    cancelScheduledNotificationsForEvent,
    rescheduleNotificationsForEvent,
    sendNotification
} from "../../services/pushService";
import {ref} from "firebase/database";
import {MobileNotificationsContext} from "../../index";
import moment from "moment";

export const ProfileScreen = () => {
    const { profileId } = useParams();
    const [organizer, setOrganizer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [createdEvents, setCreatedEvents] = useState(0);
    const [publishedEvents, setPublishedEvents] = useState(0);
    const navigate = useNavigate();
    const notificationsContext = useContext(MobileNotificationsContext);

    useEffect( () => {
      if (!localStorage.getItem('logged')) {
        navigate('/');
        return;
      }
      async function fetchData() {
        setIsLoading(true);
        getOrganizer(profileId).then((resp) => {
            setOrganizer(resp.data);
        });
        getComplaintByOrganizer(profileId).then((resp) => {
          setComplaints(resp);
          setIsLoading(false);
        });
        getEventsByOrganizer(profileId).then((resp) => {
            const data = resp.data;
            setCreatedEvents(data.length);
            const published = data.filter((e) => e.state === 'Publicado');
            setPublishedEvents(published.length);
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
            getEventsByOrganizer(profileId).then(async (result) => {
                for (const event of result.data) {
                    const title = "Información importante";
                    const body = `El evento ${event.name} ha sido suspendido.`;
                    const users = await getUsersEnrolled(event.id);
                    users.forEach((userId) => {
                        console.log("sending to", userId);
                        sendNotification(title, body, userId);
                    })
                    cancelScheduledNotificationsForEvent(ref(notificationsContext.db), event.id);
                }
            })
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

    async function scheduleReminder(event) {
        const eventStartTime = moment(event.date + ' ' + event.start_time);
        const dayBeforeEvent = eventStartTime.subtract(1, 'days');
        const sendAt = dayBeforeEvent.toString()
        rescheduleNotificationsForEvent(ref(notificationsContext.db), event.id, sendAt, event.name)
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
              getEventsByOrganizer(profileId).then(async (result) => {
                  for (const event of result.data) {
                      const title = "Información importante";
                      const body = `El evento ${event.name} ha sido habilitado nuevamente.`;
                      const users = await getUsersEnrolled(event.id);
                      users.forEach((userId) => {
                          console.log("sending to", userId);
                          sendNotification(title, body, userId);
                      })
                      scheduleReminder(event);
                  }
              })
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
      <SideBar/>
    <Box sx={{ display: 'flex' }}>
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
                                <Typography variant="h5" sx={{marginBottom: 1}}>Descripción personal</Typography>
                                <Typography style={{ wordWrap: "break-word" }}>{organizer.about_me}</Typography>
                            </Paper>
                          )}
                      </Grid>
                      <Grid mt={8} sx={{width: '80%'}}>
                          <Typography variant="h6" sx={{marginBottom: 1}}>Email registrado: {organizer.email}</Typography>
                          <Typography variant="h6" sx={{marginBottom: 1}}>Cantidad de eventos creados: {createdEvents}</Typography>
                          <Typography variant="h6" sx={{marginBottom: 1}}>Cantidad de eventos publicados: {publishedEvents}</Typography>
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