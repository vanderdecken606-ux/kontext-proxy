import formidable from "formidable";
import fs from "fs";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false, // we handle file upload manually
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Form parse error" });
    }

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
      }

      const imageFile = files.image;
      if (imageFile) {
        formData.append("image", fs.createReadStream(imageFile.filepath), imageFile.originalFilename);
      }

      const response = await fetch("https://image.pollinations.ai/api/v2/kontext", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.POLLI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const txt = await response.text();
        return res.status(response.status).json({ error: txt });
      }

      res.setHeader("Content-Type", "image/png");
      response.body.pipe(res);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
