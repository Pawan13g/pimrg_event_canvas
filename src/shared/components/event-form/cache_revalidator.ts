"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function TagRevalidator() {
  revalidateTag("events");
}
