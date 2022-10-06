// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import minioClient from "../../../../lib/minioClient";
import fs from "fs";
import formidable from "formidable";
import { SHA3 } from "sha3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const bucketName = req.query.bucketName || "test";
  const fileName = req.query.fileName || "test.jpg";

  minioClient.removeObject(bucketName, fileName, function (err) {
    if (err) {
      return console.log("Unable to remove object", err);
    }
    console.log("Removed the object");
  });
}
