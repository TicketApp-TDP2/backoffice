import { Grid, Button, Box, CircularProgress, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Stack } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import Swal from 'sweetalert2';

export const LandingScreen = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogIn = async () => {
        setIsLoading(true);
        if (name === "admin1" && password === "pass1") {
            navigate("/dashboard");
        } else {
            Swal.fire({
                title: '¡Error!',
                text: 'Credenciales erroneas',
                icon: 'error',
                confirmButtonColor: 'red',
            });
        }
        setIsLoading(false);
    }

    return <>
        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', m: 1}}
        >
            <img src="/Logo.png" alt="logo" />
            <Box sx={{ '& button': { m: 1, mt:2, } }} alignItems="center">
                <Stack spacing={2} >
                <TextField
                    id="outlined-controlled"
                    label="Usuario"
                    value={name}
                    onChange={(event) => { setName(event.target.value) }}
                />
                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Contraseña"
                        onChange={(event) => { setPassword(event.target.value) }}
                        value={password}
                    />
                </FormControl>
                </Stack>
                {!isLoading && (
                    <Box sx={{marginRight: 2}}>
                        <Button variant="contained" size="large" color="primary" sx={{width:"100%"}} onClick={() => handleLogIn()}>
                            Ingresar
                        </Button>
                    </Box>
                )}
            </Box>
            {isLoading && (
                <Grid sx={{display: 'flex'}} justifyContent="center" alignItems="center">
                    <CircularProgress color="primary"/> 
                </Grid>
            )}
        </Grid>
    </>
}