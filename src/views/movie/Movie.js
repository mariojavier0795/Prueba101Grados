import React, { useEffect, useState } from "react";
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import LinearProgress from "@material-ui/core/LinearProgress";
import MovieIcon from "@material-ui/icons/Movie";
import DeleteIcon from "@material-ui/icons/Delete";
import MovieDialog from "./MovieDialog";
import DialogConfirm from "./DialogConfirm";
import MovieDetail from "./MovieDetail";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  spacer: {
    flex: "1 1 100%",
  },
});

const TableMovies = () => {
  const [open, setOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [selectId, setSelectId] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [movieResponseService, setMovieResponseService] = useState();

  useEffect(() => {
    loadInformationMovie();
  }, []);

  const loadInformationMovie = () => {
    setIsLoaded(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpelicula: null,
        nombrepelicula: null,
        duracionminutos: null,
        genero: null,
        sinopsis: null,
      }),
    };

    fetch("http://localhost:3050/movie/findMovie", requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result.arrayMovie);
          setIsLoaded(false);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const handleClickOpen = () => {
    setSelectId();
    setOpen(true);
  };

  const handleClickOpenUpdate = (id) => {
    setSelectId(id);
    setOpen(true);
  };

  const handleClickOpenConfirm = (id) => {
    setSelectedValue(id);
    setOpenConfirm(true);
  };

  const handleClickOpenDetail = (id) => {
    setMovieResponseService(id);
    setOpenDetail(true);
  };

  const handleClose = (response: boolean) => {
    setOpen(false);
    if (response === true) {
      loadInformationMovie();
    }
  };

  const handleCloseConfirm = (response: boolean) => {
    setOpenConfirm(false);
    if (response === true) {
      loadInformationMovie();
    }
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h1" component="div">
          Películas
        </Typography>
        <div className={classes.spacer} />
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
        >
          <MovieIcon />
          Añadir
        </Fab>
        <MovieDialog
          selectedValue={selectId}
          open={open}
          onClose={handleClose}
        />
        <DialogConfirm
          selectedValue={selectedValue}
          open={openConfirm}
          onClose={handleCloseConfirm}
        />
        <MovieDetail
          selectedValue={movieResponseService}
          open={openDetail}
          onClose={handleCloseDetail}
        />
      </Toolbar>
      {isLoaded ? <LinearProgress color="primary" /> : <br></br>}
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell align="center">Duración (minutos)</StyledTableCell>
            <StyledTableCell align="center">Género</StyledTableCell>
            <StyledTableCell align="center">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <StyledTableRow key={row.cpelicula}>
              <StyledTableCell component="th" scope="row">
                {row.nombrepelicula}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.duracionminutos}
              </StyledTableCell>
              <StyledTableCell align="center">{row.genero}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => handleClickOpenDetail(row.cpelicula)}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => handleClickOpenUpdate(row.cpelicula)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => handleClickOpenConfirm(row.cpelicula)}
                >
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableMovies;
