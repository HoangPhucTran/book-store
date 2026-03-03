import { Avatar, Stack } from "@mui/material";

export default function Header() {

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        height: 64,
        px: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white', 
        color: 'white',               
        boxShadow: 1,
      }}
    >
      {/* RIGHT */}
      <Stack direction="row" spacing={1} alignItems="center">
        {/* <Search />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton> */}
         <Avatar
          sizes="small"
          alt={"guess"}
          src={""}
          sx={{ width: 36, height: 36 }}
        />
      </Stack>
    </Stack>
  );
}