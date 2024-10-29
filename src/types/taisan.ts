export type ITaisanTableFilterValue = string | Date | null | string[];

export type IPhongBanTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  publish: string[];
};

export type IUserTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  chinhanh: string[];
  phongban: string[];
};


export type ITaisanTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type ITaisanFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  units: string[];
  groups: string[];
};
export type ITaisanFilterValue = string | Date | null | string[];

export type ITbTaisanTableFilterValue = string | Date | null;
export type IPhongBanTableFilterValue = string | Date | null | string[];
export type IUserTableFilterValue = string | Date | null | string[];

export type IGroupPolicy = {
  ID_GroupPolicy: string;
  GroupPolicy: string;
};

export type IChinhanh = {
  ID_Chinhanh: string;
  Tenchinhanh: string;
};

export type INhompb = {
  ID_Nhompb: string;
  Nhompb: string;
};

export type IUser = {
  ID_User: string;
  ID_Nhompb: string;
  ID_Chinhanh: string;
  ID_Chucvu: string;
  ID_Phongban: string;
  Password: string;
  IDNHOMNGUOIDUNG: string;
  MaPMC: string;
  ID_Policy: string;
  Hoten: string;
  Gioitinh: string;
  Diachi: string;
  Sodienthoai: string;
  Emails: string;
  Anh: string;
  ent_nhompb: INhompb;
  ent_chinhanh: IChinhanh;
  ent_chucvu: IChucvu;
  ent_phongbanda: IPhongbanda;
};

export type IDonvi = {
  ID_Donvi: string;
  Donvi: string;
};

export type ILoainhom = {
  ID_Loainhom: string;
  Loainhom: string;
};

export type INhaCC = {
  ID_Nhacc: string;
  MaNhacc: string;
  TenNhacc: string;
  Masothue: string;
  Sodienthoai: string;
  Sotaikhoan: string;
  Nganhang: string;
  Diachi: string;
  Ghichu: string;
  isDelete: string;
};

export type INam = {
  ID_Nam: string;
  Nam: string;
  Giatri: string;
};

export type IThang = {
  ID_Thang: string;
  Thang: string;
  iThang: string;
};

export type IQuy = {
  ID_Quy: string;
  Quy: string;
};

export type INhomts = {
  ID_Nhomts: string;
  ID_Loainhom: string;
  Manhom: string;
  Tennhom: string;
  ent_loainhom: ILoainhom;
};

export type IPolicy = {
  ID_Policy: string;
  Policy: string;
  ID_GroupPolicy: string | any;
  GroupPolicy: string;
  isDelete: string;
  ent_grouppolicy: IGroupPolicy;
};

export type IPhieuNXCT = {
  ID_PhieuNXCT: string;
  ID_PhieuNX: string;
  ID_Taisan: string;
  Dongia: string;
  Soluong: string;
  isDelete: string;
  ent_taisan: ITaisan;
};

export type IPhieuNCCCT = {
  ID_PhieuNCCCT: string;
  ID_PhieuNCC: string;
  ID_Taisan: string;
  Dongia: string;
  Namsx: string;
  Tong: string;
  Soluong: string;
  isDelete: string;
  ent_taisan: ITaisan;
}

export type IPhieuGNCT = {
  ID_Taisan: string;
  ID_TaisanQrcode: string;
  Tinhtrangmay: string;
  Cacttlienquan: string;
  Soluong: string;
  isDelete: string;
  TaisanInfo: ITaisan;
  tb_taisanqrcode: ITaisanQrCode;
}

export type INghiepvu = {
  ID_Nghiepvu: string;
  Nghiepvu: string;
  isDelete: string;
};

export type INhansuPBDA = {
  ID_NSPB: string;
  ID_Phongban: string;
  ID_Connguoi: string;
  Ngayvao: string;
  iTinhtrang: string;
  Ngay: string;
  isDelete: string;
  ent_phongbanda: IPhongbanda;
  ent_connguoi: IConnguoi;
};

export type ITaisan = {
  ID_Taisan: string;
  ID_Nhomts: string;
  ID_Donvi: string;
  Mats: string;
  Tents: string;
  Tentscu: string;
  Model:string;
  SerialNumber:string;
  Thongso: string;
  Nuocsx: string;
  i_MaQrCode: string;
  Ghichu: string;
  ent_nhomts: INhomts;
  ent_donvi: IDonvi;
};

export type ITaisanQrCode = {
  ID_TaisanQrcode: string;
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
  Namsx: string;
  Nambdsd: string;
  ent_user: IUser;
  ent_taisan: ITaisan;
};

export type IConnguoi = {
  ID_Connguoi: string;
  MaPMC: string;
  Hoten: string;
  Gioitinh: string;
  Diachi: string;
  Sodienthoai: string;
  NgayGhinhan: string;
  Ghichu: string;
  isDelete: string;
  ent_nhansupbda: INhansuPBDA[];
};

export type IPhongbanda = {
  ID_Phongban: string;
  ID_Chinhanh: string;
  ID_Nhompb: string;
  Mapb: string;
  Thuoc: string;
  Tenphongban: string;
  Diachi: string;
  Ghichu: string;
  ent_chinhanh: IChinhanh;
  ent_nhompb: INhompb;
};

export type IChucvu = {
  ID_Chucvu: string;
  Chucvu: string;
};

export type IPhieuGN = {
  ID_Giaonhan: string;
  ID_Phongban: string;
  iGiaonhan: string;
  Ngay: string;
  Ghichu: string;
  ID_Quy: string;
  ID_Nam: string;
  Nguoinhan: string;
  Nguoigiao: string;
  ent_nam: INam;
  ent_quy: IQuy;
  giaoNhanCT: IPhieuGNCT[];
  ent_phongbanda: IPhongbanda;
  NguoinhanInfo: INhansuPBDA;
  NguoigiaoInfo: INhansuPBDA;
  tb_giaonhantsct: IPhieuGNCT[];
  giaonhantsct:IPhieuGNCT[];
};

export type IPhieuNX = {
  ID_PhieuNX: string;
  ID_Nghiepvu: string;
  Sophieu: string;
  ID_NoiNhap: string;
  ID_NoiXuat: string;
  ID_Connguoi: string;
  ID_Loainhom: string;
  ID_Phongban: string;
  NgayNX: string;
  Ghichu: string;
  ID_Quy: string;
  ID_Nam: string;
  ID_Thang: string;
  iTinhtrang: string;
  NoiNhap: IPhongbanda;
  NoiXuat: IPhongbanda;
  ent_nghiepvu: INghiepvu;
  ent_nam: INam;
  ent_thang: IThang;
  ent_user: IUser;
  tb_phieunxct: IPhieuNXCT;
};

export type IPhieuNCC = {
  ID_PhieuNCC: string;
  ID_Nghiepvu: string;
  Sophieu: string;
  ID_NoiNhap: string;
  ID_NoiXuat: string;
  ID_Phieu1: string;
  ID_Phieu2: string;
  ID_Connguoi: string;
  ID_Loainhom: string;
  ID_Phongban: string;
  NgayNX: string;
  Ghichu: string;
  ID_Quy: string;
  ID_Nam: string;
  ID_Thang: string;
  iTinhtrang: string;
  NoiNhap: any;
  NoiXuat: any;
  ent_nghiepvu: INghiepvu;
  ent_nam: INam;
  ent_thang: IThang;
  ent_user: IUser;
  tb_phieunccct: IPhieuNCCCT[];
  phieunccct: IPhieuNCCCT[];
  ent_nhacc: INhaCC;
  ent_phongbanda: IPhongbanda;
};

export type ISuaChuaCT = {
  ID_PhieuSCCT: string;
  ID_SuachuaTS: string;
  ID_TaisanQr: string;
  Ngaynhan: string;
  Sotien: string;
  Ghichu: string;
  isDelete: string;
  tb_taisanqrcode: ITaisanQrCode;
};

export type ISuachuaTS = {
  ID_SuachuaTS: string;
  Ngaygiao: string;
  Sophieu: string;
  Nguoitheodoi: string;
  iTinhtrang: string;
  isDelete: string;
  tb_suachuact: ISuaChuaCT;
};
