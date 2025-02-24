export function Input({
  type,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`mt-1 block w-full text-gray-700 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 ${className}`}
    />
  );
}
