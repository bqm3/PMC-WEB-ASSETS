// @mui
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from 'src/components/image';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
// utils
import { fShortenNumber } from 'src/utils/format-number';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  Duan: string;
  Logo: string;
  Diachi: string;
  apple: number;
  flag: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function AnaLyticsDuan({ title, subheader, list, ...other }: Props) {
  const router = useRouter();

  

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
            // onClick={() => handleViewRow()}
          >
            Xem tất cả
          </Button>
        }
      />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {list.map((country) => (
            <CountryItem key={country?.id} country={country} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CountryItemProps = {
  country: ItemProps;
};

function CountryItem({ country }: CountryItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" flexGrow={1} sx={{ minWidth: 120 }}>
        <Image
          alt="Ảnh dự án"
          src={`${
            country?.Logo ? country?.Logo : 'https://pmcweb.vn/wp-content/uploads/logo.png'
          } `}
          ratio="1/1"
          sx={{
            borderRadius: 0.65,
            width: 80,
            height: 80,
            mr: 1,
            objectFit: 'contain',
          }}
        />
        <ListItemText
          primary={country?.Duan}
          secondary={country?.Diachi}
          primaryTypographyProps={{ typography: 'subtitle2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />{' '}
      </Stack>

      {/* <Stack direction="row" alignItems="center" sx={{ minWidth: 80 }}>
        <Iconify
          width={14}
          icon="ant-design:android-filled"
          sx={{ mr: 0.5, color: 'text.disabled' }}
        />
        <Typography variant="body2">{fShortenNumber(country?.android)}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ minWidth: 80 }}>
        <Iconify icon="mingcute:windows-fill" width={14} sx={{ mr: 0.5, color: 'text.disabled' }} />
        <Typography variant="body2">{fShortenNumber(country?.windows)}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ minWidth: 80 }}>
        <Iconify icon="mingcute:apple-fill" width={14} sx={{ mr: 0.5, color: 'text.disabled' }} />
        <Typography variant="body2">{fShortenNumber(country?.windows)}</Typography>
      </Stack> */}
    </Stack>
  );
}
