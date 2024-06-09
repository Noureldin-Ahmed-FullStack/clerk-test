import React, { forwardRef, useContext, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Masonry } from "@mui/lab";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { MyContext } from "./ContextProvider";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Dropdown } from "react-bootstrap";
export default function Notes() {
  const [SearchQuerry, setSearchQuerry] = useState();
  const { UserDBData, setUserDBData } = useContext(MyContext);
  const [items, setItems] = useState([]);
  //   "Apple bottom jeans booots with the furrr",
  //   "Banana",
  //   "Orange",
  //   "Mango",
  //   "Pineapple",
  const FetchNotes = () => {
    axios
      .post("http://localhost:3000/GetPosts", { user: UserDBData })
      .then((response) => {
        console.log(response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    if (UserDBData) {
      FetchNotes()
    }

  }, [UserDBData]);

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
    console.log(item);
    axios
      .put("http://localhost:3000/post", { user: UserDBData, postID: item._id, title: "item.title", content: "item.content" })
      .then((response) => {
        console.log(response.data);

      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
      {/* <div>
        {filteredItems.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div> */}
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
    </div>
  );
}
