import { Typography } from '@mui/material';

export const ProfileState = (props) => {
    const { state } = props;
    var color = "black";
    if (state) {
      color = "#ff7961";
    } else {
      color = "#aadc98";
    }
    return (
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
    );
  };
  