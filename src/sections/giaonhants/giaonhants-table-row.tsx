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
import { IPhieuGN, IPhieuNX } from 'src/types/taisan';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';

// ----------------------------------------------------------------------

type Props = {
  row: IPhieuGN;
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
    ID_Giaonhan,
    ID_Phongban,
    iGiaonhan,
    Nguoinhan,
    Nguoigiao,
    Ngay,
    ID_Quy,
    ID_Nam,
    Ghichu,
    ent_phongbanda,
    NguoinhanInfo,
    NguoigiaoInfo,
    ent_quy,
    ent_nam,
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
          PNX-{ID_Giaonhan}
        </Box>
      </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (`${iGiaonhan}` === '2' && 'info') ||
            (`${iGiaonhan}` === '1' && 'success') ||
            'info'
          }
        >
          {`${iGiaonhan}` === '2' && 'Trả tài sản'}
          {`${iGiaonhan}` === '1' && 'Giao tài sản'}
        </Label>
      </TableCell>
      <TableCell> {ent_phongbanda?.Tenphongban} </TableCell>
      <TableCell> {NguoinhanInfo?.ent_connguoi?.Hoten} </TableCell>
      <TableCell> {NguoigiaoInfo?.ent_connguoi?.Hoten} </TableCell>
      
      <TableCell> {Ngay} </TableCell>
      <TableCell> {ent_quy?.Quy} </TableCell>
      <TableCell> {ent_nam?.Nam} </TableCell>
      

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
        {/* {`${iTinhtrang}` === '0' && (
          <MenuItem
            onClick={() => {
              confirm2.onTrue();
              popover1.onClose();
            }}
          >
            <Iconify icon="solar:lock-keyhole-bold-duotone" style={{ color: 'black' }} />
            Khóa
          </MenuItem>
        )} */}
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
