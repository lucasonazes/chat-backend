import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().nullable().optional(),
  file: z.string().optional(),
  fileName: z.string().optional(),
  fileType: z.string().optional(),
  receiverId: z.uuid({ message: 'Invalid receiver ID' })
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
