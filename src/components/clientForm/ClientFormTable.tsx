import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  MAX_TABLE_ROWS,
  emptyRow,
  rowHasContent,
  type FieldDef,
  type TableRow,
} from "@/lib/clientForm/schema";

interface Props {
  field: FieldDef;
  rows: TableRow[];
  onChange: (rows: TableRow[]) => void;
  disabled?: boolean;
}

/**
 * Repeatable row editor for the questionnaire's tabular questions (owners,
 * related parties, locations, product mix, management, owner benefits).
 *
 * One set of inputs serves both breakpoints: the header row is desktop-only and
 * each cell carries its own label that only shows on mobile, so a five-column
 * table stacks instead of scrolling sideways on a phone.
 */
const ClientFormTable = ({ field, rows, onChange, disabled }: Props) => {
  const isMobile = useIsMobile();
  const columns = field.columns || [];
  const gridTemplate = `${columns
    .map((column) => `minmax(0, ${column.width ?? 1}fr)`)
    .join(" ")} 44px`;

  const setCell = (rowIndex: number, columnKey: string, value: string) => {
    onChange(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [columnKey]: value } : row,
      ),
    );
  };

  const addRow = () => {
    if (rows.length >= MAX_TABLE_ROWS) return;
    onChange([...rows, emptyRow(field)]);
  };

  const removeRow = (rowIndex: number) => {
    const next = rows.filter((_, index) => index !== rowIndex);
    // Never leave the client with no row to type into.
    onChange(next.length ? next : [emptyRow(field)]);
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        {/* Header — desktop only; mobile uses the per-cell labels below. */}
        <div
          className="hidden gap-px bg-slate-200 md:grid"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className="bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate"
            >
              {column.label}
            </div>
          ))}
          <div className="bg-slate-50" aria-hidden="true" />
        </div>

        <div className="divide-y divide-slate-200 md:divide-y-0">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-3 p-3 md:gap-px md:border-t md:border-slate-200 md:bg-slate-200 md:p-0"
              style={{
                gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : gridTemplate,
              }}
            >
              {columns.map((column) => (
                <div key={column.key} className="bg-white md:p-1.5">
                  <label className="mb-1 block text-xs font-medium text-slate md:hidden">
                    {column.label}
                  </label>
                  <Input
                    value={row[column.key] ?? ""}
                    onChange={(e) => setCell(rowIndex, column.key, e.target.value)}
                    disabled={disabled}
                    maxLength={500}
                    aria-label={`${column.label}, row ${rowIndex + 1}`}
                    className="h-10 border-slate/20 bg-white focus:border-gold focus:ring-gold/20 md:border-transparent md:shadow-none"
                  />
                </div>
              ))}
              <div className="flex items-center justify-end bg-white md:p-1.5">
                <button
                  type="button"
                  onClick={() => removeRow(rowIndex)}
                  disabled={
                    disabled || (rows.length === 1 && !rowHasContent(row))
                  }
                  aria-label={`Remove row ${rowIndex + 1}`}
                  className="rounded-md p-2 text-slate transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          disabled={disabled || rows.length >= MAX_TABLE_ROWS}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add row
        </Button>
        {rows.length >= MAX_TABLE_ROWS && (
          <span className="text-xs text-slate">
            Maximum {MAX_TABLE_ROWS} rows — please attach a schedule instead.
          </span>
        )}
      </div>
    </div>
  );
};

export default ClientFormTable;
