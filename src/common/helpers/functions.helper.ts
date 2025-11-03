/**
 * Get full S3 URL from path
 * @param path - File path on S3 (e.g., 'users/123/images/photo.jpg')
 * @returns Full URL to access the file
 */
export function getFullPathS3(path: string): string {
  const bucket = process.env.STORAGE_BUCKET?.replace('s3://', '') || '';
  const region = process.env.AWS_REGION || 'ap-southeast-1';
  const endpoint = process.env.AWS_S3_ENDPOINT || 'https://s3.amazonaws.com';

  const cleanBucket = bucket.replace('s3://', '');

  if (endpoint.includes('amazonaws.com')) {
    return `https://${cleanBucket}.s3.${region}.amazonaws.com/${path}`;
  } else {
    return `${endpoint}/${cleanBucket}/${path}`;
  }
}
