import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import React from "react";
import Pagination from "@mui/material/Pagination";
import Fab from "@mui/material/Fab";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function Verify() {
    const [searchTerm, setSearchTerm] = React.useState("");
    return (
        <div className='mt-10'>
            <div className='flex flex-row space-x-2'>
                <TextField
                    id="search"
                    type="search"
                    label="Search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    sx={{ width: 500 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained">Search</Button>
                <Button variant="outlined">Filter</Button>
            </div>
            <Paper elevation={3} className="mt-5">
                <div className="flex flex-row justify-between items-center px-5 py-3">
                    <div className="flex flex-col items-center space-y-2 w-5/6 border-r-2">
                        <p className="h-20">Company Info</p>
                        <p className="h-20">Company Name</p>
                        <p className="h-20">Company Id</p>
                        <p className="h-20">Company Email</p>
                        <p className="h-20">Company Phone</p>
                        <p className="h-20">Company Address</p>
                        <p className="h-20">Company Website</p>
                        <p className="h-20">Company Logo</p>

                    </div>
                    <div className="flex flex-col items-center space-y-10 w-1/6">
                        <Fab size="medium" color="success" aria-label="add">
                            <CheckIcon/>
                        </Fab>
                        <Fab size="medium" aria-label="add">
                            <MoreHorizIcon />
                        </Fab>
                        <Fab size="medium" color="error" aria-label="add">
                            <CloseIcon/>
                        </Fab>
                    </div>
                </div>
            </Paper>
            <Pagination count={10} variant="outlined" shape="rounded" className="mt-5 flex justify-center" />
        </div>
    )

}