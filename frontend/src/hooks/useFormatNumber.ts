import { useCallback } from "react";

const useFormatNumber = () => {
  const formatNumber = useCallback(
    (num: number, options?: Intl.NumberFormatOptions) =>
      num.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options,
      }),
    []
  );
  return formatNumber;
};

export default useFormatNumber;
