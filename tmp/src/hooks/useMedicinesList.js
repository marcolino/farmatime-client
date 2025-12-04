import { useState, useEffect } from "react";
import makeGetFilteredOptions from "../libs/MakeGetFilteredOptions";

/**
 * Load medicines list file asynchronously
 */
export const useMedicinesList = () => {
  const dataFile = "../data/AIFA.js";
  const [getFilteredOptions, setGetFilteredOptions] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { default: medicinesList } = await import(dataFile);
      if (cancelled) return;

      const factory = makeGetFilteredOptions(medicinesList);
      setGetFilteredOptions(() => factory);
    })();

    return () => { cancelled = true; };
  }, []);

  return getFilteredOptions;
}
