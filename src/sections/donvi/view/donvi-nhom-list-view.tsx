import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { PATH_URL } from 'src/config-global';
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
import {
  useGetDonvi,
  useGetGroupPolicy,
  useGetLoaiNhom,
  useGetNhomts,
  useGetHang,
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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { LoadingButton } from '@mui/lab';

import { useSnackbar } from 'src/components/snackbar';
// types
import { IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';

import {
  IDonvi,
  IHang,
  ILoainhom,
  INhomts,
  ITaisanTableFilterValue,
  ITaisanTableFilters,
} from 'src/types/taisan';
//
import LoaiNhomTableRow from '../nhom-table-row';
import LoaiNhomTableToolbar from '../nhom-table-toolbar';
import LoaiNhomTableFiltersResult from '../nhom-table-filters-result';
import LoaiNhomNewForm from '../nhom-new-form';

import DonViTableRow from '../donvi-table-row';
import DonViTableToolbar from '../donvi-table-toolbar';
import DonViTableFiltersResult from '../donvi-table-filters-result';
import DonViNewForm from '../donvi-new-form';

import HangTableRow from '../hang-table-row';
import HangTableToolbar from '../hang-table-toolbar';
// import DonViTableFiltersResult from '../donvi-table-filters-result';
import HangNewForm from '../hang-new-form';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Loainhom', label: 'Mã', width: 50 },
  { id: 'Loainhom', label: 'Loại nhóm', width: 150 },
  { id: '', width: 50 },
];

const TABLE_HEAD_DONVI = [
  { id: 'ID_Donvi', label: 'Mã', width: 50 },
  { id: 'Donvi', label: 'Đơn vị', width: 150 },
  { id: '', width: 50 },
];

const TABLE_HEAD_HANG = [
  { id: 'ID_Hang', label: 'Mã', width: 50 },
  { id: 'Tenhang', label: 'Tên hãng', width: 150 },
  { id: '', width: 50 },
];

const defaultFilters: ITaisanTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const defaultFiltersDonVi: ITaisanTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const defaultFiltersHang: ITaisanTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function DonViNhomListView() {
  const table = useTable({ defaultOrderBy: 'ID_Loainhom' });
  const tableDonVi = useTable({ defaultOrderBy: 'ID_Donvi' });
  const tableHang = useTable({ defaultOrderBy: 'ID_Hang' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();

  const popoverDonvi = usePopover();

  const popoverHang = usePopover();

  const confirm = useBoolean();

  const confirmDonVi = useBoolean();

  const confirmHang = useBoolean();

  const confirmAdd = useBoolean();

  const confirmAddDonVi = useBoolean();

  const confirmAddHang = useBoolean();

  const popoverAdd = usePopover();

  const popoverAddDonVi = usePopover();
  const popoverAddHang = usePopover();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const [filtersDonVi, setFiltersDonVi] = useState(defaultFiltersDonVi);

  const [filtersHang, setFiltersHang] = useState(defaultFiltersHang);

  const { loainhom, mutateLoainhom } = useGetLoaiNhom();

  const { donvi, mutateDonvi } = useGetDonvi();

  const { hang, mutateHang } = useGetHang();

  const [tableDataHang, setTableDataHang] = useState<IHang[]>([]);
  const [tableDataDonVi, setTableDataDonVi] = useState<IDonvi[]>([]);

  const [tableDataLoaiNhom, setTableDataLoaiNhom] = useState<ILoainhom[]>([]);

  const [dataSelectLoaiNhom, setDataSelectLoaiNhom] = useState<ILoainhom>();
  const [dataSelectDonVi, setDataSelectDonVi] = useState<IDonvi>();
  const [dataSelectHang, setDataSelectHang] = useState<IHang>();

  useEffect(() => {
    if (loainhom?.length > 0) {
      setTableDataLoaiNhom(loainhom);
    }
  }, [loainhom, mutateLoainhom]);

  useEffect(() => {
    if (donvi?.length > 0) {
      setTableDataDonVi(donvi);
    }
  }, [donvi, mutateDonvi]);

  useEffect(() => {
    if (hang?.length > 0) {
      setTableDataHang(hang);
    }
  }, [hang, mutateHang]);

  const dataFilteredLoaiNhom = applyFilterLoaiNhom({
    inputData: tableDataLoaiNhom,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataFilteredDonVi = applyFilterDonVi({
    inputData: tableDataDonVi,
    comparator: getComparator(tableDonVi.order, tableDonVi.orderBy),
    filters: filtersDonVi,
  });

  const dataFilteredHang = applyFilterHang({
    inputData: tableDataHang,
    comparator: getComparator(table.order, table.orderBy),
    filters: filtersHang,
  });

  const dataInPageLoaiNhom = dataFilteredLoaiNhom?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const dataInPageDonVi = dataFilteredDonVi?.slice(
    tableDonVi.page * tableDonVi.rowsPerPage,
    tableDonVi.page * tableDonVi.rowsPerPage + tableDonVi.rowsPerPage
  );

  const dataInPageHang = dataFilteredHang?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const denseHeightDonVi = tableDonVi.dense ? 52 : 72;
  const denseHeightHang = tableDonVi.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';
  const canResetDonVi = !!filtersDonVi.name || filtersDonVi.status !== 'all';
  const canResetHang = !!filtersHang.name || filtersHang.status !== 'all';

  const notFoundLoaiNhom =
    (!dataFilteredLoaiNhom?.length && canReset) || !dataFilteredLoaiNhom?.length;
  const notFoundDonVi = (!dataFilteredDonVi?.length && canResetDonVi) || !dataFilteredDonVi?.length;
  const notFoundHang = (!dataFilteredHang?.length && canResetHang) || !dataFilteredHang?.length;

  const handleInputChangeLoaiNhom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (dataSelectLoaiNhom) {
      // Update the corresponding field in `dataSelect`
      setDataSelectLoaiNhom({
        ...dataSelectLoaiNhom,
        [name]: value,
      });
    }
  };

  const handleInputChangeDonVi = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (dataSelectDonVi) {
      // Update the corresponding field in `dataSelect`
      setDataSelectDonVi({
        ...dataSelectDonVi,
        [name]: value,
      });
    }
  };

  const handleInputChangeHang = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (dataSelectHang) {
      // Update the corresponding field in `dataSelect`
      setDataSelectHang({
        ...dataSelectHang,
        [name]: value,
      });
    }
  };

  const handleSelectChangeLoaiNhom = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setDataSelectLoaiNhom((prev: any) => ({
      ...prev,
      [name]: `${value}`,
    }));
  };

  const handleSelectChangeDonVi = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setDataSelectDonVi((prev: any) => ({
      ...prev,
      [name]: `${value}`,
    }));
  };

  const handleSelectChangeHang = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setDataSelectHang((prev: any) => ({
      ...prev,
      [name]: `${value}`,
    }));
  };

  const handleFilters = useCallback(
    (name: string, value: IKhuvucTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleFiltersDonVi = useCallback(
    (name: string, value: IKhuvucTableFilterValue) => {
      tableDonVi.onResetPage();
      setFiltersDonVi((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [tableDonVi]
  );

  const handleFiltersHang = useCallback(
    (name: string, value: IKhuvucTableFilterValue) => {
      tableDonVi.onResetPage();
      setFiltersHang((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [tableDonVi]
  );

  const LoaiNhomSchema = Yup.object().shape({
    Loainhom: Yup.string().required('Không được để trống'),
  });

  const defaultValues = {
    Loainhom: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoaiNhomSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDeleteRowLoaiNhom = useCallback(
    async (id: string) => {
      await axios
        .put(
          `${PATH_URL}/ent_loainhom/delete/${id}`,

          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          // reset();
          const deleteRow = tableDataLoaiNhom?.filter((row) => row.ID_Loainhom !== id);
          setTableDataLoaiNhom(deleteRow);

          table.onUpdatePageDeleteRow(dataInPageLoaiNhom.length);
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
    [accessToken, enqueueSnackbar, dataInPageLoaiNhom.length, table, tableDataLoaiNhom] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleDeleteRowDonVi = useCallback(
    async (id: string) => {
      await axios
        .put(
          `${PATH_URL}/ent_donvi/delete/${id}`,

          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          // reset();
          const deleteRow = tableDataDonVi?.filter((row) => row.ID_Donvi !== id);
          setTableDataDonVi(deleteRow);

          tableDonVi.onUpdatePageDeleteRow(dataInPageDonVi.length);
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
    [accessToken, enqueueSnackbar, dataInPageDonVi.length, tableDonVi, tableDataDonVi] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleDeleteRowHang = useCallback(
    async (id: string) => {
      await axios
        .put(
          `${PATH_URL}/ent_hang/delete/${id}`,

          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          // reset();
          const deleteRow = tableDataHang?.filter((row) => row.ID_Hang !== id);
          setTableDataHang(deleteRow);

          tableHang.onUpdatePageDeleteRow(dataInPageHang.length);
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
    [accessToken, enqueueSnackbar, dataInPageHang.length, tableHang, tableDataHang] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRowLoaiNhom = useCallback(
    (data: ILoainhom) => {
      confirm.onTrue();
      popover.onClose();
      setDataSelectLoaiNhom(data);
    },
    [confirm, popover]
  );

  const handleViewRowDonVi = useCallback(
    (data: IDonvi) => {
      confirmDonVi.onTrue();
      popoverDonvi.onClose();
      setDataSelectDonVi(data);
    },
    [confirmDonVi, popoverDonvi]
  );

  const handleViewRowHang = useCallback(
    (data: IHang) => {
      confirmHang.onTrue();
      popoverHang.onClose();
      setDataSelectHang(data);
    },
    [confirmHang, popoverHang]
  );

  const handleViewAdd = useCallback(() => {
    confirmAdd.onTrue();
    popoverAdd.onClose();
  }, [popoverAdd, confirmAdd]);

  const handleViewAddDonVi = useCallback(() => {
    confirmAddDonVi.onTrue();
    popoverAddDonVi.onClose();
  }, [popoverAddDonVi, confirmAddDonVi]);

  const handleViewAddHang = useCallback(() => {
    confirmAddHang.onTrue();
    popoverAddHang.onClose();
  }, [popoverAddHang, confirmAddHang]);

  const handleUpdate = useCallback(
    async (id: string) => {
      await axios
        .put(
          `${PATH_URL}/ent_loainhom/update/${id}`,
          {
            Loainhom: dataSelectLoaiNhom?.Loainhom,
            ID_Loainhom: dataSelectLoaiNhom?.ID_Loainhom,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(async (res) => {
          reset();
          confirm.onFalse();
          popover.onClose();
          mutateLoainhom();
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
    [accessToken, enqueueSnackbar, dataSelectLoaiNhom, reset, confirm, popover, mutateLoainhom] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleUpdateDonVi = useCallback(
    async (id: string) => {
      await axios
        .put(
          `${PATH_URL}/ent_donvi/update/${id}`,
          {
            Donvi: dataSelectDonVi?.Donvi,
            ID_Donvi: dataSelectDonVi?.ID_Donvi,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(async (res) => {
          reset();
          confirmDonVi.onFalse();
          popoverDonvi.onClose();
          mutateDonvi();
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
    [accessToken, enqueueSnackbar, dataSelectDonVi, reset, confirmDonVi, popoverDonvi, mutateDonvi] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleUpdateHang = useCallback(
    async (id: string) => {
      await axios
        .put(
          `${PATH_URL}/ent_hang/update/${id}`,
          {
            Tenhang: dataSelectHang?.Tenhang,
            ID_Hang: dataSelectHang?.ID_Hang,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(async (res) => {
          reset();
          confirmHang.onFalse();
          popoverHang.onClose();
          mutateHang();
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
    [accessToken, enqueueSnackbar, dataSelectHang, reset, confirmHang, popoverHang, mutateHang] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Grid container>
        <Grid xs={12} md={6} mt={2}>
          <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <CustomBreadcrumbs
                heading="Danh sách loại nhóm"
                links={[
                  {
                    name: '',
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
              <LoaiNhomTableToolbar
                filters={filters}
                onFilters={handleFilters}
                //
                canReset={canReset}
                onResetFilters={handleResetFilters}
              />

              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                  dense={table.dense}
                  numSelected={table.selected.length}
                  rowCount={tableDataLoaiNhom?.length}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableDataLoaiNhom?.map((row) => row?.ID_Loainhom)
                    )
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
                  <Table size={table.dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={tableDataLoaiNhom?.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                    // onSelectAllRows={(checked) =>
                    //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Loainhom))
                    // }
                    />

                    <TableBody>
                      {dataFilteredLoaiNhom
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <LoaiNhomTableRow
                            key={row.ID_Loainhom}
                            row={row}
                            selected={table.selected.includes(row.ID_Loainhom)}
                            onSelectRow={() => table.onSelectRow(row.ID_Loainhom)}
                            onDeleteRow={() => handleDeleteRowLoaiNhom(row.ID_Loainhom)}
                            onViewRow={() => handleViewRowLoaiNhom(row)}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(
                          table.page,
                          table.rowsPerPage,
                          tableDataLoaiNhom?.length
                        )}
                      />

                      <TableNoData notFound={notFoundLoaiNhom} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                count={dataFilteredLoaiNhom?.length}
                page={table.page}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                dense={table.dense}
                onChangeDense={table.onChangeDense}
              />
            </Card>
          </Container>
        </Grid>
        <Grid xs={12} md={6} mt={2}>
          <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <CustomBreadcrumbs
                heading="Danh sách đơn vị"
                links={[
                  {
                    name: '',
                  },
                ]}
              />
              <LoadingButton
                variant="contained"
                startIcon={<Iconify icon="eva:add-upload-fill" />}
                onClick={handleViewAddDonVi}
              >
                Thêm mới
              </LoadingButton>
            </Stack>

            <Card>
              <DonViTableToolbar
                filters={filtersDonVi}
                onFilters={handleFiltersDonVi}
                //
                canReset={canResetDonVi}
                onResetFilters={handleResetFilters}
              />

              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                  dense={tableDonVi.dense}
                  numSelected={tableDonVi.selected.length}
                  rowCount={tableDataDonVi?.length}
                  onSelectAllRows={(checked) =>
                    tableDonVi.onSelectAllRows(checked, tableDataDonVi?.map((row) => row?.ID_Donvi))
                  }
                  action={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={confirmDonVi.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  }
                />

                <Scrollbar>
                  <Table size={tableDonVi.dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      order={tableDonVi.order}
                      orderBy={tableDonVi.orderBy}
                      headLabel={TABLE_HEAD_DONVI}
                      rowCount={tableDataDonVi?.length}
                      numSelected={tableDonVi.selected.length}
                      onSort={tableDonVi.onSort}
                    />

                    <TableBody>
                      {dataFilteredDonVi
                        .slice(
                          tableDonVi.page * tableDonVi.rowsPerPage,
                          tableDonVi.page * tableDonVi.rowsPerPage + tableDonVi.rowsPerPage
                        )
                        .map((row) => (
                          <DonViTableRow
                            key={row.ID_Donvi}
                            row={row}
                            selected={tableDonVi.selected.includes(row.ID_Donvi)}
                            onSelectRow={() => tableDonVi.onSelectRow(row.ID_Donvi)}
                            onDeleteRow={() => handleDeleteRowDonVi(row.ID_Donvi)}
                            onViewRow={() => handleViewRowDonVi(row)}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeightDonVi}
                        emptyRows={emptyRows(
                          tableDonVi.page,
                          tableDonVi.rowsPerPage,
                          tableDataDonVi?.length
                        )}
                      />

                      <TableNoData notFound={notFoundDonVi} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                count={dataFilteredDonVi?.length}
                page={tableDonVi.page}
                rowsPerPage={tableDonVi.rowsPerPage}
                onPageChange={tableDonVi.onChangePage}
                onRowsPerPageChange={tableDonVi.onChangeRowsPerPage}
                dense={tableDonVi.dense}
                onChangeDense={tableDonVi.onChangeDense}
              />
            </Card>
          </Container>
        </Grid>


        {/* hãng */}
        <Grid xs={12} md={6} mt={2}>
          <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <CustomBreadcrumbs
                heading="Danh sách hãng"
                links={[
                  {
                    name: '',
                  },
                ]}
              />
              <LoadingButton
                variant="contained"
                startIcon={<Iconify icon="eva:add-upload-fill" />}
                onClick={handleViewAddHang}
              >
                Thêm mới
              </LoadingButton>
            </Stack>

            <Card>
              <HangTableToolbar
                filters={filtersHang}
                onFilters={handleFiltersHang}
                //
                canReset={canResetHang}
                onResetFilters={handleResetFilters}
              />

              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                  dense={tableHang.dense}
                  numSelected={tableHang.selected.length}
                  rowCount={tableDataHang?.length}
                  onSelectAllRows={(checked) =>
                    tableHang.onSelectAllRows(checked, tableDataHang?.map((row) => row?.ID_Hang))
                  }
                  action={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={confirmDonVi.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  }
                />

                <Scrollbar>
                  <Table size={tableHang.dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      order={tableHang.order}
                      orderBy={tableHang.orderBy}
                      headLabel={TABLE_HEAD_HANG}
                      rowCount={tableDataHang?.length}
                      numSelected={tableHang.selected.length}
                      onSort={tableHang.onSort}
                    />

                    <TableBody>
                      {dataFilteredHang
                        .slice(
                          tableHang.page * tableHang.rowsPerPage,
                          tableHang.page * tableHang.rowsPerPage + tableHang.rowsPerPage
                        )
                        .map((row) => (
                          <HangTableRow
                            key={row.ID_Hang}
                            row={row}
                            selected={tableDonVi.selected.includes(row.ID_Hang)}
                            onSelectRow={() => tableDonVi.onSelectRow(row.ID_Hang)}
                            onDeleteRow={() => handleDeleteRowHang(row.ID_Hang)}
                            onViewRow={() => handleViewRowHang(row)}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeightHang}
                        emptyRows={emptyRows(
                          tableHang.page,
                          tableHang.rowsPerPage,
                          tableDataHang?.length
                        )}
                      />

                      <TableNoData notFound={notFoundHang} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                count={dataFilteredHang?.length}
                page={tableHang.page}
                rowsPerPage={tableHang.rowsPerPage}
                onPageChange={tableHang.onChangePage}
                onRowsPerPageChange={tableHang.onChangeRowsPerPage}
                dense={tableHang.dense}
                onChangeDense={tableHang.onChangeDense}
              />
            </Card>
          </Container>
        </Grid>
      </Grid>

      <LoaiNhomDialog
        open={confirm.value}
        dataSelect={dataSelectLoaiNhom}
        onClose={confirm.onFalse}
        onChange={handleInputChangeLoaiNhom}
        handleUpdate={handleUpdate}
        handleSelectChange={handleSelectChangeLoaiNhom}
      />

      <LoaiNhomDialogAdd open={confirmAdd.value} onClose={confirmAdd.onFalse} />

      <DonViDialog
        open={confirmDonVi.value}
        dataSelect={dataSelectDonVi}
        onClose={confirmDonVi.onFalse}
        onChange={handleInputChangeDonVi}
        handleUpdate={handleUpdateDonVi}
        handleSelectChange={handleSelectChangeDonVi}
      />

      <DonViDialogAdd open={confirmAddDonVi.value} onClose={confirmAddDonVi.onFalse} />

      <HangDialog
        open={confirmHang.value}
        dataSelect={dataSelectHang}
        onClose={confirmHang.onFalse}
        onChange={handleInputChangeHang}
        handleUpdate={handleUpdateHang}
        handleSelectChange={handleSelectChangeHang}
      />

      <HangDialogAdd open={confirmAddHang.value} onClose={confirmAddHang.onFalse} />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilterLoaiNhom({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: ILoainhom[];
  comparator: (a: any, b: any) => number;
  filters: ITaisanTableFilters;
  // dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) => order.Loainhom.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

function applyFilterDonVi({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: IDonvi[];
  comparator: (a: any, b: any) => number;
  filters: ITaisanTableFilters;
  // dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) => order.Donvi.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

function applyFilterHang({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: IHang[];
  comparator: (a: any, b: any) => number;
  filters: ITaisanTableFilters;
  // dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) => order.Tenhang.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: ILoainhom;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  handleSelectChange: any;
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

interface ConfirmTransferDonViDialogProps {
  open: boolean;
  dataSelect?: IDonvi;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  handleSelectChange: any;
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

interface ConfirmTransferHangDialogProps {
  open: boolean;
  dataSelect?: IHang;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  handleSelectChange: any;
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

function LoaiNhomDialog({
  open,
  dataSelect,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  handleSelectChange,
}: ConfirmTransferDialogProps) {
  const ID_Loainhom = dataSelect?.ID_Loainhom;

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Cập nhật</DialogTitle>

      <Stack spacing={3} sx={{ px: 3 }}>
        <TextField
          name="Loainhom"
          label="Loại tài sản"
          value={dataSelect?.Loainhom}
          onChange={onChange}
          fullWidth
          onBlur={onBlur}
        />
      </Stack>

      <DialogActions>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            if (ID_Loainhom) {
              handleUpdate(ID_Loainhom);
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

function LoaiNhomDialogAdd({ open, onClose }: any) {
  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>

      <DialogContent sx={{ overflow: 'hidden', height: 'auto' }}>
        <Grid spacing={3}>
          <LoaiNhomNewForm />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

function DonViDialog({
  open,
  dataSelect,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  handleSelectChange,
}: ConfirmTransferDonViDialogProps) {
  const ID_Donvi = dataSelect?.ID_Donvi;

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Cập nhật</DialogTitle>

      <Stack spacing={3} sx={{ px: 3 }}>
        <TextField
          name="Donvi"
          label="Đơn vị" // Vietnamese for "Category Name"
          value={dataSelect?.Donvi}
          onChange={onChange} // Update local state and notify parent
          fullWidth
          onBlur={onBlur}
        />
      </Stack>

      <DialogActions>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            if (ID_Donvi) {
              handleUpdate(ID_Donvi);
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

function DonViDialogAdd({ open, onClose }: any) {
  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>

      <DialogContent sx={{ overflow: 'hidden', height: 'auto' }}>
        <Grid spacing={3}>
          <DonViNewForm onClose={onClose} />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

function HangDialog({
  open,
  dataSelect,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  handleSelectChange,
}: ConfirmTransferHangDialogProps) {
  const ID_Hang = dataSelect?.ID_Hang;

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Cập nhật</DialogTitle>

      <Stack spacing={3} sx={{ px: 3 }}>
        <TextField
          name="Tenhang"
          label="Tên hãng" // Vietnamese for "Category Name"
          value={dataSelect?.Tenhang}
          onChange={onChange} // Update local state and notify parent
          fullWidth
          onBlur={onBlur}
        />
      </Stack>

      <DialogActions>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            if (ID_Hang) {
              handleUpdate(ID_Hang);
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

function HangDialogAdd({ open, onClose }: any) {
  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>
      <DialogContent sx={{ overflow: 'hidden', height: 'auto' }}>
        <Grid spacing={3}>
          <HangNewForm onClose={onClose} />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
