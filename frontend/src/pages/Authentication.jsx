import React, { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';


const defaultTheme = createTheme();

function Authentication() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");

    const [formState, setFormState] = useState(0);
    const [open, setOpen] = useState(false);

    
    const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    };


    const { handleRegister, handleLogin} = useContext(AuthContext);

    let handleAuth = async()=>{
        setMessage("");
        setSeverity("success");
        try {
            if(formState == 0){
                let result = await handleLogin(username, password);
            }
            if(formState == 1){
                let result = await handleRegister(name, email, username, password);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setFormState(0);
                setPassword("");
                setName("");
                setEmail("");
            }
        } catch (error) {
            let errorMessage = "An unknown error occurred.";
            if (error.response) {
                // Backend responded with an error
                errorMessage = error.response.data.message || "Something went wrong!";
            } else {
                // Network or other request error
                errorMessage = "Network error, please try again later!";
            }
            // Set error message and severity, then open the Snackbar
            setMessage(errorMessage);
            setSeverity("error");
            setOpen(true);
        }
    }

    return ( 
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    size={{ xs: 0, sm: 4, md: 7 }}
                    sx={{
                        backgroundImage: 'url("https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg")',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        
                    }}
                />
                <Grid item  size={{ xs: 12, sm: 8, md: 5 }} component={Paper} elevation={6} square >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>


                        <div>
                            <Button variant={formState === 0 ? "contained" : ""} onClick={() => { setFormState(0) }}>
                                Sign In
                            </Button>
                            <Button variant={formState === 1 ? "contained" : ""} onClick={() => { setFormState(1) }}>
                                Sign Up
                            </Button>
                        </div>

                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            {formState === 1 ? <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullname"
                                label="Full Name"
                                name="fullname"
                                value={name}
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                            /> : <></>}

                            {formState === 1 ? <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                value={email}
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}
                            /> : <></>}
                            

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)}

                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}

                                id="password"
                            />

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login " : "Register"}
                            </Button>

                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

        </ThemeProvider>
     );
}

export default Authentication;