import React, { forwardRef, useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField, ThemeProvider, createTheme } from "@mui/material";
import Notes from "./Notes";
import { MyContext } from "./ContextProvider";
import axios from "axios";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function AddNote() {
  const [open, setOpen] = useState(false);
  const { UserDBData, setUserDBData } = useContext(MyContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const addPost = () => {
    axios
      .post("http://localhost:3000/post", {
        user: UserDBData,
        note: { title: "Title test", content: "content lorem ipsum" },
      })
      .then((response) => {
        console.log(response);
        handleClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        handleClose();
      });
  };
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const placeholderText = "ex: \n1- Make Breakfast\n2- Do dishes";
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Button className="my-2" variant="outlined" onClick={handleClickOpen}>
          Add Note
        </Button>
        <Dialog
          fullWidth
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Add Note"}</DialogTitle>
          <DialogContent>
            <DialogContentText
              component={"div"}
              id="alert-dialog-slide-description"
            >
              <TextField
                id="outlined-textarea"
                label="Note Title"
                placeholder="ex: Do Chores"
                className="my-3 w-100"
                multiline
              />
              <TextField
                id="outlined-textarea"
                label="Note Content"
                placeholder={placeholderText}
                rows={4}
                className="my-3 w-100"
                multiline
                InputProps={{
                  style: { whiteSpace: 'pre-line' }, // Allow newline in placeholder
                }}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={addPost}>Agree</Button>
          </DialogActions>
        </Dialog>
        <Notes />
      </ThemeProvider>
    </div>
  );
}
