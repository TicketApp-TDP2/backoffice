import {Box, CardContent, Card, Typography} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const BarChart = (props) => {
    const { barData } = props;
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{textAlign: 'left', fontWeight: 'bold'}} mb={1}>Cantidad de usuarios acreditados en el tiempo</Typography>
            <Box>
              <Bar
                  options={{
                      responsive: true,
                      plugins: {
                          legend: {display: false},
                      },
                      maintainAspectRatio: false
                  }}
                  width={"70%"}
                  data={barData}
              />
            </Box>
        </CardContent>
      </Card>
    )
}