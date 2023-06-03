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
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

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

export const TopOrganizersTable = (props) => {
  const { rows } = props;
  const [page, setPage] = React.useState(0);
  const navigate = useNavigate();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return ( 
  <>
    <Card variant="outlined" sx={{ width: "30%", height: "100%" }}>
      <CardContent>
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
                No hay organizadores con denuncias registrados
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
                {(rowsPerPage > 0
                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                ).map((row) => (
                    <TableRow
                    key={row.name}
                    sx={{ backgroundColor: "#f3f1fc" }}
                    hover
                    selected
                    >
                    <TableCell sx={{ fontWeight: "bold" }}>
                        <Button
                        onClick={() => {
                            navigate(`/profile/${row.organizer_id}`);
                        }}
                        underline="hover"
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
                    <TablePagination
                    count={rows.length}
                    onPageChange={handleChangePage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[]}
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
        </CardContent>
      </Card>
    </>
  );
};
