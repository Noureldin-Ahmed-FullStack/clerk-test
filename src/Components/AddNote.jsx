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
  const [ContentState, setContentState] = useState();
  const [TitleState, setTitleState] = useState();
  const { UserDBData, setUserDBData } = useContext(MyContext);
  const handleClickOpen = () => {
    setOpen(true);
  };
const handleContentChange = (e)=>{
    setContentState(e.target.value)
}
const handleTitleChange = (e)=>{
    setTitleState(e.target.value)
}
  const handleClose = () => {
    setOpen(false);
  };
  const addPost = () => {
    console.log({title:TitleState,content:ContentState});
    axios
      .post("http://localhost:3000/post", {
        user: UserDBData,
        note: { title:TitleState, content:ContentState},
      })
      .then((response) => {
        console.log(response);
        handleClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        handleClose();
      });
  };
  const handleSubmit = async (e) => {
    // e.preventDefault();
    addPost();
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
              <form onSubmit={handleSubmit}>
              <p>{TitleState}</p>
                <TextField
                  id="outlined-textarea"
                  label="Note Title"
                  placeholder="ex: Do Chores"
                  onChange={handleTitleChange}
                  className="my-3 w-100"
                  multiline
                />
                <p>{ContentState}</p>
                <TextField
                  id="outlined-textarea"
                  label="Note Content"
                  placeholder={placeholderText}
                  rows={4}
                  className="my-3 w-100"
                  multiline
                  onChange={handleContentChange}
                  InputProps={{
                    style: { whiteSpace: "pre-line" }, // Allow newline in placeholder
                  }}
                />
              </form>
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
