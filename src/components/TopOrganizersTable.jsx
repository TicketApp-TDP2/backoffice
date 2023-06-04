import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import {Button, Typography} from "@mui/material";

const rowsPerPage = 10;

export const TopOrganizersTable = (props) => {
  const { rows } = props;
  const navigate = useNavigate();
  const emptyRows = 0;

  return ( 
  <>
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{textAlign: 'left', fontWeight: 'bold'}} mb={3}>Top 10 organizadores</Typography>
        {rows.length === 0 && (
            <Box style={{ height: "50em" }}>
                <Paper
                style={{
                    padding: 10,
                    margin: 10,
                    textAlign: "center",
                    marginTop: 10,
                }}
                >
                No hay organizadores con eventos creados
                </Paper>
          </Box>
        )}
        {rows.length > 0 && (
          <>
            <TableContainer
            component={Paper}
            sx={{
                borderRadius: 4,
            }}
            >
            <Table
                sx={{
                minWidth: 200,
                }}
                aria-label="custom pagination table"
            >
                <TableHead>
                <TableRow>
                    <TableCell style={{ width: "33%" }}>Organizador</TableCell>
                    <TableCell style={{ width: "33%" }} align="center">Cantidad de eventos</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ backgroundColor: "#f3f1fc" }}
                      hover
                      selected
                    >
                      <TableCell sx={{padding: 0}}>
                          <Button
                          onClick={() => {
                              navigate(`/profile/${row.organizer_id}`);
                          }}
                          underline="hover"
                          sx={{fontSize: 14}}
                          >
                          {row.name}
                          </Button>
                      </TableCell>
                      <TableCell align="center">{row.events}</TableCell>
                    </TableRow>
                ))}

                {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} sx={{ backgroundColor: "#f3f1fc" }} />
                    </TableRow>
                )}
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TableCell />
                </TableRow>
                </TableFooter>
            </Table>
            </TableContainer>
          </>
        )}
        </CardContent>
      </Card>
    </>
  );
};
