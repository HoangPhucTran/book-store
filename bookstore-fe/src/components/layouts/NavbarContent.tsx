import { List, ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = {
    text: string,
    path: string,
};

const mainListItems: MenuItem[] = [
  { text: 'User', path: '/users' },
  { text: 'Book', path: '/books' },
  { text: 'Order', path: '/orders' },
];

export default function NavbarContent() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton 
                        selected={location.pathname === item.path}
                        onClick={() => navigate(item.path)}>
                    <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
        </Stack>
    );
}