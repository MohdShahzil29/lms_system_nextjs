import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";
dotenv.config({});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// lib/cloudinary.ts

export const uploadMedia = async (file: any) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
};

export const uploadVideo = (fileBlob: Blob): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" }, // ← auto detects image or video
      (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );
    // convert Blob to Buffer and pipe into the uploader
    fileBlob
      .arrayBuffer()
      .then((ab) => Buffer.from(ab))
      .then((buf) => streamifier.createReadStream(buf).pipe(uploadStream))
      .catch(reject);
  });
};

export const deleteMediaFromCloudinary = async (publicId: any) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideo = async (publicId: any) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};
