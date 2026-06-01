import { PutObjectCommand } from '@aws-sdk/client-s3'
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { r2 } from '../services/r2Client.js';

export const getSignedUploadUrl = async (req, res) => {
  try {
    // deconstruct the file name & file type from the request body
    const { fileName, fileType } = req.body;

      // create a unique file name from the system date - fileName
      // prevents filename collisions, keeps files organized, makes predictable & clean URL
    const objectKey = `dogs/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.RD_BUCKET_NAME,
      Key: objectKey,
      ContentType: fileType,
    });

      // creates a one time, timed temp url for the specific file described in command
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 60 });

    // this is the url that will be added to the database
    const finalUrl = `${process.env.R2_PUBLIC_URL}/${objectKey}`;

    res.json({ uploadUrl, finalUrl });
  } catch (err) {
    console.error('Error generating signed URL:', err);
    res.status(500).json({ error: 'Failed to generate signed URL' });
  }
};
