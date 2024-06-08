import { Container, TextField } from '@mui/material'
import React from 'react'

export default function SearchBar({ searchQuery, onSearch }) {
    const handleChange = (e) => {
      onSearch(e.target.value);
    };
  return (
    <Container>
        <TextField type="search" onChange={handleChange} value={searchQuery} className='w-100' id="outlined-basic" label="Search Note" variant="outlined" />
    </Container>
  )
}
