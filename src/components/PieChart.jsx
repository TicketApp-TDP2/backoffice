import { Typography, Box, CardContent, Card } from '@mui/material';
import { Pie } from 'react-chartjs-2';

export const PieChart = (props) => {
    const { pieData } = props;
    return (
        <Card variant="outlined" sx={{ width: "30%", height: "100%" }}>
            <CardContent>
                <Box sx={{ width: "80%", height: "60%" }}>
                <Pie data={pieData} options={{responsive: true, plugins: {legend: {position: 'top'}, title: {display: true, text: 'Estado de los eventos'}}}}/>
                </Box>
                <Typography>{pieData.datasets[0].data}</Typography>
                {pieData.datasets[0].data.map((item, index) => {
                <>
                    <Typography>Holaa</Typography>
                    <Typography>{pieData.labels[index]}: {item}</Typography>
                </>
                })}
            </CardContent>
        </Card>
    )
}