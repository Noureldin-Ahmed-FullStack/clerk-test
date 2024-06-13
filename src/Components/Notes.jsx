import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import { Masonry } from "@mui/lab";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Container, TextField, ThemeProvider, ToggleButton, ToggleButtonGroup, createTheme } from "@mui/material";
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
import { toast } from "react-toastify";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Notes({ items, setItems, FetchNotes }) {
  const [SearchQuerry, setSearchQuerry] = useState();
  const { UserDBData, pending, setPending, setUserDBData, BaseURL } = useContext(MyContext);

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
  const [alignment, setAlignment] = useState('#e9e9c0');
  const titleRef = useRef(null);
  const contenteRef = useRef(null);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSubmit = async (e) => {
    console.log('test');
    axios
      .put(`${BaseURL}/post`, {
        user: UserDBData,
        postID: SelectedNote._id,
        note: { title:TitleState, content:ContentState,theme:alignment}
      })
      .then((response) => {
        console.log(response.data);
        FetchNotes()
        setContentState(null)
        setTitleState(null)
        titleRef.current.value = '';
        contenteRef.current.value = '';
        setAlignment('#e9e9c0')
        handleClose();
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
    // e.preventDefault();
  };

  useEffect(() => {
    if (UserDBData) {
      FetchNotes()
    }

  }, [UserDBData]);

  const placeholderText = "ex: \n1- Make Breakfast\n2- Do dishes";
  const Item = ({ Data, color_theme }) => {
    console.log(color_theme);
    return (
      <div style={{ color: '#000', backgroundColor: color_theme ? color_theme : "#e9e9c0" }}>
        <h4>{Data?.title}</h4>
        <p>{Data?.content}</p>
      </div>
    )
  }
  const handleSearch = (query) => {
    setSearchQuerry(query);
  };
  const filteredItems = SearchQuerry
    ? items.filter((item) =>
      item.title.toLowerCase().includes(SearchQuerry.toLowerCase()) || item.content.toLowerCase().includes(SearchQuerry.toLowerCase())
    )
    : items; // Show all items if SearchQuerry is empty

  const EditNote = (item) => {
    setTitleState(item.title)
    setContentState(item.content)
    setSelectedNote(item)
    handleClickOpen()
  }
  const DeleteNote = (item) => {
    console.log(item);
    axios
      .delete(`${BaseURL}/post`, {
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
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
              >
                <ToggleButton value="#e9e9c0"><div className="colorPick pickYellow"></div></ToggleButton>
                <ToggleButton value="#f4afb4"><div className="colorPick pickPink"></div></ToggleButton>
                <ToggleButton value="#df3b57"><div className="colorPick pickRed"></div></ToggleButton>
                <ToggleButton value="#bbe1c3"><div className="colorPick pickGreen"></div></ToggleButton>
                <ToggleButton value="#09c"><div className="colorPick pickBlue"></div></ToggleButton>
              </ToggleButtonGroup>
              <TextField
                id="Title-textarea"
                label="Note Title"
                placeholder={TitleState? TitleState : "ex: Do Chores"}
                onChange={handleTitleChange}
                inputRef={titleRef}
                className="my-3 w-100"
                multiline
              />
              <TextField
                id="Content-textarea"
                label="Note Content"
                placeholder={ContentState? ContentState : placeholderText}
                rows={4}
                className="my-3 w-100"
                multiline
                onChange={handleContentChange}
                inputRef={contenteRef}
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
      {pending ? (<div className="w-75 mt-2 mx-auto">
        <h2>Loading...</h2>
        <p className="loadingText mt-2">This wont take long just waking up server Shh!</p>
      </div>) : (<Container>
        <Masonry
          className="my-2"
          columns={{ xs: 2, sm: 2, md: 4, lg: 4 }}
          spacing={2}
        >
          {filteredItems.map((item, index) => (
            <div key={item._id} className="rounded-2 py-1 px-3" style={{ color: '#000', backgroundColor: item.theme ? item.theme : "#e9e9c0" }}>
              <div className=" d-flex justify-content-between">
                <div style={{width:'24px'}}>{'\n'}</div>
              <h4>{item.title}</h4>
              <div className="" style={{ right: "0.8rem" }}>
                <Dropdown drop="down-centered" id={index} variant='secondary'>
                  <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="Dropdown-Menu">
                    <Dropdown.Item onClick={() => EditNote(item)}><EditOutlinedIcon /></Dropdown.Item>
                    <Dropdown.Item onClick={() => DeleteNote(item)}><DeleteOutlineIcon /></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              </div>
              <p style={{ whiteSpace: 'pre-line' }} className="my-2 text-start">{item.content}</p>
            </div>

          ))}
        </Masonry>
      </Container>)}

    </div>
  );
}
