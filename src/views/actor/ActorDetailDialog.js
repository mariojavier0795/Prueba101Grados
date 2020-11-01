import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
});

const ActorDetailDialog = (props) => {
  const { onClose, open, selectedValue } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [actor, setActor] = useState([]);

  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

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
              setActor(element);
            });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [selectedValue]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
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
          {actor.nombreactor}
        </Typography>
        <Typography variant="h5" component="div">
          {actor.edadactor + " Años"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <CardMedia
          className={classes.media}
          image={"data:image/png;base64," + actor.fotoactor}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          startIcon={<CancelIcon />}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActorDetailDialog;
