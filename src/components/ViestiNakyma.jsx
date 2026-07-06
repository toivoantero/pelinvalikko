import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ViestiNakyma({ viesti }) {
    if (!viesti) return null;

    const tyyppi = viesti.tyyppi || 'teksti';

    if (tyyppi === 'teksti') {
        return (
            <Typography sx={viesti.style || { color: '#FFCC33' }}>
                {viesti.teksti}
            </Typography>
        );
    }

    if (tyyppi === 'tervetuloa') {
        const data = viesti.data || {};
        return (
            <Box>
                <Typography sx={viesti.style || { color: '#FFCC33' }}>{viesti.teksti}</Typography>
                <Box sx={{ color: 'white', mt: 1 }}>
                    <Typography sx={{ fontSize: { xs: 'small', sm: 'initial' } }}>Nimi: {data.nimi}</Typography>
                    <Typography sx={{ fontSize: { xs: 'small', sm: 'initial' } }}>Ammatti: {data.ammatti}</Typography>
                    <Typography sx={{ fontSize: { xs: 'small', sm: 'initial' } }}>Ikä: {data.ika}</Typography>
                    <Typography sx={{ fontSize: { xs: 'small', sm: 'initial' } }}>Taso: {data.taso}</Typography>
                </Box>
            </Box>
        );
    }

    return null;
}
