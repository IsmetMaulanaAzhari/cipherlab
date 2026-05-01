import { useState, useCallback } from "react";
import type { CipherDefinition } from "../types/cipher";
import { CIPHER_REGISTRY } from "../ciphers/index";

/** Mode operasi cipher */
export type CipherMode = "encrypt" | "decrypt";

/** State yang dikelola oleh hook ini */
interface CipherState {
  selectedCipher: CipherDefinition | null;
  mode: CipherMode;
  params: Record<string, string>;
  inputText: string;
  outputText: string;
  error: string | null;
}

/** Return type dari hook useCipher */
interface UseCipherReturn extends CipherState {
  ciphers: CipherDefinition[];
  selectCipher: (id: string) => void;
  setMode: (mode: CipherMode) => void;
  setParam: (key: string, value: string) => void;
  setInputText: (text: string) => void;
  convert: () => void;
  reset: () => void;
  swapTexts: () => void;
}

/**
 * Hook utama untuk mengelola state operasi cipher:
 * cipher yang dipilih, mode, parameter, teks input/output.
 */
export function useCipher(): UseCipherReturn {
  const [state, setState] = useState<CipherState>({
    selectedCipher: null,
    mode: "encrypt",
    params: {},
    inputText: "",
    outputText: "",
    error: null,
  });

  /** Pilih cipher baru, reset semua state lainnya */
  const selectCipher = useCallback((id: string) => {
    const cipher = CIPHER_REGISTRY.find((c) => c.id === id) ?? null;
    setState((prev) => ({
      ...prev,
      selectedCipher: cipher,
      params: {},
      outputText: "",
      error: null,
    }));
  }, []);

  /** Ubah mode enkripsi/dekripsi */
  const setMode = useCallback((mode: CipherMode) => {
    setState((prev) => ({ ...prev, mode, outputText: "", error: null }));
  }, []);

  /** Update satu parameter cipher */
  const setParam = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      params: { ...prev.params, [key]: value },
      error: null,
    }));
  }, []);

  /** Update teks input */
  const setInputText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, inputText: text, error: null }));
  }, []);

  /** Jalankan enkripsi atau dekripsi */
  const convert = useCallback(() => {
    setState((prev) => {
      const { selectedCipher, mode, params, inputText } = prev;

      // Validasi: cipher harus dipilih
      if (!selectedCipher) {
        return { ...prev, error: "Pilih metode kriptografi terlebih dahulu." };
      }

      // Validasi: input tidak boleh kosong
      if (!inputText.trim()) {
        return { ...prev, error: "Teks input tidak boleh kosong." };
      }

      // Validasi: semua parameter wajib diisi
      for (const param of selectedCipher.params) {
        if (!params[param.key]?.trim()) {
          return { ...prev, error: `Parameter "${param.label}" wajib diisi.` };
        }
        if (param.type === "number") {
          const val = parseInt(params[param.key], 10);
          if (isNaN(val)) {
            return {
              ...prev,
              error: `Parameter "${param.label}" harus berupa angka.`,
            };
          }
          if (param.min !== undefined && val < param.min) {
            return {
              ...prev,
              error: `"${param.label}" minimal ${param.min}.`,
            };
          }
          if (param.max !== undefined && val > param.max) {
            return {
              ...prev,
              error: `"${param.label}" maksimal ${param.max}.`,
            };
          }
        }
        if (param.type === "text") {
          if (!/[a-zA-Z]/.test(params[param.key])) {
            return {
              ...prev,
              error: `"${param.label}" harus mengandung setidaknya satu huruf.`,
            };
          }
        }
      }

      try {
        const outputText =
          mode === "encrypt"
            ? selectedCipher.encrypt(inputText, params)
            : selectedCipher.decrypt(inputText, params);
        return { ...prev, outputText, error: null };
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Terjadi kesalahan saat proses.";
        return { ...prev, error: msg };
      }
    });
  }, []);

  /** Tukar input dan output (serta balik mode) */
  const swapTexts = useCallback(() => {
    setState((prev) => ({
      ...prev,
      inputText: prev.outputText,
      outputText: prev.inputText,
      mode: prev.mode === "encrypt" ? "decrypt" : "encrypt",
      error: null,
    }));
  }, []);

  /** Reset semua state ke kondisi awal */
  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      params: {},
      inputText: "",
      outputText: "",
      error: null,
    }));
  }, []);

  return {
    ...state,
    ciphers: CIPHER_REGISTRY,
    selectCipher,
    setMode,
    setParam,
    setInputText,
    convert,
    reset,
    swapTexts,
  };
}
