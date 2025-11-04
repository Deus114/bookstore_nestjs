export function getFullPathS3(path: string): string {
  if (!path) {
    return '';
  }

  // Nếu đã là full URL thì trả về luôn
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Lấy endpoint từ environment variable
  const endpoint = process.env.AWS_S3_ENDPOINT || '';
  const bucket = process.env.STORAGE_BUCKET || '';

  // Nếu path bắt đầu bằng / thì bỏ đi
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // Tạo full URL
  return `${endpoint}/${bucket}/${cleanPath}`;
}

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
};

const yellow = (text: string): string =>
  `${colors.yellow}${text}${colors.reset}`;
const green = (text: string): string => `${colors.green}${text}${colors.reset}`;

export interface IStartupPrinter {
  appName: string;
  env: NodeJS.ProcessEnv;
}

export const startUpPrinting = (printer: IStartupPrinter): void => {
  console.log('');
  console.log('');
  console.log(
    yellow(
      '                 ========================================================================',
    ),
  );
  console.log(
    yellow(
      `                        ${green('Instance Name')}: ${printer.appName}`,
    ),
  );
  console.log(
    yellow(
      `                        ${green('Instance Port')}: ${printer.env.PORT}`,
    ),
  );
  console.log(
    yellow(
      `                        ${green('PostgreSQL Host')}: ${
        printer.env.DB_HOST
      }`,
    ),
  );
  console.log(
    yellow(
      `                        ${green('PostgreSQL Port')}: ${
        printer.env.DB_PORT
      }`,
    ),
  );
  console.log(
    yellow(
      `                        ${green('PostgreSQL Database')}: ${
        printer.env.DB_NAME
      }`,
    ),
  );
  console.log(
    yellow(
      `                        ${green('AWS Region')}: ${
        printer.env.AWS_REGION || 'none'
      }`,
    ),
  );
  console.log(
    yellow(
      `                        ${green('Storage Bucket')}: ${
        printer.env.STORAGE_BUCKET || 'none'
      }`,
    ),
  );
  console.log(
    yellow(
      '                 =========================================================================',
    ),
  );
  console.log('');
  console.log('');
};
