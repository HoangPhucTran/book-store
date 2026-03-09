import { Avatar, Stack } from "@mui/material";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import UserPopupForm from "../users/UserPopupForm";
import { useEffect, useState } from "react";
import type { UserDto } from "../../dtos/users/user.dto";
import { editUser, getMe } from "../../api/users/user.api";

export default function Header() {
  const [openForm, setOpenForm] = useState(false);
  const [pickedUser, setPickedUser] = useState<UserDto | null> (null);

  useEffect(() => {
    if (!openForm)
      return;

    const fetchUser = async () => {
      const myAccount = await getMe();
      setPickedUser(myAccount);
      console.log("MyAcc", pickedUser);
    };

    fetchUser();
  }, [openForm]);

  const handleSubmitUser = async (user: UserDto) => {
      try {
        await editUser(user);
      } catch (err) {
        throw err;
      }
  };

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
      <NavbarBreadcrumbs />

      {/* RIGHT */}
      <Stack direction="row" spacing={1} alignItems="center">
         <Avatar
          sizes="small"
          alt={"guess"}
          src={""}
          sx={{ width: 36, height: 36, cursor: 'pointer' }} 
          onClick={() => setOpenForm(true)}
        />
      </Stack>
      {openForm && pickedUser && (
        <UserPopupForm
          open={openForm}
          user={pickedUser}
          onClose={() => {
            setOpenForm(false);
            setPickedUser(null);
          }}
          onSubmit={handleSubmitUser}
        />
      )}
    </Stack>
  );
}