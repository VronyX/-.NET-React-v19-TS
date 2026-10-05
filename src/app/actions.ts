"use server";

import { refresh } from "next/cache";
import { pizzaExists, toggleFavorite } from "@/lib/data";
import { shouldFail, simulateLatency } from "@/lib/demo";

// Dengan begini, fungsi toggleFavoriteAction hanya memiliki dua kemungkinan hasil: sukses atau gagal. Ini membuatnya lebih mudah untuk ditangani di sisi klien, karena kita tidak perlu memikirkan berbagai jenis kesalahan yang mungkin terjadi. Ini diatur didalam ActionResult, yang bisa berupa { ok: true } untuk sukses atau { ok: false; error: string } untuk gagal. Dengan begitu, kita bisa langsung menampilkan pesan kesalahan yang sesuai kepada pengguna jika terjadi kegagalan.
export type ActionResult = { ok: true } | { ok: false; error: string };

export async function toggleFavoriteAction(
  pizzaId: string,
): Promise<ActionResult> {
  if (typeof pizzaId !== "string" || !(await pizzaExists(pizzaId))) {
    return { ok: false, error: "Pizza tidak ditemukan." };
  }

  await simulateLatency("write");
  if (await shouldFail()) {
    return { ok: false, error: "Gagal menyimpan favorit. Coba lagi." };
  }

  await toggleFavorite(pizzaId);
  refresh(); // Refresh the cache for the current page and all layouts
  return { ok: true };
}
