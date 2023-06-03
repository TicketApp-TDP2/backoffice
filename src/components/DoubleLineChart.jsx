import { Box, CardContent, Card } from '@mui/material';
import { Line } from 'react-chartjs-2';

export const DoubleLineChart = (props) => {
    const { doubleLineData } = props;
    return (
      <Card variant="outlined" sx={{ width: "65%", height: "100%" }}>
        <CardContent>
          <Box sx={{ width: "100%", height: "100%" }}>
            <Line options={{responsive: true, plugins: {legend: {position: 'top'}, title: {display: true, text: 'Cantidad de denuncias y suspenciones a lo largo del tiempo'}}}} data={doubleLineData} />
          </Box>
        </CardContent>
      </Card>
    )
}