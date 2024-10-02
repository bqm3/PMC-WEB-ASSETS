import {
  IUser,
} from 'src/types/khuvuc';
// utils
import { endpoints, fetcher } from 'src/utils/axios';
import { useEffect, useMemo } from 'react';

// types
import useSWR from 'swr';
import { IChinhanh, IConnguoi, IDonvi, IGroupPolicy, INam, INghiepvu, INhompb,
  ITaisanQrCode, INhomts, IPhieuNX, IPhongbanda, IPolicy, ISuachuaTS, ITaisan, IThang, 
  ILoaiNhom,
  INhaCC} from 'src/types/taisan';

const STORAGE_KEY = 'accessToken';


export function useGetGroupPolicy() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/ent_grouppolicy/all';
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
  const URL = 'http://localhost:8888/api/v1/ent_policy/all';
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
  const URL = 'http://localhost:8888/api/v1/ent_connguoi/all';
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
  const URL = 'http://localhost:8888/api/v1/ent_nhompb/all';
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
  const URL = 'http://localhost:8888/api/v1/ent_chinhanh/all';
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

export function useGetLoaiNhom() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/ent_loainhom/all';
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
      loainhom: (data?.data as ILoaiNhom[]) || [],
      loainhomLoading: isLoading,
      loainhomError: error,
      loainhomValidating: isValidating,
      loainhomEmpty: !isLoading && !data.length,
      mutateLoainhom: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetNhacc() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/ent_nhacc/all';
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
      nhacc: (data?.data as INhaCC[]) || [],
      nhaccLoading: isLoading,
      nhaccError: error,
      nhaccValidating: isValidating,
      nhaccEmpty: !isLoading && !data.length,
      mutateNhacc: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetNhomts() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/ent_nhomts/all';
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
  const URL = 'http://localhost:8888/api/v1/ent_taisan/all';
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

export function useGetTaisanQrCode() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/tb_taisanqrcode/all';
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
      taisanqr: (data?.data as ITaisanQrCode[]) || [],
      taisanqrLoading: isLoading,
      taisanqrError: error,
      taisanqrValidating: isValidating,
      taisanqrEmpty: !isLoading && !data.length,
      mutateTaisanQr: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  )
  return memoizedValue;
}

export function useGetDonvi() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/ent_donvi/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating , mutate} = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      donvi: (data?.data as IDonvi[]) || [],
      donviLoading: isLoading,
      donviError: error,
      donviValidating: isValidating,
      donviEmpty: !isLoading && !data.length,
      mutateDonvi: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetPhongBanDa() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/ent_phongbanda/all';
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
  const URL = 'http://localhost:8888/api/v1/ent_nghiepvu/all';
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
  const URL = 'http://localhost:8888/api/v1/ent_nam/all';
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
  const URL = 'http://localhost:8888/api/v1/ent_thang/all';
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

export function useGetPhieuNX() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/tb_phieunx/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      phieunx: (data?.data as IPhieuNX[]) || [],
      phieunxLoading: isLoading,
      phieunxError: error,
      phieunxValidating: isValidating,
      phieunxEmpty: !isLoading && !data.length,
      mutatePhieuNX: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetDetailPhieuNX(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `http://localhost:8888/api/v1/tb_phieunx/${id}`;
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
      phieunx: (data?.data as IPhieuNX) || [],
      phieunxLoading: isLoading,
      phieunxError: error,
      phieunxValidating: isValidating,
      phieunxEmpty: !isLoading && !data.length,
      mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetDetailSuaChuaTS(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `http://localhost:8888/api/v1/tb_suachuats/${id}`;
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
      suachuats: (data?.data as ISuachuaTS) || [],
      suachuatsLoading: isLoading,
      suachuatsError: error,
      suachuatsValidating: isValidating,
      suachuatsEmpty: !isLoading && !data.length,
      mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetSuachuaTs() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'http://localhost:8888/api/v1/tb_suachuats/all';
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      suachuats: (data?.data as ISuachuaTS[]) || [],
      suachuatsLoading: isLoading,
      suachuatsError: error,
      suachuatsValidating: isValidating,
      suachuatsEmpty: !isLoading && !data.length,
      mutateSuachuaTS: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

