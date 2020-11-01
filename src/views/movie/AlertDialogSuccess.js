import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";

const AlertDialogSuccess = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export default AlertDialogSuccess;
