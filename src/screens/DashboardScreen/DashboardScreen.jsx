import { IconButton, Grid, Box, CircularProgress, Stack } from '@mui/material';
import { Button, Typography, Divider, Modal } from "@mui/material";
import SideBar from '../../components/SideBar';
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title, } from 'chart.js';
import { useState, useEffect } from "react";
import { getStats } from '../../services/statsService';
import { TopOrganizersTable } from '../../components/TopOrganizersTable';
import dayjs from 'dayjs';
import { PieChart } from '../../components/PieChart';
import { LineChart } from '../../components/LineChart';
import { BarChart } from '../../components/BarChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DoubleLineChart } from '../../components/DoubleLineChart';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const defaultPieData = {
  labels: ['Borrador', 'Publicado', 'Finalizado', 'Cancelado', 'Suspendido'],
  datasets: [
    {
      label: 'Cantidad de eventos',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(138,137,136,0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgb(136,136,132)',
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const defaultComplaintData = {
  labels:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Denuncias',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 1)',
    }
  ],
};

const defaultSuspendedData = {
  labels:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Suspensiones',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: 'rgba(255, 159, 64, 1)',
      backgroundColor: 'rgba(255, 159, 64, 1)',
    }
  ],
};

const lineData = {
  labels:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Cantidad de eventos',
      data: [3, 23, 42, 45, 53, 55, 63, 67, 73, 79, 85, 90],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 1)',
    },
    {
      label: 'Cantidad de eventos publicados',
      data: [3, 23, 34, 39, 53, 61, 63, 67, 75, 80, 81, 92],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 1)',
    }
  ],
};

const defaultBarData = {
  labels:['', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Cantidad de usuarios acreditados',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: '#8978C7',
    }
  ],
};

const today = dayjs();
const lastyear = today.subtract(1, 'year');
console.log("today", today.toISOString().substring(0, 10));
console.log("lastyear", lastyear.toISOString().substring(0, 10));

export const DashboardScreen = () => {
  const [pieData, setPieData] = useState(defaultPieData);
  const [barData, setBarData] = useState(defaultBarData);
  const [suspendedData, setSuspendedData] = useState(defaultSuspendedData);
  const [complaintData, setComplaintData] = useState(defaultComplaintData);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  }
  const handleCloseModal = () => {
    setOpenModal(false);
  }

  function setPieChartData(res) {
    const newData = [];
    newData.push(res.data.event_states["Borrador"]);
    newData.push(res.data.event_states["Publicado"]);
    newData.push(res.data.event_states["Finalizado"]);
    newData.push(res.data.event_states["Cancelado"]);
    newData.push(res.data.event_states["Suspendido"]);
    console.log("newData", newData);
    setPieData({...pieData, datasets: [{...pieData.datasets[0], data: newData}]});
  }

  function setBarChartData(res, group_by) {
    if (group_by === "month") {
      const newData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //El array deberia tener el tamaño segun la cantidad de meses que hay entre el start_date y el end_date
      res.data.verified_bookings.forEach(booking => {
        const month = booking.date.split("-")[1];
        if (month[0] === "0") {
          newData[parseInt(month[1])-1] = booking.bookings;
        }
        else {
          newData[parseInt(month)-1] = booking.bookings;
        }
      });
      console.log("newBarData", newData);
      setBarData({...barData, datasets: [{...barData.datasets[0], data: newData}]});
    }
  }

  function setSuspendedChartData(res, group_by) {
    if (group_by === "month") {
      const newData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //El array deberia tener el tamaño segun la cantidad de meses que hay entre el start_date y el end_date
      res.data.suspended_by_time.forEach(suspention => {
        const month = suspention.date.split("-")[1];
        if (month[0] === "0") {
          newData[parseInt(month[1])-1] = suspention.suspended;
        }
        else {
          newData[parseInt(month)-1] = suspention.suspended;
        }
      });
      console.log("newSuspendedData", newData);
      setSuspendedData({...suspendedData, datasets: [{...suspendedData.datasets[0], data: newData}]});
    }
  }

  function setComplaintChartData(res, group_by) {
    if (group_by === "month") {
      const newData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //El array deberia tener el tamaño segun la cantidad de meses que hay entre el start_date y el end_date
      res.data.complaints_by_time.forEach(complaint => {
        const month = complaint.date.split("-")[1];
        if (month[0] === "0") {
          newData[parseInt(month[1])-1] = complaint.complaints;
        }
        else {
          newData[parseInt(month)-1] = complaint.complaints;
        }
      });
      console.log("newSuspendedData", newData);
      setComplaintData({...complaintData, datasets: [{...complaintData.datasets[0], data: newData}]});
    }
  }

  useEffect(() => {
    console.log("use effect");
    async function fetchData() {
      setIsLoading(true);
      const start_date = lastyear.toISOString().substring(0, 10);
      const end_date = today.toISOString().substring(0, 10);
      const group_by = "month";
      getStats({ start_date, end_date, group_by }).then((res) => {
        console.log("response", res.data);
        setPieChartData(res);
        setBarChartData(res, group_by);
        setSuspendedChartData(res, group_by);
        setComplaintChartData(res, group_by);
        setRows(res.data.top_organizers);
        setIsLoading(false);
      });
    }
    fetchData();
  }, []);

  const ModalFilter = () => {
    const [initialDate, setInitialDate] = useState(lastyear);
    const [finalDate, setFinalDate] = useState(today);

    const handleFilter = async () => {
      /*handleCloseModal();
      setIsLoading(true);
      const start_date = initialDate.toISOString().substring(0, 10);
      const end_date = finalDate.toISOString().substring(0, 10);
      const group_by = "month";
      getStats({ start_date, end_date, group_by }).then((res) => {
        console.log("response", res.data);
        setPieChartData(res);
        setBarChartData(res, group_by);
        setSuspendedChartData(res, group_by);
        setComplaintChartData(res, group_by);
        setRows(res.data.top_organizers);
        setIsLoading(false);
      });*/
    }

    return(
    <>
      <Grid container justifyContent="flex-end" sx={{paddingRight: 3}}>
        <Typography marginRight={2} marginTop={2}>Desde: {initialDate.toISOString().substring(0, 10)}</Typography>
        <Typography marginRight={2} marginTop={2}>Hasta: {finalDate.toISOString().substring(0, 10)}</Typography>
        <IconButton aria-label="delete" color="primary" size="large" onClick={handleOpenModal}>
          <FilterListIcon />
        </IconButton>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 2
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Filtro por fecha
          </Typography>
          <Divider/>
          <Grid container sx={{mt: 2}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={1}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Desde:
                </Typography>
              </Grid>
              <Grid item xs>
              <DatePicker
                label="Fecha"
                value={initialDate}
                onChange={(newValue) => setInitialDate(newValue)}
                format="DD/MM/YYYY"
                disableFuture
                sx={{width: "95%", pr:2}}
                />
              </Grid>
              <Grid item xs={1}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Hasta:
                </Typography>
              </Grid>
              <Grid item xs>
                <DatePicker
                  label="Fecha"
                  value={finalDate}
                  onChange={(newValue) => setFinalDate(newValue)}
                  format="DD/MM/YYYY"
                  disableFuture
                  sx={{width: "95%", pr:2}}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button variant="contained" size="large" onClick={handleFilter} >
              Filtrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
    );
  }

  return (
    <>
      <SideBar />
      <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <ModalFilter/>
            {/*
            <Grid item style={{ flexGrow: "1" }}>
              <Typography
                variant="h3"
                sx={{ marginRight: 2, marginLeft: 2 }}
                color="primary"
              >
                Métricas
              </Typography>
            </Grid>
            */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: "center", marginTop: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          )}
          {!isLoading && (
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Stack spacing={2} sx={{ width: '100%' }}>
                    <LineChart lineData={complaintData} name={"Cantidad de denuncias en el tiempo"}/>
                    <LineChart lineData={suspendedData} name={"Cantidad de suspensiones en el tiempo"}/>
                    <DoubleLineChart doubleLineData={lineData}/>
                    <BarChart barData={barData}/>
                  </Stack>
                </Grid>
                <Grid item xs={4}>
                  <Stack spacing={2}>
                    <PieChart pieData={pieData}/>
                    <TopOrganizersTable rows={rows}/>
                  </Stack>
                </Grid>
              </Grid>
          )}
        </Box>
      </Box>
    </>
  );
};
