import type { Access, Role } from "../types/qcims";

export type SectionAccessMap = {
  products: Access;
  warehouses: Access;
  inventory: Access;
  customers: Access;
  suppliers: Access;
  orders: Access;
  restocks: Access;
};

export function getSectionAccess(role: Role): SectionAccessMap {
  const isAdmin = role === "admin";

  return {
    products: { create: isAdmin, edit: isAdmin, remove: isAdmin },
    warehouses: { create: isAdmin, edit: isAdmin, remove: isAdmin },
    inventory: { create: isAdmin, edit: true, remove: false },
    customers: { create: isAdmin, edit: isAdmin, remove: isAdmin },
    suppliers: { create: isAdmin, edit: isAdmin, remove: isAdmin },
    orders: { create: true, edit: true, remove: false },
    restocks: { create: isAdmin, edit: true, remove: false },
  };
}
