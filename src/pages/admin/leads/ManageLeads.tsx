import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Mail,
  Phone,
  Calendar,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  consent: boolean;
}

interface PdfDownload {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  downloaded_asset: string;
}

const ManageLeads = () => {
  const [activeTab, setActiveTab] = useState<"leads" | "downloads">("leads");
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "", // Only for leads
    company: "", // Only for downloads
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "created_at", direction: "desc" }); // Default sort
  const [selectedLead, setSelectedLead] = useState<Lead | PdfDownload | null>(
    null
  );
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["leads", activeTab, currentPage, filters, sortConfig],
    queryFn: async () => {
      let query;

      if (activeTab === "leads") {
        query = supabase.from("leads").select("*", { count: "exact" });
        if (filters.subject)
          query = query.ilike("subject", `%${filters.subject}%`);
      } else {
        query = supabase.from("pdf_downloads").select("*", { count: "exact" });
        if (filters.company)
          query = query.ilike("company", `%${filters.company}%`);
      }

      // Common Filters
      if (filters.name) query = query.ilike("name", `%${filters.name}%`);
      if (filters.email) query = query.ilike("email", `%${filters.email}%`);
      if (filters.phone) query = query.ilike("phone", `%${filters.phone}%`);

      // Apply Sorting
      if (sortConfig) {
        // Safe cast as we know the keys exist on both or logic handles it
        query = query.order(sortConfig.key as any, {
          ascending: sortConfig.direction === "asc",
        });
      }

      // Apply Pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      return { data: data as (Lead | PdfDownload)[], count };
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });

  const leads = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key)
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    if (sortConfig.direction === "asc")
      return (
        <ArrowUpDown className="w-3 h-3 text-primary rotate-180 transition-transform" />
      );
    return (
      <ArrowUpDown className="w-3 h-3 text-primary transition-transform" />
    );
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (isLoading && !data) {
    // Only show full loader if no data is available yet
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-playfair font-bold text-primary">
          Manage Leads
        </h1>
        <p className="text-gray-500">
          View and manage website contact form submissions and PDF downloads.
        </p>
      </div>

      {/* Tabs / Toggle */}
      <div className="flex items-center gap-4 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => {
            setActiveTab("leads");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "leads"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Contact Inquiries
        </button>
        <button
          onClick={() => {
            setActiveTab("downloads");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "downloads"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          PDF Downloads
        </button>
      </div>

      {/* Attributes Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Name
          </label>
          <Input
            placeholder="Search name..."
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Email
          </label>
          <Input
            placeholder="Search email..."
            value={filters.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Phone
          </label>
          <Input
            placeholder="Search phone..."
            value={filters.phone}
            onChange={(e) => handleFilterChange("phone", e.target.value)}
            className="h-9"
          />
        </div>

        {activeTab === "leads" ? (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Subject
            </label>
            <Input
              placeholder="Search subject..."
              value={filters.subject}
              onChange={(e) => handleFilterChange("subject", e.target.value)}
              className="h-9"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Company
            </label>
            <Input
              placeholder="Search company..."
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
              className="h-9"
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center gap-1">
                  Date
                  {getSortIcon("created_at")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email
                  {getSortIcon("email")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("phone")}
              >
                <div className="flex items-center gap-1">
                  Phone
                  {getSortIcon("phone")}
                </div>
              </TableHead>

              {activeTab === "downloads" && (
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
                  onClick={() => handleSort("downloaded_asset")}
                >
                  <div className="flex items-center gap-1">
                    Asset
                    {getSortIcon("downloaded_asset")}
                  </div>
                </TableHead>
              )}

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(lead.created_at), "MMM d, yyyy h:mm a")}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-primary">
                  {lead.name}
                  {activeTab === "downloads" &&
                    (lead as PdfDownload).company && (
                      <div className="text-xs text-gray-500 font-normal mt-0.5">
                        {(lead as PdfDownload).company}
                      </div>
                    )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-3 h-3" />
                    {lead.email}
                  </div>
                </TableCell>
                <TableCell>
                  {lead.phone ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>

                {activeTab === "downloads" && (
                  <TableCell>
                    <span
                      className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium truncate max-w-[150px]"
                      title={(lead as PdfDownload).downloaded_asset}
                    >
                      {(lead as PdfDownload).downloaded_asset}
                    </span>
                  </TableCell>
                )}

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={activeTab === "downloads" ? 6 : 5}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-8 h-8 text-gray-300" />
                    <p>No records found matching your filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
              records
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      >
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair font-bold text-primary">
              {activeTab === "leads" ? "Lead Details" : "Download Details"}
            </DialogTitle>
            <DialogDescription>
              Full details of the submission.
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Submission Date
                  </label>
                  <p className="text-gray-900">
                    {format(new Date(selectedLead.created_at), "PPP p")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedLead.name}
                  </p>
                </div>

                {activeTab === "leads" ? (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Subject
                    </label>
                    <p className="text-gray-900">
                      {(selectedLead as Lead).subject}
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Company
                    </label>
                    <p className="text-gray-900">
                      {(selectedLead as PdfDownload).company || "-"}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center gap-2 text-primary hover:underline mt-1"
                  >
                    <Mail className="w-3 h-3" />
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  {selectedLead.phone ? (
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="flex items-center gap-2 text-gray-900 hover:text-primary mt-1"
                    >
                      <Phone className="w-3 h-3" />
                      {selectedLead.phone}
                    </a>
                  ) : (
                    <p className="text-gray-400">-</p>
                  )}
                </div>
              </div>

              {activeTab === "leads" && (selectedLead as Lead).message && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    Message
                  </label>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {(selectedLead as Lead).message}
                  </p>
                </div>
              )}

              {activeTab === "downloads" && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    Downloaded Asset
                  </label>
                  <p className="text-gray-700 font-mono text-sm break-all">
                    {(selectedLead as PdfDownload).downloaded_asset}
                  </p>
                </div>
              )}

              {activeTab === "leads" && (
                <div className="text-xs text-gray-400">
                  Consent Given: {(selectedLead as Lead).consent ? "Yes" : "No"}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageLeads;
