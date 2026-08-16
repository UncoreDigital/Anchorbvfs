// ============================================================================
// Company Informational Questionnaire — canonical form definition.
// ----------------------------------------------------------------------------
// Transcribed from:
//   docs/Anchor BVFS_General Sector_Questionnaire_WITH COVID 19 Related
//   Questions.pdf
// Section letters (A–J) and question numbers match that document so answers can
// be read side by side with the original.
//
// THIS FILE IS THE SINGLE SOURCE OF TRUTH and is shared by two runtimes:
//   1. the browser (renders the form + validates as the client types)
//   2. the `client-form` Supabase Edge Function (re-validates on the server,
//      because anything the browser sends can be forged)
//
// Deno can't import from `src/`, so the function keeps a generated copy at
// `supabase/functions/client-form/schema.ts`. After editing this file run:
//
//     npm run sync:client-form-schema
//
// Keep it dependency-free and free of browser/Deno-only APIs so both runtimes
// can execute it unchanged.
//
// Changing the questions: edit FORM_SECTIONS below. `key` values are the
// storage keys inside `client_form_submissions.data` — renaming a key orphans
// the answers already saved under the old name, so bump FORM_SCHEMA_VERSION
// instead of silently reusing a key for a different question.
// ============================================================================

export const FORM_SCHEMA_VERSION = 1;

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "radio"
  | "table";

export interface FieldOption {
  value: string;
  label: string;
}

export interface TableColumn {
  key: string;
  label: string;
  /** Rough column weight used for the grid template. */
  width?: number;
}

export interface FieldDef {
  /** Stable storage key. Never reuse a key for a different question. */
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** radio only. */
  options?: FieldOption[];
  /** text / textarea character ceiling. Enforced on both client and server. */
  maxLength?: number;
  /** Starting height for a textarea; it grows with the content beyond this. */
  rows?: number;
  /** 2 = full width on the desktop two-column grid. Long answers use 2. */
  colSpan?: 1 | 2;
  /** table only. */
  columns?: TableColumn[];
  /** table only — how many blank rows to show on a fresh form. */
  initialRows?: number;
  /** Render only when another field currently holds one of these values. */
  showWhen?: { key: string; in: Array<string | boolean> };
}

export interface SectionDef {
  /** "A", "B", … matching the source document. */
  letter: string;
  id: string;
  title: string;
  description?: string;
  fields: FieldDef[];
}

export type TableRow = Record<string, string>;
export type FieldValue = string | boolean | TableRow[] | null;
export type FormValues = Record<string, FieldValue>;

// Ceilings applied on both sides. A questionnaire this long needs room, but not
// unbounded room — the request body cap in the Edge Function depends on these.
export const MAX_TEXT_LENGTH = 300;
export const MAX_LONG_TEXT_LENGTH = 5000;
export const MAX_TABLE_ROWS = 40;
export const MAX_CELL_LENGTH = 500;

const YES_NO: FieldOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

/**
 * Only section A (Personal Information) is required. Everything else may be
 * left blank — we need to know who sent the questionnaire and how to reach
 * them; the rest we can chase up.
 *
 * Drafts are exempt from even that: `validateField(..., forDraft = true)`
 * skips required checks entirely, so partial saves keep working.
 */
export const REQUIRED_HINT =
  "Only your contact details in section A are required — answer what you can and leave the rest blank if it doesn't apply.";

/** Every long-form answer is a resizable, auto-growing textarea. */
function question(
  key: string,
  label: string,
  extra: Partial<FieldDef> = {},
): FieldDef {
  return {
    key,
    label,
    type: "textarea",
    rows: 4,
    maxLength: MAX_LONG_TEXT_LENGTH,
    colSpan: 2,
    ...extra,
  };
}

function shortField(
  key: string,
  label: string,
  extra: Partial<FieldDef> = {},
): FieldDef {
  return {
    key,
    label,
    type: "text",
    maxLength: MAX_TEXT_LENGTH,
    colSpan: 1,
    ...extra,
  };
}

// --- The questionnaire ------------------------------------------------------

export const FORM_SECTIONS: SectionDef[] = [
  {
    letter: "A",
    id: "personal",
    title: "Personal Information",
    fields: [
      shortField("a_name", "Name of person completing the Questionnaire", {
        required: true,
      }),
      {
        key: "a_email",
        label: "Email address",
        type: "email",
        required: true,
        maxLength: 200,
        colSpan: 1,
      },
      {
        key: "a_phone",
        label: "Phone",
        type: "tel",
        required: true,
        maxLength: 40,
        colSpan: 1,
      },
      shortField("a_relationship", "Relationship with the Company", {
        required: true,
      }),
    ],
  },

  {
    letter: "B",
    id: "company",
    title: "Company Background",
    fields: [
      shortField("b_legal_name", "Company's legal name"),
      shortField(
        "b_entity_type",
        "Type of entity (corporation, partnership, proprietorship)",
      ),
      shortField("b_date_formed", "Date of incorporation or formation", {
        placeholder: "e.g. 14 March 1998",
      }),
      shortField(
        "b_state_incorporated",
        "State incorporated (Corporations only)",
      ),
      shortField("b_shares_authorized", "Number of common shares authorized"),
      shortField("b_par_value", "Par value"),
      shortField(
        "b_shares_outstanding",
        "Number of shares issued and outstanding",
      ),
      shortField("b_treasury_shares", "Number of treasury shares"),
      question(
        "b1_other_stock",
        "1. If there are other types of stock, please briefly describe them below.",
      ),
      {
        key: "b2_owners",
        label:
          "2. List the major stockholders, partners, or owners of the company and their percentage of ownership or number of shares owned.",
        type: "table",
        colSpan: 2,
        initialRows: 3,
        columns: [
          { key: "name", label: "Name", width: 2 },
          { key: "ownership_pct", label: "% Ownership", width: 1 },
          { key: "shares", label: "Number of Shares Owned", width: 1 },
        ],
      },
      {
        key: "b3_related_parties",
        label:
          "3. List all known related parties (subsidiaries, affiliates, or relatives) that the company does business with.",
        type: "table",
        colSpan: 2,
        initialRows: 3,
        columns: [
          { key: "name", label: "Name", width: 1 },
          { key: "relationship", label: "Relationship", width: 1 },
        ],
      },
      {
        key: "b4_locations",
        label:
          "4. List each location maintained by the company and the primary activity at each location such as executive office, plant, sales office, etc.",
        type: "table",
        colSpan: 2,
        initialRows: 3,
        columns: [
          { key: "location", label: "Location", width: 1 },
          { key: "activity", label: "Activity", width: 1 },
        ],
      },
      question(
        "b5_evolution",
        "5. As applicable, discuss the evolution of (a) product lines, (b) customer base, (c) locations, (d) marketing activities, (e) distribution methods, (f) employees, (g) acquisitions, and (h) ownership.",
        { rows: 6 },
      ),
      question(
        "b6_key_dates",
        "6. Please list other key dates or events in the company's history.",
      ),
    ],
  },

  {
    letter: "C",
    id: "products",
    title: "Products or Services",
    fields: [
      question(
        "c1_description",
        "1. Provide a description of the company's primary line of business as well as other products and/or services.",
        { rows: 5 },
      ),
      question("c2_how_used", "2. How are the products or services used?"),
      question("c3_customer_base", "3. Describe the company's customer base."),
      {
        key: "c4_sales_breakdown",
        label: "4. Breakdown of sales and gross profit by product line:",
        type: "table",
        colSpan: 2,
        initialRows: 4,
        columns: [
          { key: "product", label: "Product", width: 2 },
          { key: "pct_of_sales", label: "% of Sales", width: 1 },
          {
            key: "gross_profit",
            label: "Gross Profit (exclude domestic shipping)",
            width: 1,
          },
        ],
      },
      question(
        "c5_cyclical",
        "5. Are sales cyclical? Do they exhibit seasonality? What economic factors (inflation, interest rates, etc.) affect sales?",
      ),
      question(
        "c6_technology_trends",
        "6. Discuss any industry technology trends. What trends may affect sales?",
      ),
    ],
  },

  {
    letter: "D",
    id: "marketing",
    title: "Marketing and Distribution",
    fields: [
      question(
        "d1_market_share",
        "1. What is the company's market share? How fragmented is the market? Is the market growing or shrinking?",
      ),
      question(
        "d2_distribution_channels",
        "2. What distribution channels does the company use (direct sales, distributors, retailers, Internet, etc.)? How successful are they?",
      ),
      question(
        "d3_sales_force_compensation",
        "3. How are members of your sales force compensated?",
      ),
      question(
        "d4_market_area",
        "4. What is the market area and what determines its size? How important are freight costs?",
      ),
      question(
        "d5_customer_concentration",
        "5. Are sales concentrated in a few customers? What percentage of total sales are made to the five largest customers?",
      ),
      question(
        "d6_customer_loyalty",
        "6. How loyal are customers, that is, do they tend to buy from the same company or switch? How does pricing affect customer loyalty?",
      ),
      question(
        "d7_bids",
        "7. If applicable, what percent of sales are obtained from bids? Is price the only factor considered by the potential customer in awarding the job? If not, what other factors are considered?",
      ),
      question(
        "d8_government_sales",
        "8. Does the company sell to the federal, state, or local government or government agencies? Are those sales likely to increase or decrease?",
      ),
      question(
        "d9_key_selling_feature",
        "9. What is the key selling feature — product, price, service, brand name, packaging, etc.?",
      ),
      question(
        "d10_promotion",
        "10. What type of promotion and advertising methods does the company use?",
      ),
    ],
  },

  {
    letter: "E",
    id: "competition",
    title: "Competition",
    fields: [
      question(
        "e1_major_competitors",
        "1. Who are the company's major competitors? Where are they located? How big are they? What is their market share? How diversified are they? (Identify those competitors, if any, that are publicly held.)",
        { rows: 5 },
      ),
      question(
        "e2_comparison",
        "2. How does the company compare in size and market share to its competitors?",
      ),
      question(
        "e3_barriers_to_entry",
        "3. How easy is it to enter the industry? What are the barriers to entry?",
      ),
      question(
        "e4_strengths_weaknesses",
        "4. What are the company's competitive strengths and weaknesses?",
      ),
    ],
  },

  {
    letter: "F",
    id: "operations",
    title: "Operations",
    fields: [
      question(
        "f1_organization_structure",
        "1. Describe the company's organization structure. (Attach organization chart, if available.)",
      ),
      question(
        "f2_facilities",
        "2. How old are the company's facilities? Where are they located relative to the primary markets?",
      ),
      question(
        "f3_process",
        "3. Describe the manufacturing or service process. Are any of the methods or equipment proprietary?",
      ),
      question(
        "f4_capacity",
        "4. What is plant capacity relative to current operating levels? How many shifts and days per week does the company operate? Might sales be constrained by inadequate capacity? Is there excess capacity or excessive fixed overhead costs?",
        { rows: 5 },
      ),
      question(
        "f5_owned_or_leased",
        "5. Are buildings and machinery owned or leased? If leased, are the leases renewable and on what terms?",
      ),
      question(
        "f6_equipment_condition",
        "6. What is the overall condition of the company's equipment, including its business information systems? Is there any inefficient or obsolete equipment? When is the machinery likely to be replaced? What is the likelihood of major repairs?",
        { rows: 5 },
      ),
      question(
        "f7_capital_labor_intensity",
        "7. How capital-intensive is the company? How labor-intensive?",
      ),
      question(
        "f8_employee_relations",
        "8. Briefly describe past and current employee relations (that is, contentious, harmonious, strikes, etc.). Also discuss employee turnover and indicate whether any of the employees are unionized.",
        { rows: 5 },
      ),
      question(
        "f9_labor_market",
        "9. Discuss the current labor market. How easy is it to attract qualified employees?",
      ),
      question(
        "f10_contractors",
        "10. How extensively are independent contractors used?",
      ),
      question(
        "f11_suppliers",
        "11. Discuss key suppliers. Are any suppliers the sole source? Have there been any major problems in getting raw materials or inventories? Are there long lead times to get the purchased goods?",
        { rows: 5 },
      ),
      question(
        "f12_regulation",
        "12. Discuss the effects of any federal or state regulation or subsidies on the company's operations.",
      ),
    ],
  },

  {
    letter: "G",
    id: "management",
    title: "Management",
    fields: [
      {
        key: "g1_key_management",
        label: "1. Please list key members of company management below.",
        type: "table",
        colSpan: 2,
        initialRows: 4,
        columns: [
          { key: "name", label: "Name", width: 1 },
          { key: "title", label: "Title", width: 1 },
        ],
      },
      question(
        "g2_officers",
        "2. Discuss the company's officers (age, health, education, experience, and current duties).",
        { rows: 5 },
      ),
      question(
        "g3_management_turnover",
        "3. Discuss any turnover in key members of management over the last 5 years.",
      ),
      question(
        "g4_compensation_basis",
        "4. Discuss basis of compensation. Also, describe employee benefits (insurance, stock options, profit sharing, etc.).",
      ),
      question(
        "g5_employment_contracts",
        "5. Discuss any employment contracts and, if applicable, non-compete agreements that will expire in the next five years.",
      ),
      question(
        "g6_officer_replacement",
        "6. How easily can officers be replaced (i.e., is there one or a few key officers on which the success of the company depends that cannot be easily replaced)?",
      ),
      question(
        "g7_board",
        "7. Who is on the board of directors and how active is the board in governing company activities?",
      ),
      {
        key: "g8_favored_employees",
        label:
          "8. Does the Company employ any relatives or favored people who receive compensation from the business without working, or who are at a level of compensation greater than what you would pay an unrelated/unfavored worker?",
        type: "radio",
        options: YES_NO,
        colSpan: 2,
      },
      question(
        "g8_favored_employees_detail",
        "If yes, please state the name, date hired, earnings, fringe benefits, number of hours typically worked per week, and an estimate of the amount they are paid in excess of the amount you would pay an arm's length employee to do the same job.",
        { rows: 5, showWhen: { key: "g8_favored_employees", in: ["yes"] } },
      ),
      {
        key: "g9_owner_benefits",
        label:
          "9. An important step in valuing a closely held entity is to normalize the stream of historical Income Statement by adding back all the expenses which are personal in nature or not related to the operations of the firm. What benefits (company car, company health insurance, your share of 401k, conventions, etc.) and the dollar value of them have you, your partners or family members been taking?",
        type: "table",
        colSpan: 2,
        initialRows: 4,
        columns: [
          { key: "benefit", label: "Benefit (descriptor)", width: 2 },
          { key: "current_year", label: "Current Year", width: 1 },
          { key: "last_year", label: "Last Year", width: 1 },
          { key: "prior_year_1", label: "Prior Year", width: 1 },
          { key: "prior_year_2", label: "Prior Year", width: 1 },
        ],
      },
    ],
  },

  {
    letter: "H",
    id: "financial",
    title: "Financial",
    fields: [
      question(
        "h1_unusual_matters",
        "1. Briefly describe any unusual matters that may require special consideration during the valuation.",
      ),
      question(
        "h2_accounting_changes",
        "2. Has there been any change in accounting principles during the past five years (cash to accrual, FIFO to LIFO, etc.) or similar changes that might affect the comparability of the financial statements?",
      ),
      question(
        "h3_nonrecurring_items",
        "3. Have there been any nonrecurring or extraordinary income or expenses during the last five years?",
      ),
      question(
        "h4_short_term_credit",
        "4. Describe short-term sources of credit and how they were used during the last five years.",
      ),
      question(
        "h5_long_term_credit",
        "5. Describe long-term sources of credit and how they were used during the last five years.",
      ),
      question(
        "h6_capital_expenditures",
        "6. Does the Company anticipate any significant capital expenditures in the coming year or two?",
      ),
      question(
        "h7_operating_cash",
        "7. On average, how much cash is kept within the business to meet operating cash flow requirements?",
      ),
      question(
        "h8_stock_rights",
        "8. Discuss any special stock rights, warrants, options, etc.",
      ),
      question("h9_dividends", "9. Discuss the company's dividend history."),
      question(
        "h10_interest_transactions",
        "10. Have there been any transactions involving interests in the company in the last five years? Provide details.",
      ),
      question(
        "h11_offers",
        "11. Describe any written or oral offers received for the company in the last five years.",
      ),
      question(
        "h12_sale_plans",
        "12. Discuss any plans to sell all or part of the company.",
      ),
      question(
        "h13_prior_appraisal",
        "13. Has the business previously been appraised? If so, when, for what purpose, and what was the valuation?",
      ),
      question(
        "h14_capex_plans",
        "14. Discuss plans for major capital expenditures, how they will be financed, and how much represents expansion versus replacement of existing assets.",
      ),
      question(
        "h15_contingent_liabilities",
        "15. Discuss any contingent liabilities, including lawsuits and pending or threatened litigation.",
      ),
      question(
        "h16_non_operating_assets",
        "16. Describe any non-operating assets, such as aircraft, boats, and real estate investments, and any intangible assets of the business that are not reflected in the company's balance sheet.",
        { rows: 5 },
      ),
    ],
  },

  {
    letter: "I",
    id: "expectations",
    title: "Company Expectations",
    fields: [
      question(
        "i1_trends",
        "1. Describe relevant past and expected future trends for the company, such as growth patterns, expansion or cutbacks of business segments, possible spin-offs, mergers or acquisitions.",
        { rows: 5 },
      ),
      question(
        "i2_long_range_plans",
        "2. Describe the company's future expectations, goals, objectives, and long-range plans.",
        { rows: 5 },
      ),
      question(
        "i3_growth_prospects",
        "3. What are the Company's growth prospects for the coming year(s)?",
      ),
      question(
        "i4_projected_income_statement",
        "4. Please provide a projected Income Statement (for 3–5 years, preferably).",
        {
          rows: 5,
          help: "Summarise it here, and send the spreadsheet through our secure upload page.",
        },
      ),
    ],
  },

  {
    letter: "J",
    id: "covid",
    title: "COVID-19 Related Questions",
    fields: [
      question(
        "j1_ppp_loans",
        "1. Did the Company receive PPP loans? (Most companies received two. Please treat them separately, date of receipt and amount $.)",
        { rows: 5 },
      ),
      question(
        "j2_loan_forgiveness",
        "2. Please provide the loan amount and if it is forgiven.",
      ),
      question(
        "j3_loan_date",
        "3. Please specify the approximate date you received the loan.",
      ),
      question(
        "j4_loan_on_financials",
        "4. How did you show the loan on your internal financial statements (did you put it in revenue, other income, on the balance sheet as a liability, etc.)?",
      ),
      question(
        "j5_loan_on_tax_return",
        "5. How did your tax accountant treat the loan on your tax return for 2020 (did they put it in other income, remove it, etc.)?",
      ),
      question(
        "j6_eidl",
        "6. Did you receive any EIDL loans, grants from state and local sources, etc.? How did you treat them on your financial statements?",
      ),
      question(
        "j7_shutdown_order",
        "7. Was your business subject to a shut-down order? If so, please provide dates and explain your response.",
      ),
      question(
        "j8_stay_home_order",
        "8. Geographical area subject to a stay-home order? Did that affect your business? If so, please explain how and provide the dates of the order.",
      ),
      question(
        "j9_other_impacts",
        "9. Has COVID-19 impacted your revenues or expenses in other ways than described above (i.e. personal protective equipment, salary increase or reduction, etc.)?",
      ),
      question(
        "j10_recovery",
        "10. On a monthly basis have you fully recovered? If not, what is your view of your trend?",
      ),
      question(
        "j11_supply_issues",
        "11. Are you having supply issues? Issues finding employees? Other related issues?",
      ),
      question(
        "j12_other_outcomes",
        "12. Are there any other favorable or unfavorable outcomes of the effects of COVID-19 that are impacting or may impact your business?",
      ),
    ],
  },
];

// --- Derived lookups --------------------------------------------------------

export const ALL_FIELDS: FieldDef[] = FORM_SECTIONS.reduce<FieldDef[]>(
  (acc, section) => acc.concat(section.fields),
  [],
);

export const FIELD_BY_KEY: Record<string, FieldDef> = ALL_FIELDS.reduce<
  Record<string, FieldDef>
>((acc, field) => {
  acc[field.key] = field;
  return acc;
}, {});

export const TOTAL_FIELD_COUNT = ALL_FIELDS.length;

// --- Value helpers ----------------------------------------------------------

export function isTableRows(value: unknown): value is TableRow[] {
  return Array.isArray(value);
}

/** A table row counts as filled only if at least one cell has content. */
export function rowHasContent(row: TableRow): boolean {
  return Object.values(row || {}).some(
    (cell) => typeof cell === "string" && cell.trim() !== "",
  );
}

export function isBlank(value: FieldValue | undefined): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (typeof value === "boolean") return value === false;
  if (isTableRows(value)) return !value.some(rowHasContent);
  return false;
}

/**
 * A field only applies when its `showWhen` dependency is satisfied — and when
 * that dependency is itself visible, so a hidden parent can't drag a hidden
 * child back into the required set.
 */
export function isFieldVisible(field: FieldDef, values: FormValues): boolean {
  if (!field.showWhen) return true;
  const parent = FIELD_BY_KEY[field.showWhen.key];
  if (parent && parent.showWhen && !isFieldVisible(parent, values)) return false;
  const current = values[field.showWhen.key];
  return field.showWhen.in.some((candidate) => candidate === current);
}

export function visibleFields(values: FormValues): FieldDef[] {
  return ALL_FIELDS.filter((field) => isFieldVisible(field, values));
}

export function emptyRow(field: FieldDef): TableRow {
  const row: TableRow = {};
  for (const column of field.columns || []) row[column.key] = "";
  return row;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/**
 * Validate one field. Returns an error message, or null when it passes.
 * `forDraft` skips "required" checks — a draft is allowed to be incomplete,
 * but the values it does hold still have to be well-formed.
 */
export function validateField(
  field: FieldDef,
  values: FormValues,
  forDraft = false,
): string | null {
  if (!isFieldVisible(field, values)) return null;

  const value = values[field.key];

  if (isBlank(value)) {
    if (!forDraft && field.required) return "This answer is required.";
    return null;
  }

  switch (field.type) {
    case "email":
      if (typeof value !== "string" || !EMAIL_RE.test(value.trim())) {
        return "Enter a valid email address.";
      }
      break;
    case "tel":
      if (typeof value !== "string" || value.replace(/\D/g, "").length < 7) {
        return "Enter a valid phone number.";
      }
      break;
    case "radio":
      if (!(field.options || []).some((option) => option.value === value)) {
        return "Choose one of the listed options.";
      }
      break;
    case "table": {
      if (!isTableRows(value)) return "Invalid value.";
      if (value.length > MAX_TABLE_ROWS) {
        return `Please keep this to ${MAX_TABLE_ROWS} rows or fewer.`;
      }
      break;
    }
    case "text":
    case "textarea":
      if (typeof value !== "string") return "Invalid value.";
      if (field.maxLength && value.length > field.maxLength) {
        return `Keep this under ${field.maxLength.toLocaleString()} characters.`;
      }
      break;
  }

  return null;
}

export type FormErrors = Record<string, string>;

export function validateSection(
  section: SectionDef,
  values: FormValues,
  forDraft = false,
): FormErrors {
  const errors: FormErrors = {};
  for (const field of section.fields) {
    const error = validateField(field, values, forDraft);
    if (error) errors[field.key] = error;
  }
  return errors;
}

export function validateAll(values: FormValues, forDraft = false): FormErrors {
  const errors: FormErrors = {};
  for (const field of ALL_FIELDS) {
    const error = validateField(field, values, forDraft);
    if (error) errors[field.key] = error;
  }
  return errors;
}

export function firstSectionWithError(errors: FormErrors): number {
  return FORM_SECTIONS.findIndex((section) =>
    section.fields.some((field) => errors[field.key]),
  );
}

/**
 * Drop unknown keys and coerce each value to the type its field declares.
 * The server runs this on everything it receives, so a hand-rolled request
 * can't stuff arbitrary JSON into the `data` column.
 */
export function sanitizeValues(input: unknown): FormValues {
  const out: FormValues = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return out;

  for (const [key, raw] of Object.entries(input as Record<string, unknown>)) {
    const field = FIELD_BY_KEY[key];
    if (!field) continue;
    if (raw === null || raw === undefined) continue;

    if (field.type === "table") {
      if (!Array.isArray(raw)) continue;
      const columns = (field.columns || []).map((column) => column.key);
      const rows: TableRow[] = [];
      for (const rawRow of raw.slice(0, MAX_TABLE_ROWS)) {
        if (!rawRow || typeof rawRow !== "object" || Array.isArray(rawRow)) {
          continue;
        }
        const row: TableRow = {};
        for (const column of columns) {
          const cell = (rawRow as Record<string, unknown>)[column];
          row[column] =
            typeof cell === "string" || typeof cell === "number"
              ? String(cell).slice(0, MAX_CELL_LENGTH)
              : "";
        }
        rows.push(row);
      }
      // Trailing blank rows are UI scaffolding, not data.
      while (rows.length && !rowHasContent(rows[rows.length - 1])) rows.pop();
      out[key] = rows;
      continue;
    }

    if (typeof raw !== "string" && typeof raw !== "number") continue;
    const text = String(raw);
    out[key] = field.maxLength ? text.slice(0, field.maxLength) : text;
  }

  return out;
}

/** How many visible questions currently hold an answer. */
export function completionStats(values: FormValues): {
  answered: number;
  total: number;
  percent: number;
} {
  const fields = visibleFields(values);
  const answered = fields.filter((field) => !isBlank(values[field.key])).length;
  const total = fields.length || 1;
  return {
    answered,
    total: fields.length,
    percent: Math.round((answered / total) * 100),
  };
}

export function sectionStats(
  section: SectionDef,
  values: FormValues,
): { answered: number; total: number } {
  const fields = section.fields.filter((field) => isFieldVisible(field, values));
  return {
    answered: fields.filter((field) => !isBlank(values[field.key])).length,
    total: fields.length,
  };
}

/** Human-readable answer, for the review step, the emails and the admin panel. */
export function displayValue(field: FieldDef, value: FieldValue): string {
  if (isBlank(value)) return "—";
  if (field.type === "radio") {
    const match = (field.options || []).find((o) => o.value === value);
    return match ? match.label : String(value);
  }
  if (field.type === "table" && isTableRows(value)) {
    const columns = field.columns || [];
    return value
      .filter(rowHasContent)
      .map((row) =>
        columns
          .map((column) => `${column.label}: ${row[column.key] || "—"}`)
          .join(" · "),
      )
      .join("\n");
  }
  return String(value);
}
