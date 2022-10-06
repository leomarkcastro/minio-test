// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import minioClient from "../../../../lib/minioClient";

export default function handler(req, res) {
  minioClient.listBuckets(function (err, buckets) {
    if (err) {
      console.log(err);
      return res.json({
        err,
      });
    }
    res.status(200).json({ status: "Success", buckets });
  });
}
