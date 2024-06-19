import {
  IKhuvuc,
  IToanha,
  IKhoiCV,
  IHangMuc,
  IChecklist,
  ICalv,
  E_Tang,
  IGiamsat,
  IChucvu,
  IDuan,
  IUser,
  ITang,
  ITbChecklist,
  TbChecklistCalv,
} from 'src/types/khuvuc';
// utils
import { endpoints, fetcher } from 'src/utils/axios';
import { useEffect, useMemo } from 'react';

// types
import useSWR from 'swr';
import { IChinhanh, IConnguoi, IDonvi, IGroupPolicy, INam, INghiepvu, INhompb, INhomts, IPhongbanda, IPolicy, ITaisan, IThang } from 'src/types/taisan';

const STORAGE_KEY = 'accessToken';

export function useGetCalv() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_calv/';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      calv: (data?.data as ICalv[]) || [],
      calvLoading: isLoading,
      calvError: error,
      calvValidating: isValidating,
      calvEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCalvDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_calv/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      calv: (data?.data as ICalv) || [],
      calvLoading: isLoading,
      calvError: error,
      calvValidating: isValidating,
      calvEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCalvFilter(inp: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const dataInput = {
    ID_KhoiCV: inp?.ID_KhoiCV,
  };
  console.log('dataInput', inp);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_calv/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dataInput),
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      calv: (data?.data as ICalv[]) || [],
      calvLoading: isLoading,
      calvError: error,
      calvValidating: isValidating,
      calvEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetToanha() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_toanha/';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      toanha: (data?.data as IToanha[]) || [],
      toanhaLoading: isLoading,
      toanhaError: error,
      toanhaValidating: isValidating,
      toanhaEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTang() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_tang/';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      tang: (data?.data as ITang[]) || [],
      tangLoading: isLoading,
      tangError: error,
      tangValidating: isValidating,
      tangEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhoiCV() {
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_khoicv`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      khoiCV: (data?.data as IKhoiCV[]) || [],
      khoiCVLoading: isLoading,
      khoiCVError: error,
      khoiCVValidating: isValidating,
      khoiCVEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChucvu() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_chucvu`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      chucVu: (data?.data as IChucvu[]) || [],
      chucVuLoading: isLoading,
      chucVuError: error,
      chucVuValidating: isValidating,
      chucVuEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhuVuc() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_khuvuc/filter';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      khuvuc: (data?.data as IKhuvuc[]) || [],
      khuvucLoading: isLoading,
      khuvucError: error,
      khuvucValidating: isValidating,
      khuvucEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDuan() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_duan/';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      duan: (data?.data as IDuan[]) || [],
      duanLoading: isLoading,
      duanError: error,
      duanValidating: isValidating,
      duanEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDuanWeb() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_duan/thong-tin-du-an';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      duan: (data?.data as IDuan[]) || [],
      duanLoading: isLoading,
      duanError: error,
      duanValidating: isValidating,
      duanEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetGiamsat() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_giamsat/';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      giamsat: (data?.data as IGiamsat[]) || [],
      giamsatLoading: isLoading,
      giamsatError: error,
      giamsatValidating: isValidating,
      giamsatEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetGiamsatDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_giamsat/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      giamsat: (data?.data as IGiamsat) || [],
      giamsatLoading: isLoading,
      giamsatError: error,
      giamsatValidating: isValidating,
      giamsatEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDuanDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_duan/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      duan: (data?.data as IDuan) || [],
      duanLoading: isLoading,
      duanError: error,
      duanValidating: isValidating,
      duanEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetToanhaDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_toanha/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      toanha: (data?.data as IToanha) || [],
      toanhaLoading: isLoading,
      toanhaError: error,
      toanhaValidating: isValidating,
      toanhaEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhuVucDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_khuvuc/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      khuvuc: (data?.data as IKhuvuc) || [],
      khuvucLoading: isLoading,
      khuvucError: error,
      khuvucValidating: isValidating,
      khuvucEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetHangMuc() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_hangmuc/';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hangMuc: (data?.data as IHangMuc[]) || [],

      hangMucLoading: isLoading,
      hangMucError: error,
      hangMucValidating: isValidating,
      hangMucEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUsers() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_user/get-online';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      user: (data?.data as IUser[]) || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetHangMucDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_hangmuc/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hangMuc: (data?.data as IHangMuc) || [],
      hangMucLoading: isLoading,
      hangMucError: error,
      hangMucValidating: isValidating,
      hangMucEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChecklist(pag: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_checklist/?page=${
    Number(pag?.page) + 1
  }&limit=${pag?.limit}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as IChecklist[]) || [],
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data.length,
      checkListTotalPages: data?.totalPages,
      checklistPage: data?.page,
      checklistTotalCount: data?.totalCount,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTb_Checklist(pag: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/tb_checklistc/?page=${Number(
    pag?.page
  )}&limit=${pag?.limit}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      tb_checkList: (data?.data as ITbChecklist[]) || [],
      tb_checkListLoading: isLoading,
      tb_checkListError: error,
      tb_checkListValidating: isValidating,
      tb_checkListEmpty: !isLoading && !data.length,
      tb_checkListTotalPages: data?.totalPages,
      tb_checklistPage: data?.page,
      tb_checklistTotalCount: data?.totalCount,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTb_ChecklistDetail(id: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/tb_checklistc/ca/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as TbChecklistCalv[]) || [],
      dataChecklistC: (data?.dataChecklistC as any) || null,
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChecklistWeb() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_checklist/web`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as IChecklist[]) || [],
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChecklistDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_checklist/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as IChecklist) || [],
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_user/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      user: (data?.data as IUser) || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhuvucByToanha(id?: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_toanha/khuvuc/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      toanha: (data?.data as IToanha[]) || [],
      user: (data?.user as IUser) || [],
      toanhaLoading: isLoading,
      toanhaError: error,
      toanhaValidating: isValidating,
      toanhaEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetProfile(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/pmc-assets/api/ent_user/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      user: (data?.data as IUser) || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetGroupPolicy() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_grouppolicy/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      grouppolicy: (data?.data as IGroupPolicy[]) || [],
      grouppolicyLoading: isLoading,
      grouppolicyError: error,
      grouppolicyValidating: isValidating,
      grouppolicyEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPolicy() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_policy/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      policy: (data?.data as IPolicy[]) || [],
      policyLoading: isLoading,
      policyError: error,
      policyValidating: isValidating,
      policyEmpty: !isLoading && !data.length,
      mutatePolicy: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetConNguoi() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_connguoi/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      connguoi: (data?.data as IConnguoi[]) || [],
      connguoiLoading: isLoading,
      connguoiError: error,
      connguoiValidating: isValidating,
      connguoiEmpty: !isLoading && !data.length,
      mutateConnguoi: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetNhomPb() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_nhompb/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      nhompb: (data?.data as INhompb[]) || [],
      nhompbLoading: isLoading,
      nhompbError: error,
      nhompbValidating: isValidating,
      nhompbEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChinhanh() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_chinhanh/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      chinhanh: (data?.data as IChinhanh[]) || [],
      chinhanhLoading: isLoading,
      chinhanhError: error,
      chinhanhValidating: isValidating,
      chinhanhEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetNhomts() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_nhomts/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      nhomts: (data?.data as INhomts[]) || [],
      nhomtsLoading: isLoading,
      nhomtsError: error,
      nhomtsValidating: isValidating,
      nhomtsEmpty: !isLoading && !data.length,
      mutateNhomts: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetTaisan() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_taisan/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      taisan: (data?.data as ITaisan[]) || [],
      taisanLoading: isLoading,
      taisanError: error,
      taisanValidating: isValidating,
      taisanEmpty: !isLoading && !data.length,
      mutateTaisan: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetDonvi() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_donvi/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      donvi: (data?.data as IDonvi[]) || [],
      donviLoading: isLoading,
      donviError: error,
      donviValidating: isValidating,
      donviEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPhongBanDa() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_phongbanda/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      phongbanda: (data?.data as IPhongbanda[]) || [],
      phongbandaLoading: isLoading,
      phongbandaError: error,
      phongbandaValidating: isValidating,
      phongbandaEmpty: !isLoading && !data.length,
      mutatePhongBanDa: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetNghiepvu() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_nghiepvu/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      nghiepvu: (data?.data as INghiepvu[]) || [],
      nghiepvuLoading: isLoading,
      nghiepvuError: error,
      nghiepvuValidating: isValidating,
      nghiepvuEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetNam() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_nam/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      nam: (data?.data as INam[]) || [],
      namLoading: isLoading,
      namError: error,
      namValidating: isValidating,
      namEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetThang() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_thang/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      thang: (data?.data as IThang[]) || [],
      thangLoading: isLoading,
      thangError: error,
      thangValidating: isValidating,
      thangEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

