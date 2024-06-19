
export type ITaisanTableFilterValue = string | null;

export type ITaisanTableFilters = {
  name: string;
  status: string;
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
  Tenphongban: string;
  Diachi: string;
  Ghichu: string;
  ent_chinhanh: IChinhanh;
  ent_nhompb: INhompb;
}