import type {
  CustomerRow,
  DashboardStat,
  InventoryRow,
  OrderItemRow,
  OrderRow,
  ProductRow,
  RestockRow,
  SupplierRow,
  WarehouseRow,
} from "../types/qcims";

export const dashboardStats: DashboardStat[] = [
  { title: "Products", value: 128, subtitle: "Updated from `Product` entity" },
  { title: "Warehouses", value: 6, subtitle: "Entities in `Warehouse` table" },
  { title: "Customers", value: 89, subtitle: "Active `Customer` entries" },
  { title: "Suppliers", value: 8, subtitle: "Active `Supplier` entries" },
  { title: "Orders", value: 48, subtitle: "Active `Order` entries" },
  { title: "Restocks", value: 12, subtitle: "Pending `RestockRequest`" },
];

export const initialProducts: ProductRow[] = [
  { id: 1, name: "Grocery Kit", category: "Essential", price: 259.99, stock: 124 },
  { id: 2, name: "Milk 1L", category: "Dairy", price: 39.99, stock: 54 },
  { id: 3, name: "Rice 5kg", category: "Grains", price: 299.99, stock: 88 },
];

export const initialWarehouses: WarehouseRow[] = [
  { id: 1, name: "Central Hub", city: "Chennai", pincode: "600001", capacity: 2000 },
  { id: 2, name: "North Warehouse", city: "Bengaluru", pincode: "560001", capacity: 1500 },
];

export const initialInventory: InventoryRow[] = [
  { id: 1, warehouse: "Central Hub", product: "Milk 1L", quantity: 54, reorder: 30, available: true },
  { id: 2, warehouse: "North Warehouse", product: "Rice 5kg", quantity: 88, reorder: 40, available: true },
  { id: 3, warehouse: "Central Hub", product: "Grocery Kit", quantity: 124, reorder: 20, available: true },
];

export const initialCustomers: CustomerRow[] = [
  { id: 1, name: "Mohan Kumar", phone: "9876543210", email: "mohan@example.com", pincode: "600028" },
  { id: 2, name: "Priya Singh", phone: "9123456789", email: "priya@example.com", pincode: "560075" },
];

export const initialSuppliers: SupplierRow[] = [
  { id: 1, name: "DairyCo", contact: "9845712369", email: "sales@dairyco.com" },
  { id: 2, name: "GrainsRUs", contact: "8569743210", email: "contact@grainsrus.com" },
];

export const initialOrders: OrderRow[] = [
  { id: 101, customer: "Mohan Kumar", warehouse: "Central Hub", status: "Processing", total: 1399.5 },
  { id: 102, customer: "Priya Singh", warehouse: "North Warehouse", status: "Shipped", total: 249.0 },
];

export const initialOrderItems: OrderItemRow[] = [
  { id: 1001, orderId: 101, product: "Grocery Kit", quantity: 2, priceAtOrder: 259.99 },
  { id: 1002, orderId: 101, product: "Milk 1L", quantity: 6, priceAtOrder: 39.99 },
  { id: 1003, orderId: 102, product: "Rice 5kg", quantity: 1, priceAtOrder: 299.99 },
];

export const initialRestocks: RestockRow[] = [
  { id: 201, warehouse: "Central Hub", product: "Milk 1L", supplier: "DairyCo", quantity: 500, status: "Pending" },
  { id: 202, warehouse: "North Warehouse", product: "Rice 5kg", supplier: "GrainsRUs", quantity: 300, status: "Ordered" },
];
