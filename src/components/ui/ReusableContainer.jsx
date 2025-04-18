import { PlusIcon } from "@heroicons/react/24/outline";
import { ReusableSearch } from "./ReusableSearch";
import { ReusableFilter } from "./ReusableFilter";

export const ReusableContainer = ({
  title = "",
  searchPlaceholder = "",
  onSearchChange = () => {},
  filters = [],
  onFilterChange = () => {},
  onAddClick,
  addButtonLabel,
  children,
  showWhiteBox = true, // Conditional White Box
}) => {
  return (
    <div className="bg-gray-50 min-h-screen text-textPrimary space-y-4">
      {/* Optional Title */}
      {title && (
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h2>
      )}

      {/* Search, Filters, Add Button */}
      <div className="flex flex-wrap gap-4 items-center">
        <ReusableSearch
          searchPlaceholder={searchPlaceholder}
          onSearchChange={onSearchChange}
        />

        {filters.length > 0 && (
          <ReusableFilter filters={filters} onFilterChange={onFilterChange} />
        )}

        {onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition cursor-pointer mr-0 ml-auto"
          >
            <PlusIcon className="h-5 w-5" />
            {addButtonLabel}
          </button>
        )}
      </div>

      {/* Main Content */}
      {showWhiteBox ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};
