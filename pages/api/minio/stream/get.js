// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import minioClient from "../../../../lib/minioClient";

export default function handler(req, res) {
  const bucketName = req.query.bucketName || "test";
  const fileName = req.query.fileName || "test.mp4";

  minioClient.statObject(bucketName, fileName, function (err, stat) {
    if (err) {
      return res.send(500).json(err);
    }
    const videoSize = stat.size;
    const range = req.headers.range;
    const start = Number(range.replace(/\D/g, ""));
    const CHUNK_SIZE = 10 ** 6;
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    let data;

    minioClient.getPartialObject(
      bucketName,
      fileName,
      start,
      contentLength,
      function (err, objStream) {
        if (err) {
          return console.log(err);
        }
        objStream.on("data", function (chunk) {
          data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
        });
        objStream.on("end", function () {
          // res.writeHead(200, { "Content-Type": "image/jpeg" });
          // cache result
          res.setHeader(
            "Cache-Control",
            "s-maxage=10000, stale-while-revalidate"
          );
          res.setHeader("Content-Range", `bytes ${start}-${end}/${videoSize}`);
          res.setHeader("Accept-Ranges", "bytes");
          res.setHeader("Content-Length", contentLength);
          // res.setHeader("Content-Type", "video/mp4");

          res.status(206).write(data);
          res.end();
        });
        objStream.on("error", function (err) {
          res.status(500);
          res.send(err);
        });
      }
    );
  });
}
