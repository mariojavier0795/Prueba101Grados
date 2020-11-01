import React, { useEffect, useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import AvTimerOutlinedIcon from "@material-ui/icons/AvTimerOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "@material-ui/core/Snackbar";
import AlertDialogSuccess from "./AlertDialogSuccess";

const useStyles = makeStyles({
  dialog: {
    minWidth: 500,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const listGender = ["Animadas", "Romántica", "Comedia", "Terror"];

const MovieDialog = (props) => {
  const { onClose, open, selectedValue } = props;
  const [openalert, setOpenAlert] = useState(false);
  const [messageResponse, setMessageResponse] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [actores, setActores] = useState([]);
  const [datosMovie, setDatosMovie] = useState({
    cpelicula: null,
    nombrepelicula: "",
    duracionminutos: "",
    genero: "",
    sinopsis: "",
    actores: [],
  });
  const classes = useStyles();

  useEffect(() => {
    setIsLoaded(true);
    loadInformationActor();
    if (selectedValue !== undefined) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpelicula: selectedValue,
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
            setIsLoaded(false);
            result.arrayMovie.forEach((element) => {
              setDatosMovie({
                cpelicula: element.cpelicula,
                nombrepelicula: element.nombrepelicula,
                duracionminutos: element.duracionminutos,
                genero: element.genero,
                sinopsis: element.sinopsis,
                actores: element.actors,
              });
            });
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      setDatosMovie({
        cpelicula: null,
        nombrepelicula: "",
        duracionminutos: "",
        genero: "",
        sinopsis: "",
        actores: [],
      });
    }
  }, [selectedValue]);

  const loadInformationActor = () => {
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
        movie: {
          cpelicula: null,
        },
      }),
    };

    fetch("http://localhost:3050/actor/findActor", requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          setActores(result.arrayActor);
          setIsLoaded(false);
        },
        (error) => {
          setIsLoaded(true);
          console.log(error);
        }
      );
  };

  const handleClose = () => {
    if (messageResponse !== "") {
      onClose(true);
      setMessageResponse("");
    } else {
      onClose(false);
    }
  };

  const handleCloseAlert = (event: React.SyntheticEvent, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
    handleClose();
  };

  const handleInputChange = (event) => {
    setDatosMovie({
      ...datosMovie,
      [event.target.name]: event.target.value,
    });
  };

  const consumeRestSaveMovie = (event) => {
    setIsLoaded(true);
    if (datosMovie.cpelicula !== null) {
      const requestPelicula = {
        method: "PUT",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosMovie),
      };

      fetch("http://localhost:3050/movie/updateMovie", requestPelicula)
        .then((res) => res.json())
        .then(
          (result) => {
            setMessageResponse(result.messageResponse);
            setIsLoaded(false);
            setOpenAlert(true);
          },
          (error) => {
            setIsLoaded(true);
            console.log(error);
          }
        );
    } else {
      const requestMovie = {
        method: "POST",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosMovie),
      };

      fetch("http://localhost:3050/movie/insertMovie", requestMovie)
        .then((res) => res.json())
        .then(
          (result) => {
            setMessageResponse(result.messageResponse);
            setIsLoaded(false);
            setOpenAlert(true);
          },
          (error) => {
            setIsLoaded(true);
            console.log(error);
          }
        );
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        <Typography variant="h3" component="div">
          Ingreso de Películas
        </Typography>
        {isLoaded ? (
          <Card>
            <CardContent>
              <LinearProgress color="primary" />
            </CardContent>
          </Card>
        ) : (
          <br></br>
        )}
      </DialogTitle>
      <DialogContent>
        <form>
          <div>
            <TextField
              id="outlined-basic"
              label="Nombre de la Película"
              error={datosMovie.nombrepelicula === "" ? true : false}
              helperText={
                datosMovie.nombrepelicula === ""
                  ? "El Nombre de la Película es Requerido"
                  : ""
              }
              variant="outlined"
              color="primary"
              className={classes.dialog}
              name="nombrepelicula"
              value={datosMovie.nombrepelicula}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreateOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <br></br>
          <div>
            <TextField
              id="outlined-basic"
              label="Duración de la Película"
              error={datosMovie.duracionminutos === "" ? true : false}
              helperText={
                datosMovie.duracionminutos === ""
                  ? "La Duración de la Película es Requerida"
                  : ""
              }
              variant="outlined"
              color="primary"
              type="number"
              value={datosMovie.duracionminutos}
              className={classes.dialog}
              name="duracionminutos"
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AvTimerOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <br></br>
          <div>
            <FormControl variant="outlined" className={classes.dialog}>
              <InputLabel id="demo-simple-select-outlined-label">
                Género
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={datosMovie.genero}
                name="genero"
                onChange={handleInputChange}
                label="Género"
              >
                {listGender.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <br></br>
          <div>
            <TextField
              id="outlined-basic"
              label="Sinopsis de Película"
              error={datosMovie.sinopsis === "" ? true : false}
              helperText={
                datosMovie.sinopsis === ""
                  ? "La Sinopsis de la Película es Requerida"
                  : ""
              }
              variant="outlined"
              color="primary"
              className={classes.dialog}
              name="sinopsis"
              value={datosMovie.sinopsis}
              onChange={handleInputChange}
              multiline
              rows={2}
              rowsMax={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <br></br>
          <div>
            <FormControl className={classes.dialog}>
              <InputLabel id="demo-mutiple-chip-label">Actores</InputLabel>
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                value={datosMovie.actores}
                name="actores"
                onChange={handleInputChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={
                          value.nombreactor !== undefined
                            ? value.nombreactor
                            : value
                        }
                        label={
                          value.nombreactor !== undefined
                            ? value.nombreactor
                            : value
                        }
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {actores.map((actor) => (
                  <MenuItem key={actor.cactor} value={actor.nombreactor}>
                    {actor.nombreactor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClose}
          className={classes.button}
          startIcon={<CancelIcon />}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={consumeRestSaveMovie}
          className={classes.button}
          startIcon={<SaveIcon />}
        >
          Guardar
        </Button>
        <Snackbar
          autoHideDuration={3000}
          open={openalert}
          onClose={handleCloseAlert}
        >
          <AlertDialogSuccess onClose={handleCloseAlert} severity="success">
            {messageResponse}
          </AlertDialogSuccess>
        </Snackbar>
      </DialogActions>
    </Dialog>
  );
};

export default MovieDialog;
