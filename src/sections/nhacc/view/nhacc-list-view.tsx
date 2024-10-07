import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
// @mui
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { alpha } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { useGetGroupPolicy, useGetLoaiNhom, useGetNhacc, useGetNhomts } from 'src/api/taisan';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { LoadingButton } from '@mui/lab';

import { useSnackbar } from 'src/components/snackbar';
import {
  ILoainhom,
  INhaCC,
  INhomts,
  IPhongBanTableFilterValue,
  IPhongBanTableFilters,
} from 'src/types/taisan';
//
import NhaCCTableRow from '../nhacc-table-row';
import NhaCCTableToolbar from '../nhacc-table-toolbar';
import NhaCCTableFiltersResult from '../nhacc-table-filters-result';
import NhaCCNewForm from '../nhacc-new-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Nhacc', label: 'Mã', width: 50 },
  { id: 'MaNhacc', label: 'Mã NCC', width: 80 },
  { id: 'TenNhacc', label: 'Tên NCC', width: 200 },
  { id: 'Masothue', label: 'Mã số thuế', width: 120 },
  { id: 'Sodienthoai', label: 'Số điện thoại', width: 120 },
  { id: 'Sotaikhoan', label: 'Số tài khoản', width: 120 },
  { id: 'Nganhang', label: 'Ngân hàng', width: 120 },
  { id: 'Diachi', label: 'Địa chỉ', width: 120 },
  { id: '', width: 30 },
];

const defaultFilters: IPhongBanTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  publish: [],
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GroupPolicyListView() {
  const table = useTable({ defaultOrderBy: 'ID_Nhacc' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();

  const confirm = useBoolean();

  const confirmAdd = useBoolean();

  const popoverAdd = usePopover();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { nhomts, mutateNhomts } = useGetNhomts();

  const { nhacc, mutateNhacc } = useGetNhacc();

  const [tableData, setTableData] = useState<INhaCC[]>([]);

  const [dataSelect, setDataSelect] = useState<INhaCC>();

  useEffect(() => {
    if (nhacc?.length > 0) {
      setTableData(nhacc);
    }
  }, [nhacc, mutateNhacc]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (dataSelect) {
      setDataSelect({
        ...dataSelect,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setDataSelect((prev: any) => ({
      ...prev,
      [name]: `${value}`,
    }));
  };

  const handleFilters = useCallback(
    (name: string, value: IPhongBanTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const GroupPolicySchema = Yup.object().shape({
    Tennhom: Yup.string().required('Không được để trống'),
  });

  const defaultValues = {
    Tennhom: '',
  };

  const methods = useForm({
    resolver: yupResolver(GroupPolicySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios
        .put(
          `http://localhost:8888/api/v1/ent_nhacc/delete/${id}`,

          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Nhacc !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar('Xóa thành công!');
        })
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    },
    [accessToken, enqueueSnackbar, dataInPage.length, table, tableData] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (data: INhaCC) => {
      confirm.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirm, popover]
  );

  const handleViewAdd = useCallback(() => {
    confirmAdd.onTrue();
    popoverAdd.onClose();
  }, [popoverAdd, confirmAdd]);

  const handleUpdate = useCallback(
    async (id: string) => {
      const dataInsert = {
        MaNhacc: dataSelect?.MaNhacc,
        TenNhacc: dataSelect?.TenNhacc,
        Masothue: dataSelect?.Masothue,
        Sodienthoai: dataSelect?.Sodienthoai,
        Sotaikhoan: dataSelect?.Sotaikhoan,
        Nganhang: dataSelect?.Nganhang,
        Diachi: dataSelect?.Diachi,
        Ghichu: dataSelect?.Ghichu,
      };

      await axios
        .put(`http://localhost:8888/api/v1/ent_nhacc/update/${id}`, dataInsert, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          reset();
          confirm.onFalse();
          popover.onClose();
          mutateNhacc();
          enqueueSnackbar({
            variant: 'success',
            autoHideDuration: 2000,
            message: 'Cập nhật thành công',
          });
        })
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    },
    [accessToken, enqueueSnackbar, dataSelect, reset, confirm, popover, mutateNhacc] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Danh sách nhà cung cấp"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
              { name: 'Danh sách' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
          <LoadingButton
            variant="contained"
            startIcon={<Iconify icon="eva:add-upload-fill" />}
            onClick={handleViewAdd}
          >
            Thêm mới
          </LoadingButton>
        </Stack>

        <Card>
          <NhaCCTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <NhaCCTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Nhacc))
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Nhacc))
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <NhaCCTableRow
                        key={row.ID_Nhacc}
                        row={row}
                        selected={table.selected.includes(row.ID_Nhacc)}
                        onSelectRow={() => table.onSelectRow(row.ID_Nhacc)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Nhacc)}
                        onViewRow={() => handleViewRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered?.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <NhaCCDialog
        open={confirm.value}
        dataSelect={dataSelect}
        onClose={confirm.onFalse}
        onChange={handleInputChange}
        handleUpdate={handleUpdate}
        handleSelectChange={handleSelectChange}
      />

      <NhaCCDialogAdd open={confirmAdd.value} onClose={confirmAdd.onFalse} />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: INhaCC[];
  comparator: (a: any, b: any) => number;
  filters: IPhongBanTableFilters;
  // dateError: boolean;
}) {
  const { status, name, publish } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) =>
        order.MaNhacc.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Masothue.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Sodienthoai.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Sotaikhoan.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Nganhang.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Diachi.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: INhaCC;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  handleSelectChange: any;
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

function NhaCCDialog({
  open,
  dataSelect,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  handleSelectChange,
}: ConfirmTransferDialogProps) {
  const ID_Nhacc = dataSelect?.ID_Nhacc;

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Cập nhật</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ p: 2 }}>
          <TextField
            name="MaNhacc"
            label="Mã nhóm"
            value={dataSelect?.MaNhacc}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            name="TenNhacc"
            label="Tên nhà cung cấp"
            value={dataSelect?.TenNhacc}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />

          <TextField
            name="Masothue"
            label="Mã số thuế"
            value={dataSelect?.Masothue}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            name="Sodienthoai"
            label="Số điện thoại"
            value={dataSelect?.Sodienthoai}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            name="Sotaikhoan"
            label="Số tài khoản"
            value={dataSelect?.Sotaikhoan}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            name="Nganhang"
            label="Tên ngân hàng"
            value={dataSelect?.Nganhang}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            name="Diachi"
            label="Địa chỉ"
            value={dataSelect?.Diachi}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            name="Ghichu"
            multiline
            rows={3}
            label="Ghi chu"
            value={dataSelect?.Ghichu}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            if (ID_Nhacc) {
              handleUpdate(ID_Nhacc);
            }
          }}
        >
          Cập nhật
        </Button>
        <Button onClick={onClose}>Hủy</Button>
      </DialogActions>
    </Dialog>
  );
}

function NhaCCDialogAdd({ open, onClose }: any) {
  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>

      <DialogContent sx={{ overflow: 'hidden', height: 'auto' }}>
        <Grid spacing={3}>
          <NhaCCNewForm />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}