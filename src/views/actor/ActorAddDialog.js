import React, { useState, useEffect } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import AvTimerOutlinedIcon from "@material-ui/icons/AvTimerOutlined";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import AlertDialogSuccess from "../movie/AlertDialogSuccess";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import LinearProgress from "@material-ui/core/LinearProgress";

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
  input: {
    display: "none",
  },
});

const ActorAddDialog = (props) => {
  const { onClose, open, selectedValue } = props;
  const [nameFile, setNameFile] = useState("");
  const [openalert, setOpenAlert] = useState(false);
  const [messageResponse, setMessageResponse] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [datosActor, setDatosActor] = useState({
    cactor: "",
    edadactor: "",
    nombreactor: "",
    fotoactor: "",
  });
  const classes = useStyles();

  useEffect(() => {
    if (selectedValue !== undefined) {
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
          cactor: selectedValue,
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
            setIsLoaded(false);
            result.arrayActor.forEach((element) => {
              setDatosActor({
                cactor: element.cactor,
                edadactor: element.edadactor,
                nombreactor: element.nombreactor,
                fotoactor: element.fotoactor,
              });
            });
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      setDatosActor({
        cactor: "",
        edadactor: "",
        nombreactor: "",
        fotoactor: "",
      });
    }
  }, [selectedValue]);

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
    setDatosActor({
      ...datosActor,
      [event.target.name]: event.target.value,
    });
  };

  const handleCapture = ({ target }) => {
    const fileReader = new FileReader();
    setNameFile(target.files[0].name);
    fileReader.readAsDataURL(target.files[0]);
    fileReader.onload = (e) => {
      setDatosActor({
        ...datosActor,
        [target.name]: e.target.result.split("data:image/jpeg;base64,")[1],
      });
    };
  };

  const consumeRestSaveActor = (event) => {
    setIsLoaded(true);
    if (datosActor.cactor !== "") {
      const requestActor = {
        method: "PUT",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActor),
      };

      fetch("http://localhost:3050/actor/updateActor", requestActor)
        .then((res) => res.json())
        .then(
          (result) => {
            setMessageResponse(result.messageResponse);
            setIsLoaded(false);
            setNameFile("");
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
        body: JSON.stringify(datosActor),
      };

      fetch("http://localhost:3050/actor/insertActor", requestMovie)
        .then((res) => res.json())
        .then(
          (result) => {
            setMessageResponse(result.messageResponse);
            setIsLoaded(false);
            setNameFile("");
            setDatosActor({
              cactor: "",
              edadactor: "",
              nombreactor: "",
              fotoactor: "",
            });
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
        {isLoaded ? (
          <Card>
            <CardContent>
              <LinearProgress color="primary" />
            </CardContent>
          </Card>
        ) : (
          <br></br>
        )}
        <Typography variant="h3" component="div">
          Ingreso de Actor
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form>
          <div>
            <TextField
              id="outlined-basic"
              label="Nombre del Actor"
              error={datosActor.nombreactor === "" ? true : false}
              helperText={
                datosActor.nombreactor === ""
                  ? "El Nombre del Actor es Requerido"
                  : ""
              }
              variant="outlined"
              color="primary"
              className={classes.dialog}
              name="nombreactor"
              value={datosActor.nombreactor}
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
              label="Edad del Actor"
              error={datosActor.edadactor === "" ? true : false}
              helperText={
                datosActor.edadactor === ""
                  ? "La Edad del Actor es Requerida"
                  : ""
              }
              variant="outlined"
              color="primary"
              type="number"
              className={classes.dialog}
              name="edadactor"
              value={datosActor.edadactor}
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
            <TextField
              id="outlined-read-only-input"
              label="Nombre del Archivo"
              className={classes.dialog}
              value={nameFile}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </div>
          <br></br>
          <div>
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              name="fotoactor"
              onChange={handleCapture}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Subir Foto
              </Button>
            </label>
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
          onClick={consumeRestSaveActor}
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

export default ActorAddDialog;
