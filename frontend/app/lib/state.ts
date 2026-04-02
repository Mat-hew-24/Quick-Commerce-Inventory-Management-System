import type { Row, StateSetter } from "../types/qcims";

export function createAddRowHandler<T extends { id: number }>(
  setter: StateSetter<T>,
  closeForm: () => void,
  mapRow: (data: Row, nextId: number) => T,
) {
  return (data: Row) => {
    setter((prev) => [
      ...prev,
      mapRow(
        data,
        prev.length ? Math.max(...prev.map((row) => row.id)) + 1 : 1,
      ),
    ]);
    closeForm();
  };
}
