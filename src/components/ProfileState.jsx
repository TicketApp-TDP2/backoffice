import { Typography, Grid } from '@mui/material';

export const ProfileState = (props) => {
    const { state } = props;
    var color = "black";
    if (state) {
      color = "#ff7961";
    } else {
      color = "#aadc98";
    }
    return (
      <Grid container justifyContent={"center"}>
        <div
          style={{
            backgroundColor: color,
            color: "black",
            padding: "5px",
            borderRadius: "100px",
            width: "100px",
            textAlign: "center",
            fontWeight: "bold",
            alignSelf: "center",
          }}
        >
          {state && (
              <Typography>
              Suspendido
              </Typography>
          )}
          {!state && (
              <Typography>
              Activo
              </Typography>
          )}
        </div>
      </Grid>
    );
  };
  