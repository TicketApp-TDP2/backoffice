import {Typography, Box, CardContent, Card, Stack} from '@mui/material';
import Paper from "@mui/material/Paper";
import { Pie } from 'react-chartjs-2';

export const PieChart = (props) => {
    const { pieData } = props;
    const total = pieData.datasets[0].data.slice(0,5).reduce((acc, current) => acc + current, 0);
    const states = {
        borrador: pieData.datasets[0].data[0]/total*100,
        publicado: pieData.datasets[0].data[1]/total*100,
        finalizado: pieData.datasets[0].data[2]/total*100,
        cancelado: pieData.datasets[0].data[3]/total*100,
        suspendido: pieData.datasets[0].data[4]/total*100
    }

    return (
        <Card sx={{ height: "40%"}}>
            <CardContent sx={{alignText: 'center'}}>
                <Typography variant="h6" sx={{textAlign: 'left', fontWeight: 'bold'}} mb={1}>Estados de los eventos</Typography>
                {pieData.datasets[0].data.length === 0 && (
                    <Box style={{ height: "10em" }}>
                        <Paper
                        style={{
                            padding: 10,
                            margin: 10,
                            textAlign: "center",
                            marginTop: 10,
                        }}
                        >
                        No hay eventos creados
                        </Paper>
                    </Box>
                )}
                {pieData.datasets[0].data.length !== 0 && (
                    <Box>
                        <Pie
                            data={pieData}
                            width={"60%"}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {position: 'right'}
                                },
                                maintainAspectRatio: false
                        }}/>
                    </Box>
                )}
            </CardContent>
            {pieData.datasets[0].data.length !== 0 && (
                <Stack sx={{backgroundColor: '#f4eefc'}} mb={2} py={1} direction='row' justifyContent='space-around'>
                    <Stack alignItems='center'>
                        <Typography sx={{fontWeight: 'bold'}} variant="subtitle2">
                            Borrador
                        </Typography>
                        <Typography variant="body2">
                            {states.borrador}%
                        </Typography>
                    </Stack>
                    <Stack alignItems='center'>
                        <Typography sx={{fontWeight: 'bold'}} variant="subtitle2">
                            Publicado
                        </Typography>
                        <Typography variant="body2">
                            {states.publicado}%
                        </Typography>
                    </Stack>
                    <Stack alignItems='center'>
                        <Typography sx={{fontWeight: 'bold'}} variant="subtitle2">
                            Finalizado
                        </Typography>
                        <Typography variant="body2">
                            {states.finalizado}%
                        </Typography>
                    </Stack>
                    <Stack alignItems='center'>
                        <Typography sx={{fontWeight: 'bold'}} variant="subtitle2">
                            Cancelado
                        </Typography>
                        <Typography variant="body2">
                            {states.cancelado}%
                        </Typography>
                    </Stack>
                    <Stack alignItems='center'>
                        <Typography sx={{fontWeight: 'bold'}} variant="subtitle2">
                            Suspendido
                        </Typography>
                        <Typography variant="body2">
                            {states.suspendido}%
                        </Typography>
                    </Stack>
                </Stack>
            )}
        </Card>
    )
}