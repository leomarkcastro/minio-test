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

  const form = formidable({
    multiples: true,
    keepExtensions: true,
    filename: function (name, ext, part, form) {
      const hash = new SHA3(256);
      const current = new Date();
      hash.update(`${current.getTime().toString()}-${name}`);
      return hash.digest("hex") + ext;
    },
  });
  form.parse(req, (err, fields, files) => {
    // console.log(fields, files);
    if (err) {
      res.status(500).json({ error: err });
      return;
    } else {
      const myfile = files.file;
      // console.log(myfile);
      const fileStream = fs.createReadStream(myfile.filepath);
      const fileStat = fs.stat(myfile.filepath, function (err2, stats) {
        if (err2) {
          return res.status(500).json(err);
        }
        minioClient.putObject(
          bucketName,
          myfile.newFilename,
          fileStream,
          stats.size,
          function (err3, etag) {
            if (err3) {
              return res.status(500).json(err3);
            }
            return res.send(myfile.newFilename);
          }
        );
      });
      // return res.status(200).json({ fields, files });
    }
  });
}
