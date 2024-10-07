import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IPhieuNCC, IPhieuNX } from 'src/types/taisan';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';

// ----------------------------------------------------------------------

type Props = {
  row: IPhieuNCC;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onCloseRow: VoidFunction;
};

export default function CalvTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onCloseRow,
}: Props) {
  const {
    ID_PhieuNCC,
    ID_Nghiepvu,
    Sophieu,
    ID_NoiNhap,
    ID_NoiXuat,
    ID_Connguoi,
    NgayNX,
    Ghichu,
    ID_Nam,
    ID_Thang,
    iTinhtrang,
    NoiNhap,
    NoiXuat,
    ent_nghiepvu,
    ent_nam,
    ent_thang,
    ent_user,
  } = row;

  const confirm1 = useBoolean();
  const confirm2 = useBoolean();

  const collapse = useBoolean();

  const popover1 = usePopover();
  const popover2 = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}  sx={{
      '& .MuiTableCell-root': {
        borderBottom: '2px solid rgba(0, 0, 0, 0.05)', // Thicker border
      },
    }}>
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          PNX-{ID_PhieuNCC}
        </Box>
      </TableCell>

      <TableCell> {ent_nghiepvu?.Nghiepvu} </TableCell>
      <TableCell> {Sophieu} </TableCell>
      {/* <TableCell> {moment(NgayNX).format('DD-MM-YYYY')} </TableCell> */}
      <TableCell> {NgayNX} </TableCell>
      <TableCell sx={{ alignItems: 'center' }}>
        <ListItemText
          primary={NoiNhap?.Tenphongban}
          secondary={NoiNhap?.Mapb}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell sx={{ alignItems: 'center' }}>
        <ListItemText
          primary={NoiXuat?.Tenphongban}
          secondary={NoiXuat?.Mapb}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell> {ent_user?.Hoten} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (`${iTinhtrang}` === '1' && 'default') ||
            (`${iTinhtrang}` === '0' && 'success') ||
            'default'
          }
        >
          {`${iTinhtrang}` === '1' && 'Khóa'}
          {`${iTinhtrang}` === '0' && 'Mở'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover1.open ? 'inherit' : 'default'} onClick={popover1.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover1.open || popover2.open}
        onClose={popover1.onClose || popover2.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover1.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem
        </MenuItem>
        {`${iTinhtrang}` === '0' && (
          <MenuItem
            onClick={() => {
              confirm2.onTrue();
              popover1.onClose();
            }}
          >
            <Iconify icon="solar:lock-keyhole-bold-duotone" style={{ color: 'black' }} />
            Khóa
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            confirm1.onTrue();
            popover1.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm1.value}
        onClose={confirm1.onFalse}
        title="PMC thông báo"
        content="Bạn có thực sự muốn xóa không?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      />

      <ConfirmDialog
        open={confirm2.value}
        onClose={confirm2.onFalse}
        onSubmit={confirm2.onFalse}
        onClick={confirm2.onFalse}
        title="PMC thông báo"
        content="Bạn có thực sự muốn đóng phiếu không?"
        action={
          <Button variant="contained" color="warning" onClick={onCloseRow}>
            Đồng ý
          </Button>
        }
      />
    </>
  );
}
