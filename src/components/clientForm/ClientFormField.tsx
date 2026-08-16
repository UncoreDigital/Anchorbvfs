import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AutoGrowTextarea from "./AutoGrowTextarea";
import ClientFormTable from "./ClientFormTable";
import {
  emptyRow,
  isTableRows,
  type FieldDef,
  type FieldValue,
  type TableRow,
} from "@/lib/clientForm/schema";

interface Props {
  field: FieldDef;
  value: FieldValue | undefined;
  error?: string;
  disabled?: boolean;
  onChange: (value: FieldValue) => void;
}

/** Warn about the ceiling only once it's actually in sight. */
const COUNTER_THRESHOLD = 0.8;

const ClientFormField = ({ field, value, error, disabled, onChange }: Props) => {
  const inputId = `cf-${field.key}`;
  const helpId = field.help ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  const text = typeof value === "string" ? value : "";
  const showCounter =
    field.maxLength !== undefined &&
    field.type === "textarea" &&
    text.length > field.maxLength * COUNTER_THRESHOLD;

  const control = () => {
    switch (field.type) {
      case "textarea":
        return (
          <AutoGrowTextarea
            id={inputId}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            rows={field.rows ?? 4}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={describedBy}
          />
        );

      case "radio":
        return (
          <RadioGroup
            value={typeof value === "string" ? value : ""}
            onValueChange={onChange}
            disabled={disabled}
            aria-describedby={describedBy}
            className="flex flex-wrap gap-6 pt-1"
          >
            {(field.options || []).map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${inputId}-${option.value}`}
                />
                <Label
                  htmlFor={`${inputId}-${option.value}`}
                  className="cursor-pointer font-normal text-navy"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "table": {
        // A fresh table needs visible blank rows to type into; the sanitizer
        // strips trailing empties again before anything is stored.
        const rows: TableRow[] = isTableRows(value)
          ? value
          : Array.from({ length: field.initialRows ?? 3 }, () =>
              emptyRow(field),
            );
        const padded = rows.length ? rows : [emptyRow(field)];
        return (
          <ClientFormTable
            field={field}
            rows={padded}
            onChange={onChange}
            disabled={disabled}
          />
        );
      }

      default:
        return (
          <Input
            id={inputId}
            type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            disabled={disabled}
            autoComplete={
              field.type === "email"
                ? "email"
                : field.type === "tel"
                  ? "tel"
                  : undefined
            }
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className="h-12 border-slate/20 bg-white focus:border-gold focus:ring-gold/20"
          />
        );
    }
  };

  return (
    <div
      className={field.colSpan === 2 ? "md:col-span-2" : undefined}
      data-field={field.key}
    >
      <Label
        htmlFor={field.type === "table" || field.type === "radio" ? undefined : inputId}
        className="mb-2 block text-sm font-medium leading-relaxed text-navy"
      >
        {field.label}
        {field.required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {field.help && (
        <p id={helpId} className="mb-2 text-xs text-slate">
          {field.help}
        </p>
      )}

      {control()}

      <div className="mt-1.5 flex items-start justify-between gap-4">
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-600"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        ) : (
          <span />
        )}
        {showCounter && (
          <span className="shrink-0 text-xs text-slate">
            {text.length.toLocaleString()} / {field.maxLength!.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ClientFormField;
