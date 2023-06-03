import { Typography, Grid, Box, CardContent, Card, CircularProgress, Stack } from '@mui/material';
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
import { DoubleLineChart } from '../../components/DoubleLineChart';
import { LineChart } from '../../components/LineChart';
import { BarChart } from '../../components/BarChart';

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
      label: 'cant de eventos',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const doubleLineData = {
  labels:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Denuncias',
      data: [65, 59, 80, 81, 56, 55, 40, 12, 34, 56, 78, 90],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Suspenciones',
      data: [28, 48, 40, 19, 86, 27, 90, 12, 38, 26, 78, 52],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const lineData = {
  labels:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Cantidad de eventos',
      data: [3, 23, 42, 45, 53, 55, 63, 67, 73, 79, 85, 90],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};

const barData = {
  labels:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Cantidad de eventos',
      data: [3, 23, 42, 45, 53, 55, 63, 67, 73, 79, 85, 90],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};

const today = dayjs();
const lastyear = today.subtract(1, 'year');
console.log("today", today.toISOString().substring(0, 10));
console.log("lastyear", lastyear.toISOString().substring(0, 10));

export const DashboardScreen = () => {
  const [pieData, setPieData] = useState(defaultPieData);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    console.log("use effect");
    async function fetchData() {
      setIsLoading(true);
      const start_date = lastyear.toISOString().substring(0, 10);
      const end_date = today.toISOString().substring(0, 10);
      getStats({ start_date, end_date }).then((res) => {
          console.log("response", res.data);
          const newData=[];
          newData.push(res.data.event_states["Borrador"]);
          newData.push(res.data.event_states["Publicado"]);
          newData.push(res.data.event_states["Finalizado"]);
          newData.push(res.data.event_states["Cancelado"]);
          newData.push(res.data.event_states["Suspendido"]);
          console.log("newData", newData);
          setPieData({...pieData, datasets: [{...pieData.datasets[0], data: newData}]});
          setRows(res.data.top_organizers);
          setIsLoading(false);
      });
    }
    fetchData();
  }, []);

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
                Métricas
              </Typography>
            </Grid>
          </Grid>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: "center", marginTop: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          )}
          {!isLoading && (
            <>
            <Stack direction="row" spacing={2} sx={{ marginTop: 4 }}>
              <PieChart pieData={pieData}/>
              <DoubleLineChart doubleLineData={doubleLineData}/>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginTop: 4 }}>
              <TopOrganizersTable rows={rows}/>
                <LineChart lineData={lineData}/>
                
            </Stack>
            {/*<BarChart barData={barData}/>*/}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};
