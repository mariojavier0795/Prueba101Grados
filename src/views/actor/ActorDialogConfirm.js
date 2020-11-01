import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "@material-ui/core/Snackbar";
import AlertDialogSuccess from "../movie/AlertDialogSuccess";

const ActorDialogConfirm = (props) => {
  const { onClose, open, selectedValue } = props;
  const [messageResponse, setMessageResponse] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [openalert, setOpenAlert] = useState(false);

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

  const consumeRestDeleteMovie = (event) => {
    setIsLoaded(true);
    const requestMovie = {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cactor: selectedValue,
      }),
    };

    fetch("http://localhost:3050/actor/deleteActor", requestMovie)
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
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Está seguro de eliminar el actor?"}
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
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={consumeRestDeleteMovie} color="primary">
          Aceptar
        </Button>
      </DialogActions>
      <Snackbar
        autoHideDuration={3000}
        open={openalert}
        onClose={handleCloseAlert}
      >
        <AlertDialogSuccess onClose={handleCloseAlert} severity="success">
          {messageResponse}
        </AlertDialogSuccess>
      </Snackbar>
    </Dialog>
  );
};

export default ActorDialogConfirm;
