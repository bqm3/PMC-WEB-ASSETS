import React, { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
// @mui
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormContext, useFieldArray, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
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
  useGetGroupPolicy,
  useGetPolicy,
  useGetTaisan,
  useGetNhomts,
  useGetDonvi,
  useGetTaisanQrCode,
} from 'src/api/taisan';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
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
  TablePaginationCustom,
} from 'src/components/table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Image from 'src/components/image';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CircularProgress from '@mui/material/CircularProgress';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LoadingButton } from '@mui/lab';

import { useSnackbar } from 'src/components/snackbar';
import { fTimestamp } from 'src/utils/format-time';
// types
import FormProvider, { RHFEditor } from 'src/components/hook-form';

import {
  IDonvi,
  INhomts,
  ITaisan,
  ITaisanQrCode,
  ITaisanTableFilterValue,
  ITaisanTableFilters,
} from 'src/types/taisan';
//
import TaiSanTableRow from '../tai-san-qr-table-row';
import TaiSanQrTableToolbar from '../tai-san-qr-table-toolbar';
import TaiSanQrTableFiltersResult from '../tai-san-qr-table-filters-result';
import TableSelectedAction from '../table-selected-action';
import TableHeadCustom from '../table-head-custom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_TaisanQrcode', label: 'Mã', width: 100 },
  { id: 'ID_Taisan', label: 'Tên tài sản', width: 200 },
  { id: 'Ngaykhoitao', label: 'Ngày', width: 200 },
  { id: 'MaQrCode', label: 'Mã Qr Code', width: 150 },
  { id: 'Giatri', label: 'Giá trị', width: 150 },
  { id: 'iTinhTrang', label: 'Tình trạng', width: 150 },
  { id: 'ID_PhongBan', label: 'Phòng ban', width: 150 },
  { id: 'ID_Connguoi', label: 'Người sử dụng', width: 150 },
  { id: '', width: 88 },
];

const defaultFilters: ITaisanTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GroupPolicyListView() {
  const table = useTable({ defaultOrderBy: 'Ngaykhoitao' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();

  const confirm = useBoolean();

  const confirmShow = useBoolean();

  const confirmDownload = useBoolean();

  const confirmQr = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { taisanqr, mutateTaisanQr } = useGetTaisanQrCode();

  const { nhomts } = useGetNhomts();

  const { donvi } = useGetDonvi();

  const [tableData, setTableData] = useState<ITaisanQrCode[]>([]);

  const [dataSelect, setDataSelect] = useState<ITaisanQrCode>();

  const [dataShow, setDataShow] = useState<any>();

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState([
    { value: 'all', label: 'Tất cả' },
    { value: '0', label: 'Sử dụng' },
    { value: '1', label: 'Sửa chữa' },
    { value: '2', label: 'Thanh lý' },
  ]);

  useEffect(() => {
    if (taisanqr?.length > 0) {
      setTableData(taisanqr);
    }
  }, [taisanqr, mutateTaisanQr]);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
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

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setDataSelect((prev: any) => ({
      ...prev,
      [name]: `${value}`,
    }));
  };

  const handleFilters = useCallback(
    (name: string, value: ITaisanTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const GroupPolicySchema = Yup.object().shape({});

  const defaultValues = useMemo(() => ({}), []);

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
        .put(`https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_taisanqrcode/delete/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_TaisanQrcode !== id);
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

  const handleCreateRow = useCallback(
    (data: ITaisanQrCode) => {
      confirmQr.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirmQr, popover]
  );

  const handleViewRow = useCallback(
    async (data: ITaisanQrCode) => {
      confirm.onTrue();
      popover.onClose();
      await axios
        .get(`https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_taisanqrcode/${data.ID_TaisanQrcode}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataSelect(res.data.data);
        });
    },
    [confirm, popover, accessToken]
  );

  const handleDownloadImage = async () => {
    const originalImage = `https://api.qrserver.com/v1/create-qr-code/?data=${dataSelect?.MaQrCode}`;
    const image = await fetch(originalImage);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = `${dataSelect?.MaQrCode}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImages = async () => {
    try {
      const selectedRows = table.selected;
      const selectedQrCodes = dataInPage
        .filter((row) => selectedRows.includes(row.ID_TaisanQrcode))
        .map((row) => row.MaQrCode);

      const maQrCodes = selectedQrCodes.join(',');

      const response = await axios.post(
        `https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_taisanqrcode/generate-qr-codes?maQrCodes=${maQrCodes}`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob', // Specify the response type as blob to handle the file download
        }
      );

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'qr_codes.zip'); // Set the name for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error while generating QR codes:', error);
    }
  };

  const handleUpdate = useCallback(
    async (id: string) => {
      await axios
        .put(`https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_taisanqrcode/update/${id}`, dataSelect, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          reset();
          confirm.onFalse();
          popover.onClose();
          await mutateTaisanQr();

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
    [accessToken, enqueueSnackbar, reset, confirm, dataSelect, popover, mutateTaisanQr] // Add accessToken and enqueueSnackbar as dependencies
  );

  // const handleShowRow = useCallback(
  //   async (id: string) => {
  //    // setLoadingShow(true);
  //     confirmShow.onTrue();
  //     await axios
  //       .get(`https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_taisanqrcode/detail/${id}`, {
  //         headers: {
  //           Accept: 'application/json',
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       })
  //       .then(async (res) => {
  //         popover.onClose();
  //         setDataShow(res.data);
  //         console.log("data",dataShow)
  //        // setLoadingShow(false);
  //       })
  //       .catch((error) => {
  //        // setLoadingShow(false);
  //         if (error.response) {
  //           enqueueSnackbar({
  //             variant: 'error',
  //             autoHideDuration: 2000,
  //             message: `${error.response.data.message}`,
  //           });
  //         } else if (error.request) {
  //           // Lỗi không nhận được phản hồi từ server
  //           enqueueSnackbar({
  //             variant: 'error',
  //             autoHideDuration: 2000,
  //             message: `Không nhận được phản hồi từ máy chủ`,
  //           });
  //         } else {
  //           // Lỗi khi cấu hình request
  //           enqueueSnackbar({
  //             variant: 'error',
  //             autoHideDuration: 2000,
  //             message: `Lỗi gửi yêu cầu`,
  //           });
  //         }
  //       });
  //   },
  //   [accessToken, confirmShow, dataShow,  popover, enqueueSnackbar]
  // );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách tài sản qrcode"
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

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === '0' && 'success') ||
                      (tab.value === '1' && 'warning') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && taisanqr?.length}
                    {tab.value === '0' &&
                      taisanqr?.filter((item) => `${item.iTinhtrang}` === '0').length}

                    {tab.value === '1' &&
                      taisanqr?.filter((item) => `${item.iTinhtrang}` === '1').length}

                    {tab.value === '2' &&
                      taisanqr?.filter((item) => `${item.iTinhtrang}` === '2').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <TaiSanQrTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            dateError={dateError}
          />

          {canReset && (
            <TaiSanQrTableFiltersResult
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
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_TaisanQrcode))
              }
              action={
                <Tooltip title="Download">
                  <IconButton color="primary" onClick={handleDownloadImages}>
                    <Iconify icon="solar:download-square-bold" />
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, tableData?.map((row) => row.ID_TaisanQrcode))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <TaiSanTableRow
                        key={row.ID_TaisanQrcode}
                        row={row}
                        selected={table.selected.includes(row.ID_TaisanQrcode)}
                        onSelectRow={() => table.onSelectRow(row.ID_TaisanQrcode)}
                        onDeleteRow={() => handleDeleteRow(row.ID_TaisanQrcode)}
                        onCreateRow={() => handleCreateRow(row)}
                        onViewRow={() => handleViewRow(row)}
                      // onShowRow={() => handleShowRow(row.ID_TaisanQrcode)}
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

          {/* <TaisanQRShowDialog
            open={confirmShow.value}
            dataSelect={dataShow}
            onClose={confirmShow.onFalse}
            // onChange={handleInputShowChange}
            // loadingShow={loadingShow}
            // handleInputDate={handleInputShowDate}
            // handleUpdate={handleUpdateStatus}
            // nhompb={nhompb}
          /> */}
        </Card>
      </Container>

      <GroupPolicyDialog
        open={confirm.value}
        dataSelect={dataSelect}
        nhomts={nhomts}
        donvi={donvi}
        onClose={confirm.onFalse}
        onChange={handleInputChange}
        handleUpdate={handleUpdate}
        handleSelectChange={handleSelectChange}
        methods={methods}
        setDataSelect={setDataSelect}
      />

      <Dialog open={confirmQr.value} onClose={confirmQr.onFalse} maxWidth="sm">
        <DialogTitle sx={{ pb: 2 }}>Ảnh Qr Code</DialogTitle>

        <DialogContent>
          <Card>
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${dataSelect?.MaQrCode}&amp;size=300x300`}
              alt=""
              title=""
            />
          </Card>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="success" onClick={handleDownloadImage}>
            Download
          </Button>
          <Button variant="outlined" color="inherit" onClick={confirmQr.onFalse}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
  dateError,
}: {
  inputData: ITaisanQrCode[];
  comparator: (a: any, b: any) => number;
  filters: ITaisanTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

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
        `${order?.ent_phongbanda?.Tenphongban}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.ent_phongbanda?.Mapb}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.MaQrCode}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.ent_taisan?.Tents}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.ent_user?.Hoten}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.Giatri}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      // Đặt endDate vào cuối ngày
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      const startTimestamp = fTimestamp(startDate);
      const endTimestamp = fTimestamp(endDate);
      inputData = inputData.filter((item) => {
        const nxTimestamp = fTimestamp(item.Ngaykhoitao);
        return nxTimestamp >= startTimestamp && nxTimestamp < endTimestamp;
      });
    }
  }

  if (status !== 'all') {
    inputData = inputData?.filter((order) => `${order?.iTinhtrang}` === status);
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: ITaisanQrCode;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  donvi: IDonvi[];
  nhomts: INhomts[];
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSelectChange: any;
  methods: any;
  setDataSelect: any;
}

function GroupPolicyDialog({
  open,
  dataSelect,
  donvi,
  nhomts,
  methods,
  handleSelectChange,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  setDataSelect,
}: ConfirmTransferDialogProps) {
  const idPolicy = dataSelect?.ID_TaisanQrcode;
  const { taisan } = useGetTaisan();
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
        <DialogTitle>Cập nhật</DialogTitle>

        <DialogContent dividers={scroll === 'paper'}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack style={{ display: 'flex', flexDirection: 'row' }} spacing={3}>
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                fullWidth
                disableClearable
                value={dataSelect?.ent_taisan.Tents || ''}
                options={taisan.map((option) => option.Tents)}
                onChange={(event, newValue) => {
                  // Find the selected option in the list
                  const selectedOption = taisan.find((option) => option.Tents === newValue);
                  // Update the state with the selected ID_Taisan
                  setDataSelect((prevData: any) => ({
                    ...prevData,
                    ID_Taisan: selectedOption ? selectedOption.ID_Taisan : '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tên tài sản"
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                  />
                )}
              />

              <TextField
                type="number"
                InputLabelProps={{ shrink: true }}
                name="Nambdsd"
                label="Năm sử dụng"
                value={dataSelect?.Nambdsd}
                fullWidth
              />
              <TextField
                type="number"
                name="Namsx"
                InputLabelProps={{ shrink: true }}
                label="Năm sản xuất"
                value={dataSelect?.Namsx}
                fullWidth
              />
            </Stack>

            <Stack style={{ display: 'flex', flexDirection: 'row' }} spacing={3}>
              <TextField
                name="Ghichu"
                label="Ghi chú"
                value={dataSelect?.Ghichu}
                onChange={onChange}
                fullWidth
                multiline
                rows={2}
                onBlur={onBlur}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              if (idPolicy) {
                handleUpdate(idPolicy);
              }
            }}
          >
            Cập nhật
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

function TaisanQRShowDialog({
  open,
  dataSelect,
  onChange,
  onClose,
  loadingShow,
  onBlur,
  handleUpdate,
  handleInputDate,
}: any) {
  const ID_Connguoi = dataSelect?.ID_TaisanQrcode;
  //  const { phongbanda } = useGetPhongBanDa();
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
      <DialogTitle>Chi tiết tài sản</DialogTitle>

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
                        `Ngày vào: ${item?.Ngayvao}`
                      ) : (
                        <>
                          Ngày vào: {item?.Ngayvao}
                          <br />
                          {item?.Ngay && `Ngày ra: ${item?.Ngay}`}
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
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
