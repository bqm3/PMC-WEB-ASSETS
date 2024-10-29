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
import { useGetConNguoi, useGetChinhanh, useGetNhomPb, useGetPhongBanDa } from 'src/api/taisan';
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
// types
import { IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';

import {
  IConnguoi,
  INhompb,
  ITaisanTableFilters,
  IUserTableFilters,
  IUserTableFilterValue,
} from 'src/types/taisan';
//
import CreateUserTableRow from '../create-user-table-row';
import UserTableToolbar from '../create-user-table-toolbar';
import UserTableFiltersResult from '../create-user-filters-result';
import UserNewEditForm from '../create-user-new-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Connguoi', label: 'Mã', width: 50 },
  { id: 'MaPMC', label: 'Mã truy cập', width: 100 },
  { id: 'Hoten', label: 'Họ tên', width: 120 },
  { id: 'Diachi', label: 'Địa chỉ', width: 120 },
  { id: 'Sodienthoai', label: 'Số điện thoại', width: 80 },
  { id: 'iTinhtrang', label: 'Tình trạng', width: 80 },
  { id: 'Tenphongban', label: 'Phòng ban', width: 120 },
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
  const table = useTable({ defaultOrderBy: 'ID_Connguoi' });

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

  const { connguoi, mutateConnguoi } = useGetConNguoi();

  const { nhompb } = useGetNhomPb();
  const { chinhanh } = useGetChinhanh();

  const [tableData, setTableData] = useState<IConnguoi[]>([]);

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
    if (connguoi?.length > 0) {
      setTableData(connguoi);
    }
  }, [connguoi, mutateConnguoi]);

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

  const handleInputShowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (dataShow) {
      // Update the corresponding field in `dataSelect`
      setDataShow({
        ...dataShow,
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

  const handleInputShowDate = (date: any) => {
    if (dataShow) {
      // Update the corresponding field in `dataSelect`
      setDataShow({
        ...dataShow,
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
        .put(`https://checklist.pmcweb.vn/pmc-assets/api/v1/ent_connguoi/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Connguoi !== id);
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
    (data: IConnguoi) => {
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
        .get(`https://checklist.pmcweb.vn/pmc-assets/api/v1/ent_connguoi/${id}`, {
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
        .put(`https://checklist.pmcweb.vn/pmc-assets/api/v1/ent_connguoi/update/${id}`, dataSelect, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          confirm.onFalse();
          popover.onClose();
          await mutateConnguoi();

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
    [enqueueSnackbar, accessToken, dataSelect, confirm, popover, mutateConnguoi] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleUpdateStatus = useCallback(
    async (id: string, status: string) => {
      setLoadingShow(true);
      await axios
        .put(`https://checklist.pmcweb.vn/pmc-assets/api/v1/ent_connguoi/status/${id}/${status}`, dataShow, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          confirmShow.onFalse();
          popoverShow.onClose();
          await mutateConnguoi();
          setLoadingShow(false);
          enqueueSnackbar({
            variant: 'success',
            autoHideDuration: 2000,
            message: 'Cập nhật thành công',
          });
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
    [enqueueSnackbar, accessToken, dataShow, confirmShow, popoverShow, mutateConnguoi] // Add accessToken and enqueueSnackbar as dependencies
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{
          mb: { xs: 1, md: 2 },
        }}>
          <CustomBreadcrumbs
            heading="Danh sách nhân sự"
            links={[
              {
                name: '',
                href: paths.dashboard.root,
              },
            ]}

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
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Connguoi))
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
                //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Connguoi))
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
                        key={row.ID_Connguoi}
                        row={row}
                        selected={table.selected.includes(row.ID_Connguoi)}
                        onSelectRow={() => table.onSelectRow(row.ID_Connguoi)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Connguoi)}
                        onShowRow={() => handleShowRow(row.ID_Connguoi)}
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

      <UserShowDialog
        open={confirmShow.value}
        dataSelect={dataShow}
        onClose={confirmShow.onFalse}
        onChange={handleInputShowChange}
        loadingShow={loadingShow}
        handleInputDate={handleInputShowDate}
        handleUpdate={handleUpdateStatus}
        nhompb={nhompb}
      />

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
  inputData: IConnguoi[];
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
    inputData = inputData.filter((product) =>
      product.ent_nhansupbda.some(
        (item) =>
          `${item.iTinhtrang}` === '1' &&
          chinhanh.includes(item.ent_phongbanda.ent_chinhanh.Tenchinhanh)
      )
    );
  }
  if (phongban.length) {
    inputData = inputData.filter((product) =>
      product.ent_nhansupbda.some(
        (item) =>
          `${item.iTinhtrang}` === '1' && phongban.includes(item.ent_phongbanda.ent_nhompb.Nhompb)
      )
    );
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: IConnguoi;
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
  const ID_Connguoi = dataSelect?.ID_Connguoi;
  const { phongbanda } = useGetPhongBanDa();
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>

      <DialogContent dividers={scroll === 'paper'}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="MaPMC"
                label="Mã PMC"
                value={dataSelect?.MaPMC}
                onChange={onChange}
                fullWidth
                onBlur={onBlur}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="Hoten"
                label="Họ tên"
                value={dataSelect?.Hoten}
                onChange={onChange}
                fullWidth
                onBlur={onBlur}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="Diachi"
                label="Địa chỉ"
                value={dataSelect?.Diachi}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="Sodienthoai"
                label="Số điện thoại"
                value={dataSelect?.Sodienthoai}
                onChange={onChange}
                fullWidth
                onBlur={onBlur}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Giới tính</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={dataSelect?.Gioitinh}
                  name="Gioitinh"
                  onChange={handleSelectChange}
                  row
                >
                  <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                  <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                  <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {/* <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={phongbanda}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option?.Tenphongban || ''
                }
                value={
                  phongbanda.find(
                    (option) =>
                      option.ID_Phongban ===
                      dataSelect?.ent_nhansupbda[0]?.ent_phongbanda?.ID_Phongban
                  ) || null
                }
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Phòng ban dự án"
                    name="ID_Phongban"
                    onChange={onChange}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={6}>
              <DatePicker
                sx={{ width: '100%' }}
                label="Ngày ghi nhận"
                onChange={(val) => handleInputDate(val)}
                value={dataSelect?.NgayGhinhan ? new Date(dataSelect.NgayGhinhan) : null}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                multiline
                rows={2}
                name="Ghichu"
                label="Ghi chú"
                value={dataSelect?.Ghichu}
                onChange={onChange}
                fullWidth
                onBlur={onBlur}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            if (ID_Connguoi) {
              handleUpdate(ID_Connguoi);
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

function UserShowDialog({
  open,
  dataSelect,
  onChange,
  onClose,
  loadingShow,
  onBlur,
  handleUpdate,
  handleInputDate,
}: any) {
  const ID_Connguoi = dataSelect?.ID_Connguoi;
  const { phongbanda } = useGetPhongBanDa();
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const { enqueueSnackbar } = useSnackbar();

  const sortedData = dataSelect?.ent_nhansupbda?.sort((a: any, b: any) => {
    if (a.iTinhtrang !== b.iTinhtrang) {
      return b.iTinhtrang - a.iTinhtrang;
    }

    const dateA = new Date(a.Ngayvao).getTime();
    const dateB = new Date(b.Ngayvao).getTime();
    return dateA - dateB;
  });

  const [selectedValue, setSelectedValue] = useState('0');

  const handleRadioChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Cập nhật phòng ban</DialogTitle>

      <DialogContent dividers={scroll === 'paper'}>
        {loadingShow === true ? (
          <Stack spacing={3} sx={{ p: 3, alignItems: 'center' }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ p: 2 }}>
            <Timeline position="alternate">
              {sortedData?.map((item: any, index: number) => {
                let color: any;
                let position: any;
                switch (`${item.iTinhtrang}`) {
                  case '1':
                    color = 'success'; // xanh
                    position = 'right';
                    break;
                  case '2':
                    color = 'warning'; // vàng
                    position = 'left';
                    break;
                  case '3':
                    color = 'error'; // đỏ
                    position = 'left';
                    break;
                  default:
                    color = 'grey';
                    position = 'left';
                    break;
                }

                return (
                  <TimelineItem key={index} position={position}>
                    <TimelineOppositeContent variant="caption" sx={{ m: 'auto 0' }}>
                      {item.iTinhtrang === '1' ? (
                        `Ngày vào: ${item.Ngayvao}`
                      ) : (
                        <>
                          Ngày vào: {item.Ngayvao}
                          <br />
                          {item.Ngay && `Ngày ra: ${item.Ngay}`}
                        </>
                      )}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={color} />
                      {index < sortedData.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ px: 2 }}>
                      <Typography variant="subtitle1">{item.ent_phongbanda.Tenphongban}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.ent_phongbanda.Diachi}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
            {dataSelect?.ent_nhansupbda?.length > 0 ? (
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Trạng thái</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={selectedValue}
                  onChange={handleRadioChange}
                  name="radio-buttons-group"
                >
                  <FormControlLabel value="2" control={<Radio />} label="Chuyển công tác" />
                  <FormControlLabel value="3" control={<Radio />} label="Nghỉ việc" />
                </RadioGroup>
              </FormControl>
            ) : (
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Trạng thái</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={selectedValue}
                  onChange={handleRadioChange}
                  name="radio-buttons-group"
                >
                  <FormControlLabel value="1" control={<Radio />} label="Đang làm việc" />
                </RadioGroup>
              </FormControl>
            )}

            {(selectedValue === '2' || selectedValue === '1') && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Phòng ban</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="ID_Phongban"
                      value={dataSelect.ID_Phongban}
                      label="Age"
                      onChange={onChange}
                    >
                      {phongbanda.map((item) => (
                        <MenuItem value={item.ID_Phongban}>{item.Tenphongban}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    sx={{ width: '100%' }}
                    label="Ngày ghi nhận"
                    onChange={(val) => handleInputDate(val)}
                    value={dataSelect?.NgayGhinhan ? new Date(dataSelect.NgayGhinhan) : null}
                  />
                </Grid>
              </Grid>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="contained"
          color="info"
          loading={loadingShow}
          onClick={() => {
            if (ID_Connguoi && dataSelect.ID_Phongban) {
              handleUpdate(ID_Connguoi, selectedValue);
            } else {
              enqueueSnackbar({
                variant: 'error',
                autoHideDuration: 2000,
                message: `Thiếu phòng ban dự án`,
              });
            }
          }}
        >
          Cập nhật
        </LoadingButton>
        <Button onClick={onClose}>Hủy</Button>
      </DialogActions>
    </Dialog>
  );
}

function UserDialogAdd({ open, onClose }: any) {
  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>

      <DialogContent sx={{ overflow: 'hidden', height: 'auto' }}>
        <Grid spacing={3}>
          <UserNewEditForm />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
