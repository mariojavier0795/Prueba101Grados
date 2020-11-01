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
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import Avatar from "@material-ui/core/Avatar";
import ActorDialogConfirm from "./ActorDialogConfirm";
import ActorAddDialog from "./ActorAddDialog";
import ActorDetailDialog from "./ActorDetailDialog";

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

const TableActors = () => {
  const classes = useStyles();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [actors, setActor] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [selectValueDetail, setSelectValueDetail] = useState();
  const [selectId, setSelectId] = useState();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    loadInformationActor();
  }, []);

  const loadInformationActor = () => {
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
        cactor: null,
        nombreactor: null,
        edadactor: null,
        fotoactor: null,
        movie: null,
      }),
    };

    fetch("http://localhost:3050/actor/findActor", requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          setActor(result.arrayActor);
          setIsLoaded(false);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const handleClickOpenAdd = () => {
    setSelectId();
    setOpenAdd(true);
  };

  const handleClickOpenUpdate = (id) => {
    setSelectId(id);
    setOpenAdd(true);
  };

  const handleClickOpenDetail = (id) => {
    setSelectValueDetail(id);
    setOpenDetail(true);
  };

  const handleClickOpenConfirm = (id) => {
    setSelectedValue(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = (response: boolean) => {
    setOpenConfirm(false);
    if (response === true) {
      loadInformationActor();
    }
  };

  const handleClose = (response: boolean) => {
    setOpenAdd(false);
    if (response === true) {
      loadInformationActor();
    }
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h1" component="div">
          Actores
        </Typography>
        <div className={classes.spacer} />
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleClickOpenAdd}
        >
          <PersonIcon />
          Añadir
        </Fab>
        <ActorAddDialog
          selectedValue={selectId}
          open={openAdd}
          onClose={handleClose}
        />
        <ActorDialogConfirm
          selectedValue={selectedValue}
          open={openConfirm}
          onClose={handleCloseConfirm}
        />
        <ActorDetailDialog
          selectedValue={selectValueDetail}
          open={openDetail}
          onClose={handleCloseDetail}
        />
      </Toolbar>
      {isLoaded ? <LinearProgress color="primary" /> : <br></br>}
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Foto</StyledTableCell>
            <StyledTableCell align="center">Nombre</StyledTableCell>
            <StyledTableCell align="center">Edad</StyledTableCell>
            <StyledTableCell align="center">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {actors.map((actor) => (
            <StyledTableRow key={actor.cactor}>
              <StyledTableCell component="th" scope="row">
                <Avatar
                  alt="Remy Sharp"
                  src={"data:image/png;base64," + actor.fotoactor}
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                {actor.nombreactor}
              </StyledTableCell>
              <StyledTableCell align="center">
                {actor.edadactor}
              </StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => handleClickOpenDetail(actor.cactor)}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => handleClickOpenUpdate(actor.cactor)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => handleClickOpenConfirm(actor.cactor)}
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

export default TableActors;
