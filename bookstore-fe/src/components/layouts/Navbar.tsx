import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from "@mui/material/Stack";
import { Avatar, Box, Button, Typography } from "@mui/material";
import NavbarContent from "./NavbarContent";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const user = {
    id: '',
    username: 'Guest',
    password: '',
    name: 'Guest User',
    email: 'guest@example.com',
    isActive: false,
    avatarUrl: 'Guest',
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
        }}
        // onClick={() => gotoProfile()}
      >
        <Avatar
          sizes="small"
          alt={user.name}
          src={""}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {user.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user.email}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <NavbarContent />
         <Button variant="contained" size="small" fullWidth >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}