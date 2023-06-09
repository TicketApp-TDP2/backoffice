import { Grid, Box, CircularProgress, Stack } from '@mui/material';
import { Button, Typography } from "@mui/material";
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

const defaultLineData = {
  labels:[['Enero', '2022'], 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
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
  const [eventsData, setEventsData] = useState(defaultLineData);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState(lastyear);
  const [endDate, setEndDate] = useState(today);

  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    let new_date = date.toLocaleString('es-AR', {
      month: 'long',
    });
    new_date = new_date.charAt(0).toUpperCase() + new_date.slice(1);
    return new_date;
  }

  function dateRange(start_date, end_date) {
    var start      = start_date.split('-');
    var end        = end_date.split('-');
    var startYear  = parseInt(start[0]);
    var endYear    = parseInt(end[0]);
    var dates      = [];
    for(var i = startYear; i <= endYear; i++) {
      var endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1])-1 : 0;
      for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
        var month = j+1;
        var displayMonth = month < 10 ? '0'+month : month;
        dates.push([i, displayMonth, '01'].join('-'));
      }
    }
    return dates;
  }

  function setPieChartData(res) {
    const newData = [];
    const values = [];
    values.push(res.data.event_states["Borrador"]);
    values.push(res.data.event_states["Publicado"]);
    values.push(res.data.event_states["Finalizado"]);
    values.push(res.data.event_states["Cancelado"]);
    values.push(res.data.event_states["Suspendido"]);
    let sum = values.reduce(function(a, b){
      return a + b;
    });
    if (sum === 0) {
      console.log("newData vacio", newData);
      setPieData({...pieData, datasets: [{...pieData.datasets[0], data: newData}]});
    }
    else {
      newData.push(res.data.event_states["Borrador"]);
      newData.push(res.data.event_states["Publicado"]);
      newData.push(res.data.event_states["Finalizado"]);
      newData.push(res.data.event_states["Cancelado"]);
      newData.push(res.data.event_states["Suspendido"]);
      console.log("newData", newData);
      setPieData({...pieData, datasets: [{...pieData.datasets[0], data: newData}]});
    }
  }

  function setBarChartData(res, start_date, end_date) {
    console.log("start_date", start_date);
    console.log("end_date", end_date);
    const months = dayjs(end_date).diff(start_date, 'month');
    const newData = Array(months + 1).fill(0);
    const dates = dateRange(start_date, end_date);
    const newLabels = [];
    dates.forEach(date => {
      const month = date.split("-")[1];
      const newLabel = [];
      newLabel.push(getMonthName(month));
      newLabel.push(date.split("-")[0]);
      newLabels.push(newLabel);
      res.data.verified_bookings.forEach(booking => {
        if (date.substring(0, 7) === booking.date) {
          newData[dates.indexOf(date)] = booking.bookings;
        }
      });
    });
    console.log("newBarData", newData);
    setBarData({...barData, labels: newLabels, datasets: [{...barData.datasets[0], data: newData}]});
  }

  function setSuspendedChartData(res, start_date, end_date) {
    const months = dayjs(end_date).diff(start_date, 'month');
    console.log("months suspended", months);
    const newData = Array(months + 1).fill(0);
    console.log("newData ceros suspended", newData);
    const dates = dateRange(start_date, end_date);
    const newLabels = [];
    dates.forEach(date => {
      const month = date.split("-")[1];
      const newLabel = [];
      newLabel.push(getMonthName(month));
      newLabel.push(date.split("-")[0]);
      newLabels.push(newLabel);
      res.data.suspended_by_time.forEach(suspention => {
        if (date.substring(0, 7) === suspention.date) {
          newData[dates.indexOf(date)] = suspention.suspended;
        }
      });
    });
    console.log("newSuspendedData", newData);
    setSuspendedData({...suspendedData, labels: newLabels, datasets: [{...suspendedData.datasets[0], data: newData}]});
  }

  function setComplaintChartData(res, start_date, end_date) {
    const months = dayjs(end_date).diff(start_date, 'month');
    const newData = Array(months + 1).fill(0);
    const dates = dateRange(start_date, end_date);
    const newLabels = [];
    dates.forEach(date => {
      const month = date.split("-")[1];
      const newLabel = [];
      newLabel.push(getMonthName(month));
      newLabel.push(date.split("-")[0]);
      newLabels.push(newLabel);
      res.data.complaints_by_time.forEach(complaint => {
        if (date.substring(0, 7) === complaint.date) {
          newData[dates.indexOf(date)] = complaint.complaints;
        }
      });
    });
    console.log("newComplaintData", newData);
    setComplaintData({...complaintData, labels: newLabels, datasets: [{...complaintData.datasets[0], data: newData}]});
  }

  function setEventsChartData(res, start_date, end_date) {
    const months = dayjs(end_date).diff(start_date, 'month');
    const newEventsData = Array(months + 1).fill(0);
    const newEventsPublishedData = Array(months + 1).fill(0);
    const dates = dateRange(start_date, end_date);
    const newLabels = [];
    dates.forEach(date => {
      const month = date.split("-")[1];
      const newLabel = [];
      newLabel.push(getMonthName(month));
      newLabel.push(date.split("-")[0]);
      newLabels.push(newLabel);
      res.data.events_by_time.forEach(event => {
        if (date.substring(0, 7) === event.date) {
          newEventsData[dates.indexOf(date)] = event.events;
        }
      });
      res.data.events_published_by_time.forEach(event => {
        if (date.substring(0, 7) === event.date) {
          newEventsPublishedData[dates.indexOf(date)] = event.events;
        }
      });
    });
    console.log("newEventsData", newEventsData);
    setEventsData({...eventsData, labels: newLabels, datasets: [{...eventsData.datasets[0], data: newEventsData}, {...eventsData.datasets[1], data: newEventsPublishedData}]});
  }

  useEffect(() => {
    console.log("use effect");
    async function fetchData() {
      setIsLoading(true);
      const start_date = startDate.toISOString().substring(0, 10);
      const end_date = endDate.toISOString().substring(0, 10);
      getStats({ start_date, end_date }).then((res) => {
        console.log("response", res.data);
        setPieChartData(res);
        setRows(res.data.top_organizers);
        setBarChartData(res, start_date, end_date);
        setSuspendedChartData(res, start_date, end_date);
        setComplaintChartData(res, start_date, end_date);
        setEventsChartData(res, start_date, end_date);
        setIsLoading(false);
      });
    }
    fetchData();
  }, []);

  const handleFilter = async () => {
    setIsLoading(true);
    const start_date = startDate.toISOString().substring(0, 10);
    const end_date = endDate.toISOString().substring(0, 10);
    getStats({ start_date, end_date }).then((res) => {
      console.log("response filter", res.data);
      setPieChartData(res);
      setRows(res.data.top_organizers);
      setBarChartData(res, start_date, end_date);
      setSuspendedChartData(res, start_date, end_date);
      setComplaintChartData(res, start_date, end_date);
      setIsLoading(false);
    });
  }

  return (
    <>
      <SideBar />
      <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Grid container sx={{mt: 3, mb: 2}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={1}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Desde:
                </Typography>
              </Grid>
              <Grid item xs>
              <DatePicker
                label="Fecha"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                disableFuture
                sx={{width: "50%", pr:2}}
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
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="DD/MM/YYYY"
                  disableFuture
                  sx={{width: "50%", pr:2}}
                />
              </Grid>
            </LocalizationProvider>
            <Button variant="contained" size="large" onClick={handleFilter} >
              Filtrar
            </Button>
          </Grid>
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
                    <DoubleLineChart doubleLineData={eventsData}/>
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
