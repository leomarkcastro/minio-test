// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import minioClient from "../../../../lib/minioClient";

export default function handler(req, res) {
  const bucketName = req.query.bucketName || "test";
  const data = [];
  const stream = minioClient.listObjects(bucketName, "", true, {
    IncludeVersion: true,
  });
  stream.on("data", function (obj) {
    data.push(obj);
  });
  stream.on("end", function (obj) {
    res.json(data);
  });
  stream.on("error", function (err) {
    res.json(err);
  });
}
