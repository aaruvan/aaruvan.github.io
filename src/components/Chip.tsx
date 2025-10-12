interface ChipProps {
  label: string;
  value: string;
}

export const Chip = ({ label, value }: ChipProps) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 mr-2">
      {label}: {value}
    </span>
  );
};

