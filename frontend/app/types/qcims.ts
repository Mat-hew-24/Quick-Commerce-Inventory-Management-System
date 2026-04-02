import type { Dispatch, SetStateAction } from "react";

export type Role = "admin" | "staff";

export type Access = {
  create: boolean;
  edit: boolean;
  remove: boolean;
};

export type Row = Record<string, string | number | boolean>;

export type DashboardStat = {
  title: string;
  value: number;
  subtitle: string;
};

export type FormField = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "checkbox";
  required?: boolean;
};

export type DataColumn<T extends Row> = {
  key: string;
  label: string;
  render?: (value: string | number | boolean | undefined, row: T) => string;
};

export type ProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export type WarehouseRow = {
  id: number;
  name: string;
  city: string;
  pincode: string;
  capacity: number;
};

export type InventoryRow = {
  id: number;
  warehouse: string;
  product: string;
  quantity: number;
  reorder: number;
  available: boolean;
};

export type CustomerRow = {
  id: number;
  name: string;
  phone: string;
  email: string;
  pincode: string;
};

export type SupplierRow = {
  id: number;
  name: string;
  contact: string;
  email: string;
};

export type OrderRow = {
  id: number;
  customer: string;
  warehouse: string;
  status: string;
  total: number;
};

export type OrderItemRow = {
  id: number;
  orderId: number;
  product: string;
  quantity: number;
  priceAtOrder: number;
};

export type RestockRow = {
  id: number;
  warehouse: string;
  product: string;
  supplier: string;
  quantity: number;
  status: string;
};

export type StateSetter<T> = Dispatch<SetStateAction<T[]>>;
