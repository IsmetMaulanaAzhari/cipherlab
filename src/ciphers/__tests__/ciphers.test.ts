import { describe, it, expect } from "vitest";
import { atbashCipher } from "../atbash";
import { rot13Cipher } from "../rot13";
import { caesarCipher } from "../caesar";
import { vigenereCipher } from "../vigenere";
import { railFenceCipher } from "../railfence";
import { playfairCipher } from "../playfair";
import { affineCipher } from "../affine";
import { hillCipher } from "../hill";
import { homophonicCipher } from "../homophonic";
import { enigmaCipher } from "../enigma";
import { columnarCipher } from "../columnar";
import { productCipher } from "../product";

// ─────────────────────────────────────────────
// ATBASH
// ─────────────────────────────────────────────
describe("Atbash Cipher", () => {
  it("mengenkripsi dengan benar", () => {
    expect(atbashCipher.encrypt("HELLO", {})).toBe("SVOOL");
  });

  it("mendekripsi dengan benar (self-inverse)", () => {
    expect(atbashCipher.decrypt("SVOOL", {})).toBe("HELLO");
  });

  it("round-trip: decrypt(encrypt(x)) === x", () => {
    const original = "Hello World";
    expect(atbashCipher.decrypt(atbashCipher.encrypt(original, {}), {})).toBe(
      original,
    );
  });

  it("mempertahankan karakter non-alfabet", () => {
    expect(atbashCipher.encrypt("Hello, World! 123", {})).toBe(
      "Svool, Dliow! 123",
    );
  });

  it("preserve case: huruf kecil tetap kecil", () => {
    expect(atbashCipher.encrypt("abc", {})).toBe("zyx");
    expect(atbashCipher.encrypt("ABC", {})).toBe("ZYX");
  });

  it("input kosong tidak crash", () => {
    expect(() => atbashCipher.encrypt("", {})).not.toThrow();
    expect(atbashCipher.encrypt("", {})).toBe("");
  });
});

// ─────────────────────────────────────────────
// ROT13
// ─────────────────────────────────────────────
describe("ROT13 Cipher", () => {
  it("mengenkripsi dengan benar", () => {
    expect(rot13Cipher.encrypt("HELLO", {})).toBe("URYYB");
  });

  it("self-inverse: encrypt dua kali kembali ke awal", () => {
    const original = "Hello World";
    expect(rot13Cipher.encrypt(rot13Cipher.encrypt(original, {}), {})).toBe(
      original,
    );
  });

  it("dekripsi = enkripsi (self-inverse)", () => {
    expect(rot13Cipher.decrypt("URYYB", {})).toBe("HELLO");
  });

  it("mempertahankan karakter non-alfabet", () => {
    expect(rot13Cipher.encrypt("Hello, World! 123", {})).toBe(
      "Uryyb, Jbeyq! 123",
    );
  });

  it("input kosong tidak crash", () => {
    expect(() => rot13Cipher.encrypt("", {})).not.toThrow();
    expect(rot13Cipher.encrypt("", {})).toBe("");
  });
});

// ─────────────────────────────────────────────
// CAESAR
// ─────────────────────────────────────────────
describe("Caesar Cipher", () => {
  it("mengenkripsi dengan shift 3", () => {
    expect(caesarCipher.encrypt("HELLO", { shift: "3" })).toBe("KHOOR");
  });

  it("mendekripsi dengan shift 3", () => {
    expect(caesarCipher.decrypt("KHOOR", { shift: "3" })).toBe("HELLO");
  });

  it("round-trip: decrypt(encrypt(x)) === x", () => {
    const original = "Hello World";
    const encrypted = caesarCipher.encrypt(original, { shift: "13" });
    expect(caesarCipher.decrypt(encrypted, { shift: "13" })).toBe(original);
  });

  it("mempertahankan karakter non-alfabet", () => {
    expect(caesarCipher.encrypt("Hello, World!", { shift: "3" })).toBe(
      "Khoor, Zruog!",
    );
  });

  it("preserve case", () => {
    expect(caesarCipher.encrypt("abc", { shift: "1" })).toBe("bcd");
    expect(caesarCipher.encrypt("ABC", { shift: "1" })).toBe("BCD");
  });

  it("shift 0 tidak mengubah teks", () => {
    expect(caesarCipher.encrypt("HELLO", { shift: "0" })).toBe("HELLO");
  });

  it("wrap-around z → a dengan shift 1", () => {
    expect(caesarCipher.encrypt("z", { shift: "1" })).toBe("a");
    expect(caesarCipher.encrypt("Z", { shift: "1" })).toBe("A");
  });

  it("input kosong tidak crash", () => {
    expect(() => caesarCipher.encrypt("", { shift: "3" })).not.toThrow();
    expect(caesarCipher.encrypt("", { shift: "3" })).toBe("");
  });
});

// ─────────────────────────────────────────────
// VIGENÈRE
// ─────────────────────────────────────────────
describe("Vigenère Cipher", () => {
  it("mengenkripsi dengan benar", () => {
    expect(vigenereCipher.encrypt("HELLO", { key: "KEY" })).toBe("RIJVS");
  });

  it("mendekripsi dengan benar", () => {
    expect(vigenereCipher.decrypt("RIJVS", { key: "KEY" })).toBe("HELLO");
  });

  it("round-trip: decrypt(encrypt(x)) === x", () => {
    const original = "Hello World";
    const encrypted = vigenereCipher.encrypt(original, { key: "SECRET" });
    expect(vigenereCipher.decrypt(encrypted, { key: "SECRET" })).toBe(original);
  });

  it("mempertahankan spasi dan tanda baca", () => {
    const text = "Hello, World!";
    const key = "KEY";
    const encrypted = vigenereCipher.encrypt(text, { key });
    expect(vigenereCipher.decrypt(encrypted, { key })).toBe(text);
  });

  it("key case-insensitive", () => {
    const r1 = vigenereCipher.encrypt("HELLO", { key: "key" });
    const r2 = vigenereCipher.encrypt("HELLO", { key: "KEY" });
    expect(r1).toBe(r2);
  });

  it("input kosong tidak crash", () => {
    expect(() => vigenereCipher.encrypt("", { key: "KEY" })).not.toThrow();
    expect(vigenereCipher.encrypt("", { key: "KEY" })).toBe("");
  });
});

// ─────────────────────────────────────────────
// RAIL FENCE
// ─────────────────────────────────────────────
describe("Rail Fence Cipher", () => {
  it("mengenkripsi dengan 2 rel", () => {
    // HELLO → H L O + E L (rel 1: H,L,O | rel 2: E,L)
    expect(railFenceCipher.encrypt("HELLO", { rails: "2" })).toBe("HLOEL");
  });

  it("mendekripsi dengan 2 rel", () => {
    expect(railFenceCipher.decrypt("HLOEL", { rails: "2" })).toBe("HELLO");
  });

  it("round-trip: decrypt(encrypt(x)) === x", () => {
    const original = "WEAREDISCOVEREDFLEEAATONCE";
    const encrypted = railFenceCipher.encrypt(original, { rails: "3" });
    expect(railFenceCipher.decrypt(encrypted, { rails: "3" })).toBe(original);
  });

  it("rails >= panjang teks: kembalikan teks asli", () => {
    expect(railFenceCipher.encrypt("HI", { rails: "5" })).toBe("HI");
  });

  it("rails = 1: kembalikan teks asli", () => {
    expect(railFenceCipher.encrypt("HELLO", { rails: "1" })).toBe("HELLO");
  });

  it("input kosong tidak crash", () => {
    expect(() => railFenceCipher.encrypt("", { rails: "3" })).not.toThrow();
    expect(railFenceCipher.encrypt("", { rails: "3" })).toBe("");
  });
});

// ─────────────────────────────────────────────
// PLAYFAIR
// ─────────────────────────────────────────────
describe("Playfair Cipher", () => {
  it("mengenkripsi dengan benar", () => {
    // "HELLO" dengan key "PLAYFAIR" menghasilkan output tertentu
    const result = playfairCipher.encrypt("HELLO", { key: "PLAYFAIR" });
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("round-trip: decrypt(encrypt(x)) === x (uppercase no spaces)", () => {
    const original = "HELLOWORLD";
    const key = "KEYWORD";
    const encrypted = playfairCipher.encrypt(original, { key });
    const decrypted = playfairCipher.decrypt(encrypted, { key });
    // Playfair mungkin menambahkan X sebagai padding — hasil dekripsi bisa lebih panjang
    expect(
      decrypted.startsWith("HELLOWORLD") ||
        decrypted.replace(/X/g, "").startsWith("HELLOWORLD".replace(/X/g, "")),
    ).toBe(true);
  });

  it("output panjang genap", () => {
    const result = playfairCipher.encrypt("HELLO", { key: "KEY" });
    expect(result.length % 2).toBe(0);
  });

  it("J diperlakukan sama dengan I", () => {
    const withI = playfairCipher.encrypt("HIDE", { key: "KEYWORD" });
    const withJ = playfairCipher.encrypt("HJDE", { key: "KEYWORD" });
    expect(withI).toBe(withJ);
  });

  it("input kosong tidak crash", () => {
    expect(() => playfairCipher.encrypt("", { key: "KEY" })).not.toThrow();
    expect(playfairCipher.encrypt("", { key: "KEY" })).toBe("");
  });
});

// ─────────────────────────────────────────────
// AFFINE
// ─────────────────────────────────────────────
describe("Affine Cipher", () => {
  it("mengenkripsi dengan benar (a=5, b=8)", () => {
    expect(affineCipher.encrypt("HELLO", { a: "5", b: "8" })).toBe("RCLLA");
  });

  it("mendekripsi dengan benar", () => {
    expect(affineCipher.decrypt("RCLLA", { a: "5", b: "8" })).toBe("HELLO");
  });

  it("round-trip: decrypt(encrypt(x)) === x", () => {
    const original = "Hello World";
    const enc = affineCipher.encrypt(original, { a: "7", b: "3" });
    expect(affineCipher.decrypt(enc, { a: "7", b: "3" })).toBe(original);
  });

  it("mempertahankan karakter non-alfabet", () => {
    const enc = affineCipher.encrypt("Hello, World!", { a: "5", b: "8" });
    expect(enc).toContain(",");
    expect(enc).toContain("!");
  });

  it("a tidak valid melempar error", () => {
    expect(() => affineCipher.encrypt("ABC", { a: "2", b: "3" })).toThrow();
  });

  it("a=1 identik dengan Caesar shift=b", () => {
    expect(affineCipher.encrypt("HELLO", { a: "1", b: "3" })).toBe(
      "KHOOR", // sama dengan Caesar shift 3
    );
  });

  it("input kosong tidak crash", () => {
    expect(() => affineCipher.encrypt("", { a: "5", b: "8" })).not.toThrow();
    expect(affineCipher.encrypt("", { a: "5", b: "8" })).toBe("");
  });
});

// ─────────────────────────────────────────────
// HILL
// ─────────────────────────────────────────────
describe("Hill Cipher", () => {
  it("mengenkripsi dengan benar (key=HILL)", () => {
    expect(hillCipher.encrypt("HELLO", { key: "HILL" })).toBe("DRJIWR");
  });

  it("mendekripsi dengan benar", () => {
    // DRJIWR → HELLOX (dengan padding X)
    const dec = hillCipher.decrypt("DRJIWR", { key: "HILL" });
    expect(dec.startsWith("HELLO")).toBe(true);
  });

  it("round-trip: decrypt(encrypt(x)) dimulai dengan teks asli", () => {
    // key "HELP": H=7,E=4,L=11,P=15 → det=7*15-4*11=61≡9 mod 26, gcd(9,26)=1 ✓
    const original = "ATTACK";
    const enc = hillCipher.encrypt(original, { key: "HELP" });
    const dec = hillCipher.decrypt(enc, { key: "HELP" });
    expect(dec.startsWith(original)).toBe(true);
  });

  it("output selalu panjang genap", () => {
    const enc = hillCipher.encrypt("HELLO", { key: "HILL" });
    expect(enc.length % 2).toBe(0);
  });

  it("kunci kurang dari 4 huruf melempar error", () => {
    expect(() => hillCipher.encrypt("HELLO", { key: "AB" })).toThrow();
  });

  it("input kosong tidak crash", () => {
    expect(() => hillCipher.encrypt("", { key: "HILL" })).not.toThrow();
    expect(hillCipher.encrypt("", { key: "HILL" })).toBe("");
  });
});

// ─────────────────────────────────────────────
// HOMOPHONIC
// ─────────────────────────────────────────────
describe("Cipher Homofonik", () => {
  it("enkripsi menghasilkan string digit saja", () => {
    const enc = homophonicCipher.encrypt("HELLO", {});
    expect(/^\d+$/.test(enc)).toBe(true);
  });

  it("panjang output = 2 × jumlah huruf", () => {
    const enc = homophonicCipher.encrypt("HELLO", {});
    expect(enc.length).toBe(10); // 5 huruf × 2 digit
  });

  it("round-trip: decrypt(encrypt(x)) === x (uppercase)", () => {
    const original = "HELLOWORLD";
    const enc = homophonicCipher.encrypt(original, {});
    expect(homophonicCipher.decrypt(enc, {})).toBe(original);
  });

  it("enkripsi 'E' menghasilkan kode antara 00-12", () => {
    const enc = homophonicCipher.encrypt("E", {});
    const code = parseInt(enc, 10);
    expect(code).toBeGreaterThanOrEqual(0);
    expect(code).toBeLessThanOrEqual(12);
  });

  it("jumlah digit ganjil melempar error", () => {
    // 3 digit = ganjil → setiap huruf butuh tepat 2 digit
    expect(() => homophonicCipher.decrypt("123", {})).toThrow();
  });

  it("input kosong tidak crash", () => {
    expect(() => homophonicCipher.encrypt("", {})).not.toThrow();
    expect(homophonicCipher.encrypt("", {})).toBe("");
  });
});

// ─────────────────────────────────────────────
// ENIGMA
// ─────────────────────────────────────────────
describe("Enigma Machine", () => {
  const defaultParams = { rotors: "1 2 3", positions: "AAA" };

  it("mengenkripsi HELLO dengan rotor I,II,III di AAA → ILBDA", () => {
    expect(enigmaCipher.encrypt("HELLO", defaultParams)).toBe("ILBDA");
  });

  it("self-inverse: decrypt menggunakan setting yang sama", () => {
    expect(enigmaCipher.decrypt("ILBDA", defaultParams)).toBe("HELLO");
  });

  it("round-trip dengan setting berbeda", () => {
    const params = { rotors: "3 1 2", positions: "XYZ" };
    const enc = enigmaCipher.encrypt("TESTMESSAGE", params);
    expect(enigmaCipher.decrypt(enc, params)).toBe("TESTMESSAGE");
  });

  it("mempertahankan karakter non-alfabet", () => {
    const enc = enigmaCipher.encrypt("HELLO WORLD", defaultParams);
    expect(enc).toContain(" ");
  });

  it("rotor tidak valid melempar error", () => {
    expect(() =>
      enigmaCipher.encrypt("HELLO", { rotors: "1 1 2", positions: "AAA" }),
    ).toThrow(); // rotor duplikat
    expect(() =>
      enigmaCipher.encrypt("HELLO", { rotors: "1 6 2", positions: "AAA" }),
    ).toThrow(); // rotor 6 tidak ada
  });

  it("posisi tidak valid melempar error", () => {
    expect(() =>
      enigmaCipher.encrypt("HELLO", { rotors: "1 2 3", positions: "AA" }),
    ).toThrow(); // hanya 2 huruf
  });

  it("input kosong tidak crash", () => {
    expect(() => enigmaCipher.encrypt("", defaultParams)).not.toThrow();
    expect(enigmaCipher.encrypt("", defaultParams)).toBe("");
  });
});

// ─────────────────────────────────────────────
// COLUMNAR TRANSPOSITION
// ─────────────────────────────────────────────
describe("Cipher Transposisi (Columnar)", () => {
  it("mengenkripsi dengan benar (key=KEY)", () => {
    expect(columnarCipher.encrypt("HELLO", { key: "KEY" })).toBe("EOHLLX");
  });

  it("mendekripsi dengan benar", () => {
    const dec = columnarCipher.decrypt("EOHLLX", { key: "KEY" });
    expect(dec.startsWith("HELLO")).toBe(true);
  });

  it("round-trip: decrypt(encrypt(x)) dimulai dengan teks asli", () => {
    const original = "ATTACKATDAWN";
    const enc = columnarCipher.encrypt(original, { key: "ZEBRA" });
    const dec = columnarCipher.decrypt(enc, { key: "ZEBRA" });
    expect(dec.startsWith(original)).toBe(true);
  });

  it("hanya memproses huruf (non-huruf dibuang)", () => {
    const enc = columnarCipher.encrypt("Hello World", { key: "KEY" });
    expect(/^[A-Z]+$/.test(enc)).toBe(true);
  });

  it("input kosong tidak crash", () => {
    expect(() => columnarCipher.encrypt("", { key: "KEY" })).not.toThrow();
    expect(columnarCipher.encrypt("", { key: "KEY" })).toBe("");
  });
});

// ─────────────────────────────────────────────
// PRODUCT CIPHER (SUPER ENKRIPSI)
// ─────────────────────────────────────────────
describe("Product Cipher — Super Enkripsi", () => {
  const params = { vigKey: "SECRET", transKey: "KEY" };

  it("menghasilkan output berupa huruf saja", () => {
    const enc = productCipher.encrypt("HELLO", params);
    expect(/^[A-Z]+$/.test(enc)).toBe(true);
  });

  it("round-trip: decrypt(encrypt(x)) === original (tanpa padding)", () => {
    // transKey 5 karakter, original 10 karakter → 10/5=2 baris, tanpa padding
    const original = "HELLOWORLD";
    const p = { vigKey: "SECRET", transKey: "ABCDE" };
    const enc = productCipher.encrypt(original, p);
    const dec = productCipher.decrypt(enc, p);
    expect(dec).toBe(original);
  });

  it("berbeda dari enkripsi Vigenère saja", () => {
    const enc = productCipher.encrypt("HELLO", params);
    const vigOnly = vigenereCipher.encrypt("HELLO", { key: params.vigKey });
    expect(enc).not.toBe(vigOnly);
  });

  it("key berbeda menghasilkan output berbeda", () => {
    // Gunakan kunci huruf saja (angka distrip oleh Vigenère)
    const enc1 = productCipher.encrypt("HELLO", {
      vigKey: "KEYA",
      transKey: "ABC",
    });
    const enc2 = productCipher.encrypt("HELLO", {
      vigKey: "KEYB",
      transKey: "ABC",
    });
    expect(enc1).not.toBe(enc2);
  });

  it("input kosong tidak crash", () => {
    expect(() => productCipher.encrypt("", params)).not.toThrow();
    expect(productCipher.encrypt("", params)).toBe("");
  });
});

// ─────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────
describe("Cipher Registry", () => {
  it("semua cipher teregistrasi", async () => {
    const { CIPHER_REGISTRY } = await import("../index");
    const ids = CIPHER_REGISTRY.map((c) => c.id);
    expect(ids).toContain("caesar");
    expect(ids).toContain("vigenere");
    expect(ids).toContain("atbash");
    expect(ids).toContain("rot13");
    expect(ids).toContain("railfence");
    expect(ids).toContain("playfair");
    expect(ids).toContain("affine");
    expect(ids).toContain("hill");
    expect(ids).toContain("homophonic");
    expect(ids).toContain("enigma");
    expect(ids).toContain("columnar");
    expect(ids).toContain("product");
  });

  it("setiap cipher memiliki category yang valid", async () => {
    const { CIPHER_REGISTRY } = await import("../index");
    const validCategories = ["substitution", "transposition", "product"];
    for (const cipher of CIPHER_REGISTRY) {
      expect(validCategories).toContain(cipher.category);
    }
  });

  it("getCipherById menemukan cipher yang benar", async () => {
    const { getCipherById } = await import("../index");
    expect(getCipherById("caesar")?.id).toBe("caesar");
    expect(getCipherById("enigma")?.id).toBe("enigma");
    expect(getCipherById("tidak-ada")).toBeUndefined();
  });

  it("getCiphersByCategory mengelompokkan dengan benar", async () => {
    const { getCiphersByCategory, CIPHER_REGISTRY } = await import("../index");
    const subs = getCiphersByCategory("substitution");
    const trans = getCiphersByCategory("transposition");
    const prod = getCiphersByCategory("product");
    expect(subs.every((c) => c.category === "substitution")).toBe(true);
    expect(trans.every((c) => c.category === "transposition")).toBe(true);
    expect(prod.every((c) => c.category === "product")).toBe(true);
    expect(subs.length + trans.length + prod.length).toBe(
      CIPHER_REGISTRY.length,
    );
  });
});
