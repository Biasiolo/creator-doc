import type { StoredDocument } from "@/types/document";

const KEY = "gc:documents";

/** Camada de persistência — trocar por Supabase no futuro sem alterar as telas. */
function readAll(): StoredDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredDocument[]) : [];
  } catch {
    return [];
  }
}

function writeAll(docs: StoredDocument[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(docs));
}

export const storageService = {
  list(): StoredDocument[] {
    return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  get(id: string): StoredDocument | undefined {
    return readAll().find((d) => d.id === id);
  },
  save(doc: Omit<StoredDocument, "createdAt" | "updatedAt"> & Partial<Pick<StoredDocument, "createdAt">>): StoredDocument {
    const docs = readAll();
    const now = new Date().toISOString();
    const index = docs.findIndex((d) => d.id === doc.id);
    const merged: StoredDocument = {
      ...(index >= 0 ? docs[index]! : ({} as StoredDocument)),
      ...doc,
      createdAt: doc.createdAt ?? docs[index]?.createdAt ?? now,
      updatedAt: now,
    };
    if (index >= 0) docs[index] = merged;
    else docs.unshift(merged);
    writeAll(docs);
    return merged;
  },
  duplicate(id: string): StoredDocument | undefined {
    const original = readAll().find((d) => d.id === id);
    if (!original) return undefined;
    const now = new Date().toISOString();
    const copy: StoredDocument = {
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (cópia)`,
      createdAt: now,
      updatedAt: now,
    };
    writeAll([copy, ...readAll()]);
    return copy;
  },
  remove(id: string) {
    writeAll(readAll().filter((d) => d.id !== id));
  },
};
