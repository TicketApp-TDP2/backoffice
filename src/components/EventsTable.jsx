import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Grid, Typography, Divider, Modal } from "@mui/material";
import { State } from "./State";
import { getComplaintRankingByEvents } from "../services/eventService";
import { CircularProgress } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const today = dayjs();
const lastweek = today.subtract(7, 'day');
console.log(today);
console.log(lastweek);

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

const rowsPerPage = 10;

export const EventsTable = () => {
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [initialDate, setInitialDate] = useState(lastweek);
  const [finalDate, setFinalDate] = useState(today);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("use effect");
    async function fetchData() {
      setIsLoading(true);
      const start = initialDate.toISOString().substring(0, 10);
      const end = finalDate.toISOString().substring(0, 10);
      getComplaintRankingByEvents({ start, end }).then((res) => {
          console.log("Response", res);
          setRows(res);
          setIsLoading(false);
      });
    }
    fetchData();
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /*if (rows.length === 0) {
    return (
      <Box style={{ height: "50em" }}>
        <Paper
          style={{
            padding: 10,
            margin: 10,
            textAlign: "center",
            marginTop: 50,
          }}
        >
          No hay eventos con denuncias registrados
        </Paper>
      </Box>
    );
  }*/
  
  const handleFilter = async () => {
    handleCloseModal();
    setIsLoading(true);
    const start = initialDate.toISOString().substring(0, 10);
    const end = finalDate.toISOString().substring(0, 10);
    getComplaintRankingByEvents(start, end).then((res) => {
        console.log("Response", res);
        setRows(res);
        setIsLoading(false);
    });
}

  const handleOpenModal = () => {
    setOpenModal(true);
  }
  const handleCloseModal = () => {
    setOpenModal(false);
  }

  const ModalFilter = () => {
    return(
    <>
      <Grid container justifyContent="flex-end" sx={{paddingRight: 3}}>
        <IconButton aria-label="delete" color="primary" size="large" onClick={handleOpenModal}>
          <FilterListIcon />
        </IconButton>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Filtro por fecha
          </Typography>
          <Divider/>
          <Grid container sx={{mt: 2}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={1}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Desde:
                </Typography>
              </Grid>
              <Grid item xs>
              <DatePicker
                label="Fecha"
                value={initialDate}
                onChange={(newValue) => setInitialDate(newValue)}
                format="DD/MM/YYYY"
                disableFuture
                sx={{width: "95%", pr:2}}
                />
              </Grid>
              <Grid item xs={1}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Hasta:
                </Typography>
              </Grid>
              <Grid item xs>
                <DatePicker
                  label="Fecha"
                  value={finalDate}
                  onChange={(newValue) => setFinalDate(newValue)}
                  format="DD/MM/YYYY"
                  disableFuture
                  sx={{width: "95%", pr:2}}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button variant="contained" size="large" onClick={handleFilter} >
              Filtrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
    );
  }

  return (
    <>
    {isLoading && (
      <Box sx={{ display: 'flex', justifyContent: "center", marginTop: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    )}
    {!isLoading && rows.length === 0 && (
        <Box style={{ height: "50em" }}>
          <ModalFilter/>
          <Paper
          style={{
              padding: 10,
              margin: 10,
              textAlign: "center",
              marginTop: 10,
          }}
          >
            No hay eventos con denuncias registrados
          </Paper>
      </Box>
    )}
    {!isLoading && rows.length > 0 && (
      <>
      <ModalFilter/>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
        }}
      >
        <Table
          sx={{
            minWidth: 500,
          }}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "25%" }}>Evento</TableCell>
              <TableCell style={{ width: "25%" }} align="center">Organizador</TableCell>
              <TableCell style={{ width: "25%" }} align="center">Cantidad de denuncias</TableCell>
              <TableCell style={{ width: "25%" }} align="center">Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow
                key={row.event}
                sx={{ backgroundColor: "#f3f1fc" }}
                hover
                selected
              >
                <TableCell sx={{ fontWeight: "bold" }}>
                  <Button
                    onClick={() => {
                      navigate(`/events/${row.event_id}`);
                    }}
                    underline="hover"
                  >
                    {row.event}
                  </Button>
                </TableCell>
                <TableCell align="center">{row.organizer}</TableCell>
                <TableCell align="center">{row.complaints}</TableCell>
                <TableCell align="center"><State state={row.state} /></TableCell>
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
              <TableCell />
              <TableCell />
              <TablePagination
                count={rows.length}
                onPageChange={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
                component="div"
                labelDisplayedRows={({ from, to, count }) => page + 1}
                labelRowsPerPage={null}
                nextIconButtonProps={{
                  "aria-label": "Next Page",
                  style: {
                    border: "2px solid",
                    borderRadius: "20%",
                    padding: "1px",
                  },
                }}
                backIconButtonProps={{
                  "aria-label": "Previous Page",
                  style: {
                    border: "2px solid",
                    borderRadius: "20%",
                    padding: "1px",
                  },
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      </>
    )}
    </>
  );
};
