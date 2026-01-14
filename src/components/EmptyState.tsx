import { Filter } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
}

export function EmptyState({
  title = "No items found",
  description = "No records found matching your criteria.",
  icon: Icon = Filter,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
    </div>
  );
}
