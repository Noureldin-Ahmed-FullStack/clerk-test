import React, { useContext, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Masonry } from "@mui/lab";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { MyContext } from "./ContextProvider";

export default function Notes() {
  const [SearchQuerry, setSearchQuerry] = useState();
  const { UserDBData, setUserDBData } = useContext(MyContext);
  const [items, setItems] = useState([]);
  //   "Apple bottom jeans booots with the furrr",
  //   "Banana",
  //   "Orange",
  //   "Mango",
  //   "Pineapple",
  useEffect(() => {
    if (UserDBData) {
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
   
  }, [UserDBData]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#e9e9c0" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "black",
  }));
  const handleSearch = (query) => {
    setSearchQuerry(query);
  };
  const filteredItems = SearchQuerry
    ? items.filter((item) =>
        item.title.toLowerCase().includes(SearchQuerry.toLowerCase()) || item.content.toLowerCase().includes(SearchQuerry.toLowerCase())
      )
    : items; // Show all items if SearchQuerry is empty
console.log(filteredItems);
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
            <h4>{item.title}</h4>
            <p className="my-2 text-start">{item.content}</p>
          </Item>
        ))}
      </Masonry>
    </div>
  );
}
