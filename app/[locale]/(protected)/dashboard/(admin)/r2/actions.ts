"use server";

import { deleteFile as deleteR2Util, ListedObject, listR2Objects } from "@/lib/cloudflare/r2";
import { z } from "zod";

export type R2File = ListedObject;

export interface ListR2FilesResult {
  files: R2File[];
  nextContinuationToken?: string;
  error?: string;
}

export interface DeleteR2FileResult {
  success: boolean;
  error?: string;
}

const listSchema = z.object({
  categoryPrefix: z.string(),
  filterPrefix: z.string().optional(),
  continuationToken: z.string().optional(),
  pageSize: z.number().int().positive().max(100).default(20),
});

const deleteSchema = z.object({
  key: z.string().min(1, "File key cannot be empty"),
});

export async function listR2Files(
  input: z.infer<typeof listSchema>
): Promise<ListR2FilesResult> {
  const validationResult = listSchema.safeParse(input);
  if (!validationResult.success) {
    const formattedErrors = validationResult.error.flatten().fieldErrors;
    return { files: [], error: `Invalid input: ${JSON.stringify(formattedErrors)}` };
  }

  const { categoryPrefix, filterPrefix, continuationToken, pageSize } = validationResult.data;

  const searchPrefix = filterPrefix ? `${categoryPrefix}${filterPrefix}` : categoryPrefix;

  try {
    const result = await listR2Objects({
      prefix: searchPrefix,
      continuationToken: continuationToken,
      pageSize: pageSize,
    });

    if (result.error) {
      return { files: [], error: result.error };
    }

    return {
      files: result.objects,
      nextContinuationToken: result.nextContinuationToken,
    };
  } catch (error: any) {
    console.error("Failed to list files using generic R2 lister:", error);
    return { files: [], error: `Failed to list files: ${error.message || 'Unknown error'}` };
  }
}

export async function deleteR2File(input: z.infer<typeof deleteSchema>): Promise<DeleteR2FileResult> {
  const validationResult = deleteSchema.safeParse(input);
  if (!validationResult.success) {
    const formattedErrors = validationResult.error.flatten().fieldErrors;
    return { success: false, error: `Invalid input: ${JSON.stringify(formattedErrors)}` };
  }

  const { key } = validationResult.data;

  try {
    await deleteR2Util(key);
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to delete R2 file (${key}):`, error);
    return { success: false, error: error.message || 'Failed to delete file from R2.' };
  }
} 