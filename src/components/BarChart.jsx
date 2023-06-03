import { Box, CardContent, Card } from '@mui/material';
import { Bar } from 'react-chartjs-2';

export const BarChart = (props) => {
    const { barData } = props;
    return (
      <Card variant="outlined" sx={{ width: "65%", height: "100%" }}>
        <CardContent>
          <Box sx={{ width: "100%", height: "100%" }}>
            <Bar options={{responsive: true, plugins: {legend: {position: 'top'}, title: {display: true, text: 'Cantidad de usuarios acreditados a lo largo del tiempo'}}}} data={barData} />
          </Box>
        </CardContent>
      </Card>
    )
}