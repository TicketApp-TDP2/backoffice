import { Grid } from "@mui/material";

export const State = (props) => {
    const { state } = props;
    var color = "black";
    if (state === "Borrador") {
      color = "#b9b8bd";
    } else if (state === "Publicado") {
      color = "#aadc98";
    } else if (state === "Cancelado") {
      color = "#f5aaaa";
    } else if (state === "Finalizado") {
      color = "#fcefc2";
    } else if (state === "Suspendido") {
      color = "#ff7961";
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
          {state}
        </div>
      </Grid>
    );
  };
  