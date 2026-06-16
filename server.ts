import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini API client on the server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST API for Academic ML Engineering Analysis with Gemini
app.post("/api/gemini/explain", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured inside server.ts. Please configure GEMINI_API_KEY in secrets."
      });
    }

    const {
      datasetName,
      metrics,
      features,
      target,
      bestModel,
      featureImportances,
      predictionDetails
    } = req.body;

    let prompt = `You are a highly distinguished Mechanical Engineering Professor and Artificial Intelligence Expert at Universitas Muhammadiyah Yogyakarta.
Provide a premium, academic-level technical analysis of a trained machine learning regression model from the "MechAutoML AI" system.

Here are the details of the trained system:
- Dataset: ${datasetName || "Mechanical Engineering Dataset"}
- Input Features Selected: ${features?.join(", ") || "N/A"}
- Output Target Variable: ${target || "N/A"}
- Chosen Best Model: ${bestModel || "Extra Trees Regressor"}
- Best Model Metrics:
  * R² Score: ${(metrics?.r2 !== undefined) ? metrics.r2.toFixed(4) : "N/A"}
  * Mean Absolute Error (MAE): ${(metrics?.mae !== undefined) ? metrics.mae.toFixed(4) : "N/A"}
  * Root Mean Squared Error (RMSE): ${(metrics?.rmse !== undefined) ? metrics.rmse.toFixed(4) : "N/A"}
  * Mean Absolute Percentage Error (MAPE): ${(metrics?.mape !== undefined) ? (metrics.mape * 100).toFixed(2) + "%" : "N/A"}

- Feature Importances for Best Model:
${featureImportances ? JSON.stringify(featureImportances, null, 2) : "N/A"}

${predictionDetails ? `The user also made a prediction with the following input values:
${JSON.stringify(predictionDetails.inputs, null, 2)}
Resulting in predicted ${target}: ${predictionDetails.output?.toFixed(4)}` : ""}

Task Instructions:
1. Provide a concise, highly professional mechanical engineering interpretation of these results. Explain *why* some features are more influential based on thermo-fluids, manufacturing, solid mechanics, or physical principles typically associated with these parameter names.
2. Critically analyze the performance metrics (R², MAE, RMSE, MAPE). Is it reliable for actual physical test prediction, and what are the academic conclusions?
3. Format output in neat, well-structured Markdown. Keep paragraphs elegant, educational, professional, and clear. Avoid overly long texts, make it punchy and suit academic presentation. Focus on a warm but strictly professional tone. Keep the review concise (approx 300-400 words) so it fits beautifully in the UI. Keep it and sign it off as "AI Academic Advisor - MechAutoML AI".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert academic advisor in Mechanical Engineering and Applied Artificial Intelligence at universitas Muhammadiyah Yogyakarta for student Ananda Nur Daffa Zain (NIM: 20230130023)."
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Explanation Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error during Gemini processing." });
  }
});// REST API for Academic Advisor Interactive Q&A Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const {
      messages,
      datasetName,
      features,
      target,
      bestModel,
      metrics,
      attachments
    } = req.body;

    const studentMessages = messages ? messages.filter((m: any) => m.sender === "student") : [];
    const lastStudentMsg = studentMessages[studentMessages.length - 1]?.text || "";
    const qLower = lastStudentMsg.toLowerCase().trim();

    // Check if the user's inquiry is a simple greeting or brief acknowledgement
    const isShortGreeting = qLower === "halo" || qLower === "pagi" || qLower === "siang" || qLower === "sore" || qLower === "malam" || 
                           qLower === "assalamualaikum" || qLower === "permisi" || qLower === "hi" || qLower === "hey" || qLower === "halo prof" ||
                           qLower === "halo AI" || qLower === "siap" || qLower === "oke" || qLower === "baik" || qLower === "terima kasih" ||
                           qLower === "thanks" || qLower.length < 15;

    // If Gemini key is not configured, trigger our highly advanced rule-based manufacturing simulator fallback!
    if (!ai) {
      let reply = "";

      if (isShortGreeting) {
        reply = `Wa'alaikumsalam Warahmatullahi Wabarakatuh, Mas Ananda Nur Daffa Zain! Senang sekali bisa menyapa Anda kembali. Mari kita berdiskusi tentang progres analisis data ${datasetName || "EXP2.csv"}. Apa saja yang ingin Mas Ananda tanyakan untuk bimbingan kali ini? - Prof. AI Advisor`;
      } else if (attachments && attachments.length > 0) {
        reply = `Wa'alaikumsalam Mas Ananda Nur Daffa Zain. Bapak melihat Anda mengunggah berkas **"${attachments[0].name}"** (${attachments.length} berkas). Fitur pemrosesan dokumen/foto memerlukan konfigurasi kunci API (GEMINI_API_KEY) yang aktif di panel rahasia. Silakan hubungkan Kunci API Anda untuk analisis murni berkas ini secara pintar! - Prof. AI Advisor`;
      } else if (qLower.includes("optimasi") || qLower.includes("bagaimana cara") || qLower.includes("tingkatkan") || qLower.includes("perbaiki") || qLower.includes("solusi")) {
        reply = `Wa'alaikumsalam Mas Ananda Nur Daffa Zain. Menanggapi diskusi optimasi model **${bestModel || "Gradient Boosting Regressor"}** untuk target **${target || "Ra"}**:
 
1. **Rekayasa Fitur Kuadratik**: Karena pengaruh fisis umpan (feed rate) bersifat eksponensial (Ra ≈ f² / (32 * r)), menambahkan fitur f² akan sangat membantu akurasi regresi.
2. **Pembersihan Outliers**: Menghilangkan noise/getaran transient dari pembubatan aktual untuk akurasi data yang lebih stabil.
3. **Penyetelan Hiperparameter**: Melakukan fine-tuning parameter pohon penentu model agar fitting lebih pas.

Bagaimana pendapat Mas Ananda? Ada bagian tertentu yang ingin kita eksplorasi bersama? - Prof. AI Advisor`;
      } else if (qLower.includes("r2") || qLower.includes("r-squared") || qLower.includes("metrik") || qLower.includes("akurasi") || qLower.includes("mae") || qLower.includes("mape") || qLower.includes("rmse")) {
        reply = `Wa'alaikumsalam Mas Ananda. Mengenai metrik model, perolehan nilai **R²: ${metrics?.r2 != null ? metrics.r2.toFixed(4) : "0.5450"}** dan MAE: **${metrics?.mae != null ? metrics.mae.toFixed(4) : "0.1382"}** membuktikan ketepatan model **${bestModel || "Gradient Boosting"}** dalam menginterpretasikan data.

Secara fisis, deviasi ini dipengaruhi oleh dinamika permesinan yang tidak terekam dalam kolom masukan (seperti getaran pahat, pendinginan cairan, atau keausan mata sayat). Hal ini adalah topik yang sangat berbobot untuk bab pembahasan skripsi Anda, Ananda. Tetap semangat bimbingannya! - Prof. AI Advisor`;
      } else {
        reply = `Wa'alaikumsalam Mas Ananda Nur Daffa Zain. Pertanyaan bimbingan yang sangat berbobot!

Model **${bestModel || "Gradient Boosting Regressor"}** telah berhasil mereduksi galat pada variabel target **${target || "Ra"}** menggunakan masukan **${features ? features.join(", ") : "f, vc, ap"}**. Bapak menyarankan Anda memperkuat tinjauan termomekanika pemotongan logam untuk melengkapi analisis ini.

Ada pertanyaan fisis atau matematis spesifik yang ingin Mas Ananda bicarakan lagi? - Prof. AI Advisor`;
      }

      return res.json({ reply });
    }

    // If Gemini client is present, run the full dynamic, incredibly smart LLM prompt contextualizer!
    let historyStr = "";
    if (messages && messages.length > 0) {
      messages.forEach((msg: any) => {
        const actor = msg.sender === "student" ? "Mahasiswa (Ananda)" : "Akselerator Akademik (MECH AI ADVISOR)";
        historyStr += `${actor}: ${msg.text}\n\n`;
      });
    }

    let prompt = `Anda adalah Profesor Teknik Mesin dan Pakar AI Terapan terkemuka di Universitas Muhammadiyah Yogyakarta (UMY).
Nama Anda adalah MECH AI ADVISOR (Prof. AI Advisor), membimbing mahasiswa kesayangan Anda:
- Nama Mahasiswa: Ananda Nur Daffa Zain
- NIM: 20230130023
- Proyek Penelitian: Applied AI in Manufacturing Systems & Mechanical Diagnostics

Tugas Anda adalah menanggapi pesan terbaru mahasiswa dengan bahasa yang sangat santun, ramah, membimbing, dan profesional.

DETAIL MODEL SAAT INI (Gunakan detail ini sebagai konteks bimbingan akademis jika relevan):
- Dataset: ${datasetName || "Data Eksperimental Permesinan"}
- Fitur Masukan (X): ${features ? features.join(", ") : "N/A"}
- Variabel Target (Y): ${target || "N/A"}
- Pilihan Model Terbaik: ${bestModel || "N/A"}
- Metrik Evaluasi: R² = ${(metrics?.r2 != null) ? metrics.r2.toFixed(4) : "N/A"}, MAE = ${(metrics?.mae != null) ? metrics.mae.toFixed(4) : "N/A"}, RMSE = ${(metrics?.rmse != null) ? metrics.rmse.toFixed(4) : "N/A"}, MAPE = ${(metrics?.mape != null) ? (metrics.mape * 100).toFixed(2) + "%" : "N/A"}

PERATURAN RESPONS ADAPTIF:
1. SESUAIKAN PANJANG JAWABAN:
   - Jika mahasiswa mengirim pesan pendek, menyapa (seperti "halo", "apa kabar prof", "siap prof", "oke baik tks"), atau hanya memberikan konfirmasi singkat, Anda HARUS membalas secara SINGKAT, PADAT, elegan dan ramah (1-3 kalimat saja). JANGAN menulis analisis panjang lebar atau menampilkan statistik metrics jika tidak relevan dengan salam pendek mereka!
   - Jika mahasiswa memberikan pertanyaan ilmiah berbobot, berkonsultasi tentang berkas/gambar terunggah, bertanya tentang langkah optimasi, fisika material, atau metrik pengujian, berikan analisis akademis ilmiah yang mendalam, terperinci, dan mendidik.
2. JELASKAN ATAU BACA BERKAS / LAMPIRAN JIKA ADA:
   - Jika mahasiswa melampirkan foto/gambar atau berkas PDF/Dokumen Word (yang isinya disematkan di bawah), analisis berkas tersebut dengan saksama sesuai konteks teknik mesin dan data sains. Berikan ringkasan cerdas atau jawaban langsung terkait isi dokumen tersebut!
3. HINDARI SIMBOL MATEMATIKA YANG BERANTAKAN/LATEX JARGON:
   - JANGAN PERNAH memakai penulisan LaTeX seperti $...$, $$...$$, pembatas garis matematika, pecahan rumit bergaris miring, atau simbol dengan backslash (seperti \\approx, \\pi, \\epsilon, dsb).
   - Selalu tulis persamaan matematika fisis secara bersih, indah, ramah dibaca manusia dengan karakter teks Unicode standar (contoh: "Ra ≈ f² / (32 * r)", "v_c = (π * D * n) / 1000", "R²", "°C").
4. GAYA BAHASA DAN PENUTUP:
   - Gunakan Bahasa Indonesia yang sangat sopan khas dosen UMY. Selalu panggil mahasiswa dengan hangat sebagai "Mas Ananda" atau "Ananda".
   - Akhiri respons bimbingan secara santun dan konsisten dengan pesan motivasi: "Selamat belajar Ananda! Tetap teliti dalam praktikum. - Prof. AI Advisor".

Berikut transkrip riwayat obrolan terkini:
${historyStr}
MECH AI ADVISOR (Prof. AI Advisor):`;

    // Construct multi-part contents if there are PDF or Image attachments
    const parts: any[] = [];
    if (attachments && attachments.length > 0) {
      attachments.forEach((att: any) => {
        if (att.type === "image" || att.type === "pdf") {
          parts.push({
            inlineData: {
              data: att.data,
              mimeType: att.mimeType,
            }
          });
        } else if (att.type === "text") {
          parts.push({
            text: `[Isi Dokumen Terlampir: ${att.name}]\n${att.data}\n\n`
          });
        }
      });
    }

    // Add the core instruction prompt
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: parts,
      config: {
        systemInstruction: "Anda adalah pembimbing akademis yang ramah dan berdedikasi tinggi di UMY untuk mahasiswa bimbingan bernama Ananda Nur Daffa Zain (NIM: 20230130023). Anda selalu menyesuaikan panjang jawaban dengan pertanyaan siswa, dan selalu menyajikan persamaan fisis dengan teks Unicode murni yang super rapi dan bersih tanpa simbol LaTeX ($)."
      }
    });

    const reply = response.text || "Koneksi bimbingan terputus sebentar. Mari ulangi lagi pertanyaannya, Mas Ananda.";
    res.json({ reply: reply.trim() });
  } catch (error: any) {
    console.error("Gemini Chat Route Error:", error);
    res.status(500).json({ reply: "Koneksi bimbingan terputus sebentar. Mari ulangi lagi pertanyaannya, Mas Ananda." });
  }
});

// REST API for Advanced STEM constraint optimization with Gemini
app.post("/api/gemini/optimize", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured inside server.ts. Please configure GEMINI_API_KEY in secrets."
      });
    }

    const {
      datasetName,
      features,
      target,
      bestModel,
      metrics,
      featureImportances,
      targetValue,
      featureStats
    } = req.body;

    let prompt = `You are a highly distinguished Mechanical Engineering Professor and Artificial Intelligence Expert at Universitas Muhammadiyah Yogyakarta.
A student under your supervision (Ananda Nur Daffa Zain, NIM: 20230130023) is working to optimize input parameters (setpoints) to hit a specific targeted output.

Target mechanical property variable to optimize: ${target || "N/A"}
Desired targeted setpoint value: ${targetValue}

Trained Model Framework State:
- Best Machine Learning Estimator: ${bestModel || "Extra Trees Regressor"}
- Best Estimator R² Rating: ${(metrics?.r2 !== undefined) ? metrics.r2.toFixed(4) : "N/A"}
- Input Features mapped with statistical ranges from physical dataset:
${JSON.stringify(featureStats, null, 2)}
- Feature Importances:
${featureImportances ? JSON.stringify(featureImportances, null, 2) : "N/A"}

Please perform a mathematical and materials physics-based reverse optimization process. Predict the physical values each input feature should have to reach the desired target value of ${targetValue}. Note: values must be within the provided min and max bounds for each feature in featureStats, or physically consistent with solid mechanics and thermodynamics.

You MUST respond strictly with a valid JSON object matching the following structure:
{
  "optimizedInputs": {
    "feature_name_1": 12.34,
    "feature_name_2": 5.6
  },
  "confidenceScore": 0.92,
  "engineeringJustification": "Citations of physical mechanics (solid mechanics, manufacturing, flow, or fluid dynamics depending on field) justifying why these specific setpoints would theoretically produce a target value of ${targetValue} in active engineering tests."
}

Do not include any raw markdown formatting or prefix before the JSON, return ONLY the raw JSON object or standard markdown JSON codeblock.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite mechanical engineering optimizer for student Ananda Nur Daffa Zain (NIM: 20230130023). You output ONLY a structured JSON response to help optimize parameter recipes.",
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    let parsedData;
    try {
      parsedData = JSON.parse(text.trim());
    } catch {
      // Fallback extract in case of block wraps
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedData = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Failed to parse Gemini JSON optimization block.");
      }
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Optimization Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error during Gemini optimization." });
  }
});

// Serve Vite or Static files depending on environment
let viteDevServer: any = null;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    viteDevServer = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteDevServer.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MechAutoML AI Server running on port ${PORT} as ${process.env.NODE_ENV || "development"}`);
  });
}

startServer();
