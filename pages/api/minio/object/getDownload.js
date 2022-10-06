// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import minioClient from "../../../../lib/minioClient";

export default function handler(req, res) {
  const bucketName = req.query.bucketName || "test";
  const fileName = req.query.fileName || "test.jpg";
  let size = 0;
  minioClient.presignedUrl(
    "GET",
    bucketName,
    fileName,
    24 * 60 * 60,
    function (err, presignedUrl) {
      if (err) return res.json({ error: err });
      res.redirect(presignedUrl);
    }
  );
}
