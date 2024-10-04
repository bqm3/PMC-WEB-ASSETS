import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
// @mui
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
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
import {
  useGetConNguoi,
  useGetChinhanh,
  useGetNhomPb,
  useGetPhongBanDa,
  useGetUser,
  useGetChucvu,
  useGetLoaiNhom,
} from 'src/api/taisan';
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
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingButton } from '@mui/lab';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {
  IConnguoi,
  INhompb,
  ITaisanTableFilters,
  IUser,
  IUserTableFilters,
  IUserTableFilterValue,
} from 'src/types/taisan';
//
import UserNewEditForm from '../create-user-new-form';
import CreateUserTableRow from '../create-user-table-row';
import UserTableToolbar from '../create-user-table-toolbar';
import UserTableFiltersResult from '../create-user-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_User', label: 'Mã', width: 50 },
  { id: 'MaPMC', label: 'Mã truy cập', width: 80 },
  { id: 'Hoten', label: 'Họ tên', width: 120 },
  { id: 'ID_Phongban', label: 'Dự án', width: 80 },
  { id: 'ID_Chucvu', label: 'Chức vụ', width: 80 },
  { id: 'ID_Nhompb', label: 'Phòng ban', width: 80 },
  { id: 'ID_Chinhanh', label: 'Chi nhánh', width: 80 },

  { id: '', width: 30 },
];

const defaultFilters: IUserTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  chinhanh: [],
  phongban: [],
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GroupPolicyListView() {
  const table = useTable({ defaultOrderBy: 'ID_User' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();
  const popoverAdd = usePopover();
  const popoverShow = usePopover();

  const confirm = useBoolean();
  const confirmAdd = useBoolean();
  const confirmShow = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { user, mutateUser } = useGetUser();

  const { nhompb } = useGetNhomPb();
  const { chinhanh } = useGetChinhanh();

  const [tableData, setTableData] = useState<IUser[]>([]);

  const [dataSelect, setDataSelect] = useState<any>();
  const [dataShow, setDataShow] = useState<any>();
  const [loadingShow, setLoadingShow] = useState<boolean>();

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState<any>([]);
  const [STATUS_OPTIONS_PB, set_STATUS_OPTIONS_PB] = useState<any>([]);

  useEffect(() => {
    if (chinhanh) {
      set_STATUS_OPTIONS(
        chinhanh.map((data: any) => ({
          value: data.Tenchinhanh,
          label: data.Tenchinhanh,
        }))
      );
    }

    if (nhompb) {
      set_STATUS_OPTIONS_PB(
        nhompb.map((data: any) => ({
          value: data.Nhompb,
          label: data.Nhompb,
        }))
      );
    }
  }, [chinhanh, nhompb]);

  useEffect(() => {
    if (user?.length > 0) {
      setTableData(user);
    }
  }, [user, mutateUser]);

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
      // Update the corresponding field in `dataSelect`
      setDataSelect({
        ...dataSelect,
        [name]: value,
      });
    }
  };

  const handleAutocompleteChange = (event: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      // Lưu ID_Phongban vào dataSelect
      setDataSelect({
        ...dataSelect,
        ID_Phongban: value.ID_Phongban, // Lưu ID_Phongban
      });
    } else {
      setDataSelect({
        ...dataSelect,
        ID_Phongban: null, // Đặt lại ID_Phongban nếu không có lựa chọn
      });
    }
  };

  const handleInputDate = (date: any) => {
    if (dataSelect) {
      // Update the corresponding field in `dataSelect`
      setDataSelect({
        ...dataSelect,
        NgayGhinhan: date,
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
    (name: string, value: IUserTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios
        .put(`http://localhost:8888/api/v1/ent_user/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_User !== id);
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
    (data: IUser) => {
      confirm.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirm, popover]
  );

  const handleShowRow = useCallback(
    async (id: string) => {
      setLoadingShow(true);
      confirmShow.onTrue();
      await axios
        .get(`http://localhost:8888/api/v1/ent_user/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          popoverShow.onClose();
          setDataShow(res.data.data);
          setLoadingShow(false);
        })
        .catch((error) => {
          setLoadingShow(false);
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
    [accessToken, confirmShow, popoverShow, enqueueSnackbar]
  );

  const handleUpdate = useCallback(
    async (id: string) => {
      await axios
        .put(`http://localhost:8888/api/v1/ent_user/update/${id}`, dataSelect, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          confirm.onFalse();
          popover.onClose();
          await mutateUser();

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
    [enqueueSnackbar, accessToken, dataSelect, confirm, popover, mutateUser] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleViewAdd = useCallback(() => {
    confirmAdd.onTrue();
    popoverAdd.onClose();
  }, [popoverAdd, confirmAdd]);

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
            heading="Danh sách con người"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
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
          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            statusOptions={STATUS_OPTIONS}
            statusPBOptions={STATUS_OPTIONS_PB}
          />

          {canReset && (
            <UserTableFiltersResult
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
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_User))
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
                  //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_User))
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <CreateUserTableRow
                        key={row.ID_User}
                        row={row}
                        selected={table.selected.includes(row.ID_User)}
                        onSelectRow={() => table.onSelectRow(row.ID_User)}
                        onDeleteRow={() => handleDeleteRow(row.ID_User)}
                        onShowRow={() => handleShowRow(row.ID_User)}
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
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <UserDialog
        open={confirm.value}
        dataSelect={dataSelect}
        onClose={confirm.onFalse}
        onChange={handleInputChange}
        handleInputDate={handleInputDate}
        handleUpdate={handleUpdate}
        nhompb={nhompb}
        handleSelectChange={handleSelectChange}
        handleAutocompleteChange={handleAutocompleteChange}
      />

      {/* <UserShowDialog
        open={confirmShow.value}
        dataSelect={dataShow}
        onClose={confirmShow.onFalse}
        onChange={handleInputChange}
        loadingShow={loadingShow}
        // handleInputDate={handleInputDate}
        // handleUpdate={handleUpdate}
        // nhompb={nhompb}
        // handleSelectChange={handleSelectChange}
        handleAutocompleteChange={handleAutocompleteChange}
      /> */}

      <UserDialogAdd open={confirmAdd.value} onClose={confirmAdd.onFalse} />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: IUser[];
  comparator: (a: any, b: any) => number;
  filters: IUserTableFilters;
  // dateError: boolean;
}) {
  const { status, name, chinhanh, phongban } = filters;

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
        order.Hoten.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Diachi.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Sodienthoai.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.MaPMC.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (chinhanh.length) {
    inputData = inputData.filter((product) => chinhanh.includes(product.ent_chinhanh.Tenchinhanh));
  }
  if (phongban.length) {
    inputData = inputData.filter((product) => phongban.includes(product.ent_nhompb.Nhompb));
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: IUser;
  onClose: VoidFunction;
  nhompb: INhompb[];
  handleUpdate: (id: string) => void;
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSelectChange: any;
  handleInputDate: any;
  handleAutocompleteChange: any;
}

function UserDialog({
  open,
  dataSelect,
  nhompb,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  handleSelectChange,
  handleInputDate,
  handleAutocompleteChange,
}: ConfirmTransferDialogProps) {
  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>Cập nhật</DialogTitle>

      <DialogContent sx={{ overflow: 'hidden', height: 'auto' }}>
        <Grid spacing={3}>
          <UserNewEditForm currentUser={dataSelect} />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

function UserDialogAdd({ open, onClose }: any) {
  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>

      <DialogContent sx={{ overflow: 'hidden', height: 'auto' }}>
        <Grid spacing={3}>
          <UserNewEditForm />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
