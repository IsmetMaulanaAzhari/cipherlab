import React from "react";
import { useCipher } from "../hooks/useCipher";

type Example = {
  id: string;
  cipherId: string;
  name: string;
  description: string;
  params?: Record<string, string>;
  input: string;
  mode?: "encrypt" | "decrypt";
};

const EXAMPLES: Example[] = [
  {
    id: "caesar-hello",
    cipherId: "caesar",
    name: "Caesar: HELLO",
    description: "Shift 3 (classic)",
    params: { shift: "3" },
    input: "HELLO WORLD",
    mode: "encrypt",
  },
  {
    id: "vigenere-attack",
    cipherId: "vigenere",
    name: "Vigenère: ATTACK",
    description: "Key: LEMON",
    params: { key: "LEMON" },
    input: "ATTACK AT DAWN",
    mode: "encrypt",
  },
  {
    id: "enigma-hello",
    cipherId: "enigma",
    name: "Enigma: HELLO",
    description: "Rotors I II III, pos AAA",
    params: { rotors: "I II III", positions: "AAA", key: "B" },
    input: "HELLO",
    mode: "encrypt",
  },
  {
    id: "hill-hill",
    cipherId: "hill",
    name: "Hill: HILL",
    description: "Key: HILL (2x2)",
    params: { key: "HILL" },
    input: "HELP",
    mode: "encrypt",
  },
];

export const CipherExamples: React.FC = () => {
  const {
    selectCipher,
    setParam,
    setInputText,
    setMode,
    reset,
    selectedCipher,
  } = useCipher();

  function loadExample(e: Example) {
    // pilih cipher
    selectCipher(e.cipherId);
    // reset dulu untuk menghindari parameter sisa
    reset();
    // set mode
    if (e.mode) setMode(e.mode);
    // set params
    if (e.params) {
      Object.entries(e.params).forEach(([k, v]) => setParam(k, v));
    }
    // set input
    setInputText(e.input);
  }

  return (
    <div className="bg-slate-800 rounded-md p-4 text-sm text-slate-200">
      <h3 className="text-lg font-semibold mb-2">Contoh Interaktif</h3>
      <p className="mb-3 text-slate-400">Klik "Muat" untuk memuat contoh ke form dan area teks.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {EXAMPLES.map((ex) => (
          <div key={ex.id} className="p-3 bg-slate-900 rounded flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{ex.name}</div>
                <div className="text-xs text-slate-400">{ex.description}</div>
              </div>
              <div>
                <button
                  className="ml-3 bg-emerald-500 text-black px-2 py-1 rounded text-xs"
                  onClick={() => loadExample(ex)}
                >
                  Muat
                </button>
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-300">
              <div className="break-words">Input: {ex.input}</div>
              {ex.params && (
                <div className="mt-1 text-slate-400">Params: {JSON.stringify(ex.params)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-400">Cipher saat ini: {selectedCipher?.name ?? "(belum)"}</div>
    </div>
  );
};

export default CipherExamples;
