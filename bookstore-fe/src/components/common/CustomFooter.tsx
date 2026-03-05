import { Typography } from "@mui/material";
import { GridFooter, GridFooterContainer } from "@mui/x-data-grid";

export default function CustomFooter({ error }: { error?: string }) {
    return (
        <GridFooterContainer>
            <GridFooter />
            {!!error && (
                <Typography color="error" sx={{ ml: 2 }}>
                {error} 
                </Typography>
            )}
        </GridFooterContainer>
    )
}