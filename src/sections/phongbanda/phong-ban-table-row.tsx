import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
// @mui
import Box from '@mui/material/Box';
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
import { IGroupPolicy, IPhongbanda, IPolicy } from 'src/types/taisan';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';

// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)({
  overflow: 'hidden',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'nowrap', // Prevent wrapping
  textOverflow: 'ellipsis', // Display ellipsis for truncated text
  maxWidth: '200px', // Set a max width for truncation
});

type Props = {
  row: IPhongbanda;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function CalvTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const {
    ID_Phongban,
    ID_Chinhanh,
    ID_Nhompb,
    Mapb,
    Thuoc,
    Tenphongban,
    Diachi,
    Ghichu,
    ent_chinhanh,
    ent_nhompb,
    ent_duan,
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow
      hover
      selected={selected}
      sx={{
        '& .MuiTableCell-root': {
          borderBottom: '2px solid rgba(0, 0, 0, 0.05)', // Thicker border
        },
      }}
    >
      <StyledTableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          PB-{ID_Phongban}
        </Box>
      </StyledTableCell>

      <StyledTableCell> {Mapb} </StyledTableCell>
      <StyledTableCell> {Tenphongban} </StyledTableCell>
      <StyledTableCell> {Thuoc} </StyledTableCell>
      <StyledTableCell> {ent_chinhanh.Tenchinhanh} </StyledTableCell>
      <StyledTableCell> {ent_duan.Duan} </StyledTableCell>
      <StyledTableCell> {Diachi}</StyledTableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="PMC thông báo"
        content="Bạn có thực sự muốn xóa không?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      /> */}
    </>
  );
}
