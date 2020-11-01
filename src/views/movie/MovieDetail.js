import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import CancelIcon from "@material-ui/icons/Cancel";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PersonIcon from "@material-ui/icons/Person";

const MovieDetail = (props) => {
  const { onClose, open, selectedValue } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [movie, setMovie] = useState([]);

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
          cpelicula: selectedValue,
          nombrepelicula: null,
          duracionminutos: null,
          genero: "",
          sinopsis: null,
        }),
      };

      fetch("http://localhost:3050/movie/findMovie", requestOptions)
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(false);
            result.arrayMovie.forEach((element) => {
              setMovie(element);
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
          {movie.nombrepelicula}
        </Typography>
        <Typography variant="h5" component="div">
          {movie.duracionminutos + " minutos"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="h5" component={"span"}>
            {"Sinopsis: "}
          </Typography>
          <Typography variant="body1" component={"span"}>
            {movie.sinopsis}
          </Typography>
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="h5" component={"span"}>
            Actores:
          </Typography>
          <List dense="false">
            {movie.actors !== undefined ? (
              movie.actors.map((actor) => (
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={actor.nombreactor}
                    secondary={actor.edadactor}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText>No Existe Actores</ListItemText>
              </ListItem>
            )}
          </List>
        </DialogContentText>
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

export default MovieDetail;
