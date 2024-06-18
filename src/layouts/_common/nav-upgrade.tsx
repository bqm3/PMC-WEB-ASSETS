// @mui

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Label from 'src/components/label';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { useLocales } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user, logout } = useAuthContext();

  const { t } = useLocales();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
        <Avatar alt={user?.Hoten} sx={{ mr: 2 }}>
            {user?.Hoten?.charAt(0).toUpperCase()}
          </Avatar>
          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            {user?.ent_chinhanh?.Tenchinhanh }
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.Hoten}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.Email}
          </Typography>
        </Stack>

      </Stack>
    </Stack>
  );
}
