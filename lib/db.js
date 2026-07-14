import { createClient } from '@libsql/client';

let client;

const DEFAULT_TURSO_URL = 'libsql://hmti-database-jossmulalinda.aws-ap-northeast-1.turso.io';
const DEFAULT_TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQwNDAyNjAsImlkIjoiMDE5ZjYxMTAtNWYwMS03MWQzLWIyMjQtM2Y3NTA2NDJlZTE1Iiwia2lkIjoiWFVROGt5aVhvNlpFUjY0VndlYlFRQWlTVXlFYm1WV2dVWk13Q0JORTZXRSIsInJpZCI6IjM2NzA5NzhjLWI4OTctNDcwMC05MDY1LTRjZjk1YjJhNzMxOCJ9.D8S_xHqU9N7alHWkR0_1MWMLQAkRqDfueKrorsOCC2bVxb_P7xJKc-rrnEFHmXoPdq_kDymtnwqR9XnXXLFiAw';

export function getDb() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || DEFAULT_TURSO_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN || DEFAULT_TURSO_TOKEN;

    client = createClient({
      url,
      authToken,
    });
  }
  return client;
}
