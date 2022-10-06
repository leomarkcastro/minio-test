// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import minioClient from "../../../../lib/minioClient";

export default function handler(req, res) {
  const bucketName = req.query.bucketName || "test";
  minioClient.bucketExists(bucketName, function (err, exists) {
    if (err) {
      return res.json({
        err,
      });
    }
    if (exists) {
      res.status(200).json({ status: "Bucket already exists" });
    } else {
      minioClient.makeBucket(bucketName, "us-east-1", {}, function (err) {
        if (err) {
          console.log(err);
          return res.json({
            err,
          });
        }
        res.status(200).json({ status: "Success" });
      });
    }
  });
}
