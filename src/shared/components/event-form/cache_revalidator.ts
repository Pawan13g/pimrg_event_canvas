"use server";

import { revalidateTag } from "next/cache";

export async function TagRevalidator() {
  revalidateTag("events/recents");
  revalidateTag("events");
}
