import SideBar from "../../components/SideBar";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  ImageListItem,
  Paper,
  Typography,
  ImageList,
  Button,
  CircularProgress,
  Modal,
  CardContent,
  CardActions,
  Card,
  Stack,
} from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { getComplaintByEvent, getEvent } from "../../services/eventService";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Timeline from "@mui/lab/Timeline";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import GoogleMap from "google-maps-react-markers";
import Marker from "../../components/MapMarker";
import parse from "html-react-parser";
import { State } from "../../components/State";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { getOrganizer } from "../../services/organizerService";
import { suspendEvent, unsuspendEvent } from "../../services/eventService";

export function EventDetailScreen() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [imagePage, setImagePage] = useState(0);

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [isLoadingSuspensionButton, setIsLoadingSuspensionButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * @description This function is called when the map is ready
   * @param {Object} map - reference to the map instance
   * @param {Object} maps - reference to the maps library
   */
  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    setMapReady(true);
  };

  async function fetchData() {
    getComplaintByEvent(eventId).then((resp) => {
      console.log("complaints", resp);
      setComplaints(resp);
    });
    getEvent(eventId).then((res) => {
      setEvent(res.data);
      getOrganizer(res.data.organizer).then((resp) => {
        setOrganizer(resp.data);
        console.log("Organizer",resp.data);
      });
      console.log("resp", res.data)
    });
  }

  useEffect( () => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, []);

  const handleSuspendEvent = async () => {
    setIsLoadingSuspensionButton(true);
    await suspendEvent(eventId)
      .then((result) => {
        setIsLoadingSuspensionButton(false);
        Swal.fire({
          title: '¡Éxito!',
          text: 'El evento se ha suspendido correctamente',
          icon: 'success',
          confirmButtonColor: 'green',
        }).then(function() {
          navigate("/events");
        });
        console.log("response", result);
      })
      .catch((error) => {
        setIsLoadingSuspensionButton(false);
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

  const handleUnsuspendEvent = async () => {
    setIsLoadingSuspensionButton(true);
    await unsuspendEvent(eventId)
      .then((result) => {
        setIsLoadingSuspensionButton(false);
        Swal.fire({
          title: '¡Éxito!',
          text: 'El evento se ha desuspendido correctamente',
          icon: 'success',
          confirmButtonColor: 'green',
        }).then(function() {
          navigate("/events");
        });
        console.log("response", result);
      })
      .catch((error) => {
        setIsLoadingSuspensionButton(false);
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

  const prevImagePage = () => {
    if (imagePage !== 0) {
      setImagePage(imagePage - 1);
    }
  };

  const nextImagePage = () => {
    if (imagePage !== Math.ceil((event.images.length - 1) / 3)) {
      setImagePage(imagePage + 1);
    }
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
      <SideBar />
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: "center" }}>
          <CircularProgress color="primary" />
          <Typography>HOLAAAAAAAAAAAAAAAA</Typography>
        </Box>
      )}
      {event && !isLoading &&(
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid item style={{ flexGrow: "1" }}>
            <Typography variant="h3" sx={{ marginRight: 2 }}>
              {event.name}
            </Typography>
            <hr />
          </Grid>
          <Paper
            style={{
              backgroundColor: "white",
              borderRadius: 20,
            }}
          >
            <Box sx={{ display: "flex" , marginLeft: 3, paddingTop: 3}}>
              <Grid>
                <Grid container justifyContent="flex-end" sx={{paddingRight: 3}}>
                  <State state={event.state}></State>
                </Grid>
                <Grid mt={5} mb={5} mr={3}>
                  {organizer && (
                  <Card variant="outlined" sx={{backgroundColor: "#f3f1fc"}}>
                    <CardContent>
                      <Stack direction="row" spacing={2}>
                        <Stack>
                          <Typography>
                            Organizador
                          </Typography>
                          <Avatar alt="organizador" src={organizer.profile_picture} sx={{ width: 100 , height: 100, marginTop: 2 }}/>
                        </Stack>
                        <Stack alignContent={"center"}>
                          <Typography >
                            {organizer.first_name} {organizer.last_name} - {organizer.profession}
                          </Typography>
                          <Typography sx={{marginTop: 2}}>
                            Sobre mi
                          </Typography>
                          <Typography>
                            {organizer.about_me}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Button size="large" onClick={() => navigate(`/profile/${organizer.id}`)}>Ver perfil</Button>
                    </CardActions>
                  </Card>
                  )}
                </Grid>
                <Grid mt={5} mb={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    <strong>Denuncias</strong>
                  </Typography>
                  {complaints.length === 0 && (
                    <strong>Vacio</strong>
                  )}
                  {complaints.map((complaint, idx) => (
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
                        <Typography color="white">Denuncia de {complaint.complainer_name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#e0e0e0" }}>
                        <Typography>Motivo: {complaint.type}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Grid>
                <Grid container justifyContent="flex-end" sx={{paddingRight: 3}}>
                  {!isLoadingSuspensionButton && event.state !== "Suspendido" && (
                    <Button
                      variant="contained"
                      size="large"
                      color="error"
                      onClick={handleSuspendEvent}
                    >
                      Suspender Evento
                    </Button>
                  )}
                  {!isLoadingSuspensionButton && event.state === "Suspendido" && (
                    <Button
                      variant="contained"
                      size="large"
                      color="error"
                      onClick={handleUnsuspendEvent}
                    >
                      Desuspender Evento
                    </Button>
                  )}
                  {isLoadingSuspensionButton && <CircularProgress color="primary" />}
                </Grid>
                <Grid>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}
                    >
                      <strong>Fecha:</strong> {event.date}
                    </Typography>
                  </div>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}
                  >
                    <strong>Vacantes:</strong> {event.vacants}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}
                  >
                    <strong>Tipo:</strong> {event.type}
                  </Typography>
                </Grid>
                <Grid mt={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    <strong>Descripción</strong>
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    {parse(event.description)}
                  </Typography>
                </Grid>
                <Grid mt={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    <strong>Fotos</strong>
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 20,
                    }}
                  >
                    {event.images.length > 3 && imagePage > 0 && (
                      <Box>
                        <ChevronLeftIcon onClick={() => prevImagePage()} />
                      </Box>
                    )}
                    <ImageList cols={3} gap={20}>
                      {event.images
                        .slice(imagePage * 3, imagePage * 3 + 3)
                        .map((item, idx) => (
                          <ImageListItem key={idx}>
                            <img
                              src={`${item}?w=164&h=164&fit=crop&auto=format`}
                              alt=""
                              srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                              loading="lazy"
                              style={{
                                borderRadius: 10,
                                width: 250,
                                height: 250,
                              }}
                            />
                          </ImageListItem>
                        ))}
                    </ImageList>
                    {event.images.length > 3 &&
                      event.images.length > 3 * (imagePage + 1) && (
                        <Box>
                          <ChevronRightIcon onClick={() => nextImagePage()} />
                        </Box>
                      )}
                  </Box>
                </Grid>
                <Grid mt={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2, marginBottom: 1 }}
                  >
                    <strong>Ubicación</strong>
                  </Typography>
                  <Grid sx={{paddingLeft: 2}}>
                    <GoogleMap
                      apiKey={process.env.REACT_APP_GEO_APIKEY}
                      defaultCenter={{
                        lat: event.location.lat,
                        lng: event.location.lng,
                      }}
                      defaultZoom={15}
                      mapMinHeight="50vh"
                      onGoogleApiLoaded={onGoogleApiLoaded}
                    >
                      <Marker
                        key={1}
                        lat={event.location.lat}
                        lng={event.location.lng}
                        markerId={event.location.description}
                        className="marker"
                      />
                    </GoogleMap>
                  </Grid>
                </Grid>
                <Grid mt={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    <strong>Agenda</strong>
                  </Typography>
                  {event.agenda.map((horario, idx) => (
                    <Timeline
                      sx={{
                        [`& .${timelineOppositeContentClasses.root}`]: {
                          flex: 0.2,
                        },
                      }}
                    >
                      <TimelineItem>
                        <TimelineOppositeContent color="textSecondary">
                          {horario.time_init.substring(0, 5)} -{" "}
                          {horario.time_end.substring(0, 5)}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          {event.agenda.length - 1 !== idx && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>{horario.title}</TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  ))}
                </Grid>
                <Grid mt={5} mb={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    <strong>FAQs</strong>
                  </Typography>
                  {event.FAQ.map((faq, idx) => (
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
                        <Typography color="white">{faq.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#e0e0e0" }}>
                        <Typography>{faq.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
