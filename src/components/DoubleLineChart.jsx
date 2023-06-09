import {Box, CardContent, Card, Typography} from '@mui/material';
import { Line } from 'react-chartjs-2';

export const DoubleLineChart = (props) => {
    const { doubleLineData } = props;
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{textAlign: 'left', fontWeight: 'bold'}} mb={1}>Cantidad de eventos en el tiempo</Typography>
          <Box>
            <Line
                options={{
                    responsive: true,
                    plugins: {
                        legend: {position: 'top'},
                    },
                    maintainAspectRatio: false
                }}
                width={"70%"}
                data={doubleLineData}
            />
          </Box>
        </CardContent>
      </Card>
    )
}