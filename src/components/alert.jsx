import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const Alert = ({ type, message }) => {
  return (
    <div
      className={`flex items-center p-4 mb-4 text-sm rounded-lg ${
        type === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
      role="alert"
    >
      {type === "success" ? (
        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
      ) : (
        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Alert;
