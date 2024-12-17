import { useState } from "react";
import axios, { AxiosError } from "axios";

export const useRemoveDocument = () => {
  const [isBusy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (repoPath: string): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      await axios.delete(`/api/fs`, { data: { repoPath } });
      setBusy(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message);
      setBusy(false);
    }
  };

  return { isBusy, error, remove };
};
