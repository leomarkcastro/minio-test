// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import minioClient from "../../../../lib/minioClient";

export default function handler(req, res) {
  const bucketName = req.query.bucketName || "test";
  const fileName = req.query.fileName || "test.jpg";
  let size = 0;
  let data;
  minioClient.getObject(bucketName, fileName, function (err, objStream) {
    if (err) {
      return console.log(err);
    }
    objStream.on("data", function (chunk) {
      data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
    });
    objStream.on("end", function () {
      // res.writeHead(200, { "Content-Type": "image/jpeg" });
      // cache result
      res.setHeader("Cache-Control", "s-maxage=10000, stale-while-revalidate");
      res.write(data);
      res.end();
    });
    objStream.on("error", function (err) {
      res.status(500);
      res.send(err);
    });
  });
}
