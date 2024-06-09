import React, { forwardRef, useContext, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Masonry } from "@mui/lab";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Container, TextField, ThemeProvider, createTheme } from "@mui/material";
import { MyContext } from "./ContextProvider";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Dropdown } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Notes({items ,setItems ,FetchNotes} ) {
  const [SearchQuerry, setSearchQuerry] = useState();
  const { UserDBData, setUserDBData } = useContext(MyContext);

  const [open, setOpen] = useState(false);
  const [SelectedNote, setSelectedNote] = useState(false);
  const [ContentState, setContentState] = useState();
  const [TitleState, setTitleState] = useState();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleContentChange = (e) => {
    setContentState(e.target.value)
  }
  const handleTitleChange = (e) => {
    setTitleState(e.target.value)
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    console.log('test');
    axios
      .put("http://localhost:3000/post", { user: UserDBData, postID: SelectedNote._id, title: TitleState, content: ContentState })
      .then((response) => {
        console.log(response.data);
        FetchNotes()
        handleClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // e.preventDefault();
  };

  useEffect(() => {
    if (UserDBData) {
      FetchNotes()
    }

  }, [UserDBData]);

  const placeholderText = "ex: \n1- Make Breakfast\n2- Do dishes";
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#e9e9c0" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "black",
    position: "relative"
  }));
  const handleSearch = (query) => {
    setSearchQuerry(query);
  };
  const filteredItems = SearchQuerry
    ? items.filter((item) =>
      item.title.toLowerCase().includes(SearchQuerry.toLowerCase()) || item.content.toLowerCase().includes(SearchQuerry.toLowerCase())
    )
    : items; // Show all items if SearchQuerry is empty

  const EditNote = (item) => {
    setSelectedNote(item)
    handleClickOpen()
  }
  const DeleteNote = (item) => {
    console.log(item);
    axios
      .delete(`http://localhost:3000/post`, {
        data: {
          user: UserDBData,
          postID: item._id
        }
      })
      .then((response) => {
        console.log(response.data);
        FetchNotes()
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }
  const CustomToggle = forwardRef(({ onClick }, ref) => (
    <div
      href=""
      className="DropDownToggle"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <MoreVertIcon />
    </div>
  ));
  return (
    <div>
      <SearchBar SearchQuerry={SearchQuerry} onSearch={handleSearch} />


      <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Edit Note"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            component={"div"}
            id="alert-dialog-slide-description"
          >
            <form>
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
          <Button onClick={handleSubmit}>Edit note</Button>
        </DialogActions>
      </Dialog>
      <Container>
        <Masonry
          className="my-2"
          columns={{ xs: 2, sm: 2, md: 4, lg: 4 }}
          spacing={2}
        >
          {filteredItems.map((item, index) => (
            <Item key={index}>
              <div className="position-absolute" style={{ right: "0.8rem" }}>
                {/* <DeleteOutlineIcon />
            <EditOutlinedIcon /> */}
                <Dropdown drop="down-centered" id={index} variant='secondary'>
                  <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="Dropdown-Menu">
                    <Dropdown.Item onClick={() => EditNote(item)}><EditOutlinedIcon /></Dropdown.Item>
                    <Dropdown.Item onClick={() => DeleteNote(item)}><DeleteOutlineIcon /></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <h4>{item.title}</h4>
              <p style={{ whiteSpace: 'pre-line' }} className="my-2 text-start">{item.content}</p>
            </Item>
          ))}
        </Masonry>
      </Container>
    </div>
  );
}
