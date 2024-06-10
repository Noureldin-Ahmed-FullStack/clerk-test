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
import { toast } from "react-toastify";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function AddNote() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [ContentState, setContentState] = useState();
  const [TitleState, setTitleState] = useState();
  const { UserDBData, setUserDBData,BaseURL } = useContext(MyContext);
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
      .post(`${BaseURL}/post`, {
        user: UserDBData,
        note: { title:TitleState, content:ContentState},
      })
      .then((response) => {
        console.log(response);
        handleClose();
        FetchNotes()
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
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
  const FetchNotes = () => {
    axios
      .post(`${BaseURL}/GetPosts`, { user: UserDBData })
      .then((response) => {
        console.log(response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
      });
  }
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
                <TextField
                  id="Title-textarea"
                  label="Note Title"
                  placeholder="ex: Do Chores"
                  onChange={handleTitleChange}
                  className="my-3 w-100"
                  multiline
                />
                <TextField
                  id="Content-textarea"
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addPost}>Add note</Button>
          </DialogActions>
        </Dialog>
        <Notes items={items} setItems={setItems} FetchNotes={FetchNotes}/>
      </ThemeProvider>
    </div>
  );
}
