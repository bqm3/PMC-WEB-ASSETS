
export type ITaisanTableFilterValue = string | Date| null;

export type ITaisanTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type ITbTaisanTableFilterValue = string | Date | null;

export type IGroupPolicy = {
    ID_GroupPolicy: string;
    GroupPolicy: string;
}

export type IChinhanh = {
  ID_Chinhanh: string;
  Tenchinhanh: string;
}

export type INhompb = {
  ID_Nhompb: string;
  Nhompb: string;
}

export type IUser = {
  
}

export type IDonvi = {
  ID_Donvi: string;
  Donvi: string;
}

export type INam = {
  ID_Nam: string;
  Nam: string;
  Giatri: string;
}

export type IThang = {
  ID_Thang: string;
  Thang: string;
  iThang: string;
}

export type INhomts = {
  ID_Nhomts: string;
  Manhom: string;
  Loaits: string;
}

export type IPolicy = {
  ID_Policy: string;
  Policy: string;
  ID_GroupPolicy: string | any;
  GroupPolicy: string;
  isDelete: string;
  ent_grouppolicy: IGroupPolicy;
}

export type IPhieuNXCT = {
  ID_PhieuNXCT: string;
  ID_PhieuNX: string;
  ID_Taisan: string;
  Dongia: string;
  Soluong: string;
  isDelete: string;
  ent_taisan: ITaisan;
}

export type INghiepvu = {
  ID_Nghiepvu: string;
  Nghiepvu: string;
  isDelete: string;
}

export type ITaisan = {
  ID_Taisan: string;
  ID_Nhomts: string;
  ID_Donvi: string;
  Mats: string;
  Tents: string;
  Thongso: string;
  Ghichu: string;
  ent_nhomts: INhomts;
  ent_donvi: IDonvi;
}


export type ITaisanQrCode = {
  ID_TaisanQr: string;
  ID_Taisan: string;
  Ngaykhoitao: string;
  ID_Donvi: string;
  MaQrCode: string;
  Giatri: string;
  iTinhtrang: string;
  Ghichu: string;
  ID_Phongban: string;
  ID_Connguoi: string;
  ent_phongbanda: IPhongbanda;
  ent_connguoi: IConnguoi;
  ent_taisan: ITaisan;
}

export type IConnguoi = {
  ID_Connguoi: string;
  MaPMC: string;
  ID_Nhompb: string | any;
  Hoten: string;
  Gioitinh: string;
  Diachi: string;
  Sodienthoai: string;
  Ghichu: string;
  isDelete: string;
  ent_nhompb: INhompb;
}

export type IPhongbanda = {
  ID_Phongban: string;
  ID_Chinhanh: string;
  ID_Nhompb: string ;
  Mapb: string;
  Thuoc: string;
  Tenphongban: string;
  Diachi: string;
  Ghichu: string;
  ent_chinhanh: IChinhanh;
  ent_nhompb: INhompb;
}

export type IPhieuNX = {
  ID_PhieuNX: string;
  ID_Nghiepvu: string;
  Sophieu: string ;
  ID_NoiNhap: string;
  ID_NoiXuat: string;
  ID_Connguoi: string;
  NgayNX: string;
  Ghichu: string;
  ID_Nam: string;
  ID_Thang: string;
  iTinhtrang: string;
  NoiNhap: IPhongbanda,
  NoiXuat: IPhongbanda,
  ent_nghiepvu: INghiepvu,
  ent_nam: INam,
  ent_thang: IThang,
  ent_connguoi: IConnguoi
  tb_phieunxct: IPhieuNXCT;
}

export type ISuachuaTS = {
  ID_Suachua: string;
  Ngaygiao: string;
  Sophieu: string;
  Nguoitheodoi: string;
  iTinhtrang: string;
  isDelete: string;
}