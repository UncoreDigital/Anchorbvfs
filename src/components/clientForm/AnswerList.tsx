import {
  FORM_SECTIONS,
  displayValue,
  isBlank,
  isFieldVisible,
  isTableRows,
  rowHasContent,
  type FieldDef,
  type FieldValue,
  type FormValues,
} from "@/lib/clientForm/schema";

/** Tabular answers keep their grid; everything else is preformatted text. */
const Answer = ({ field, value }: { field: FieldDef; value: FieldValue }) => {
  if (field.type === "table" && isTableRows(value)) {
    const columns = field.columns || [];
    const rows = value.filter(rowHasContent);
    if (rows.length === 0) return <p className="mt-1 text-slate">—</p>;
    return (
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs font-semibold text-slate"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border border-slate-200 px-3 py-1.5 text-navy"
                  >
                    {row[column.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p className="mt-1 whitespace-pre-wrap leading-relaxed text-navy">
      {displayValue(field, value)}
    </p>
  );
};

interface Props {
  values: FormValues;
  /**
   * false hides unanswered questions — useful in Preview, where the point is
   * to read back what will actually be sent rather than audit the gaps.
   */
  includeBlanks?: boolean;
}

/** Read-only rendering of the whole questionnaire, grouped by section. */
const AnswerList = ({ values, includeBlanks = true }: Props) => {
  const sections = FORM_SECTIONS.map((section) => ({
    section,
    fields: section.fields
      .filter((field) => isFieldVisible(field, values))
      .filter((field) => includeBlanks || !isBlank(values[field.key])),
  })).filter(({ fields }) => fields.length > 0);

  if (sections.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate">
        Nothing filled in yet — answer a few questions and they'll appear here.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map(({ section, fields }) => (
        <section key={section.id}>
          <h3 className="mb-4 border-l-4 border-gold pl-3 font-display text-lg font-bold text-navy">
            {section.letter}. {section.title}
          </h3>
          <div className="space-y-4">
            {fields.map((field) => (
              <div
                key={field.key}
                className="rounded-lg border border-slate-100 bg-slate-50/60 p-4"
              >
                <p className="text-sm font-medium leading-relaxed text-slate">
                  {field.label}
                </p>
                {isBlank(values[field.key]) ? (
                  <p className="mt-1 text-slate">—</p>
                ) : (
                  <Answer field={field} value={values[field.key] ?? null} />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AnswerList;
