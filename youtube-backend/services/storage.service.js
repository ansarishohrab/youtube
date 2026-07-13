const { S3Client } = require("@aws-sdk/client-s3");
const fs = require("fs");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

async function uploadFile(filePath, objectKey, contentType) {
  const fileStream = fs.createReadStream(filePath);

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
      Body: fileStream,
      ContentType: contentType,
    }),
  );

  return objectKey;
}

const r2Client = new S3Client({
  region: "auto",

  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

module.exports = {
  r2Client,
  uploadFile
};
