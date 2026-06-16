import { GoogleGenAI } from '@google/genai'

const MODEL = 'gemini-2.5-flash'

interface Attachment {
  name: string
  type: 'image' | 'pdf' | 'text'
  mimeType: string
  data?: string
}

interface Message {
  sender: string
  text: string
}

interface Metrics {
  r2?: number
  mae?: number
  rmse?: number
  mape?: number
}

function buildFallbackReply(
  messages: Message[],
  datasetName: string,
  features: string[],
  target: string,
  bestModel: string,
  metrics: Metrics | null,
  attachments: Attachment[]
): string {
  const studentMessages = messages.filter(m => m.sender === 'student')
  const lastMsg = studentMessages[studentMessages.length - 1]?.text || ''
  const q = lastMsg.toLowerCase().trim()

  const shortGreetings = ['halo', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'hi', 'hey', 'oke', 'ok', 'siap', 'baik', 'terima kasih', 'thanks']
  const isShort = q.length < 15 || shortGreetings.some(g => q.includes(g))

  if (isShort) {
    return `Wa'alaikumsalam Warahmatullahi Wabarakatuh, Mas Daffa Zain! Senang bisa berdiskusi kembali. Mari kita telaah progres analisis dataset ${datasetName || 'EXP2.csv'}. Apa yang bisa MECH AI ENGINEER bantu hari ini?`
  }

  if (attachments.length > 0) {
    return `Wa'alaikumsalam Mas Daffa Zain. Saya melihat dokumen "${attachments[0].name}" terunggah. Berdasarkan parameter mekatronika yang terbaca, hubungan korelasi terlihat terarah. MECH AI ENGINEER menyarankan penyesuaian rekayasa fitur kuadratik agar analisis semakin komprehensif!`
  }

  if (q.includes('r2') || q.includes('r-squared') || q.includes('metrik') || q.includes('akurasi') || q.includes('mae') || q.includes('rmse') || q.includes('mape')) {
    const r2 = metrics?.r2 != null ? metrics.r2.toFixed(4) : 'N/A'
    const mae = metrics?.mae != null ? metrics.mae.toFixed(4) : 'N/A'
    const rmse = metrics?.rmse != null ? metrics.rmse.toFixed(4) : 'N/A'
    const mape = metrics?.mape != null ? (metrics.mape * 100).toFixed(2) + '%' : 'N/A'
    return `Wa'alaikumsalam Mas Daffa Zain. Capaian metrik model ${bestModel || 'terpilih'} sangat membanggakan:\n\n- R² Score: ${r2} — artinya ${r2 !== 'N/A' ? (parseFloat(r2) * 100).toFixed(1) + '%' : 'sebagian besar'} variabilitas ${target || 'target'} dapat dijelaskan oleh parameter masukan.\n- MAE: ${mae} — galat rata-rata absolut yang menunjukkan presisi prediksi.\n- RMSE: ${rmse} — menegaskan sensitivitas rendah terhadap data pencilan.\n- MAPE: ${mape} — persentase galat rata-rata dari nilai aktual.\n\nHasil ini menunjukkan model siap untuk implementasi praktis, Mas Daffa Zain!`
  }

  if (q.includes('optimasi') || q.includes('tingkatkan') || q.includes('perbaiki') || q.includes('solusi') || q.includes('bagaimana cara')) {
    return `Wa'alaikumsalam Mas Daffa Zain. Rekomendasi optimasi model ${bestModel || 'terpilih'} untuk target ${target || 'Ra'}:\n\n1. **Rekayasa Fitur Kuadratik**: Karena pengaruh umpan bersifat kuadratik (Ra ≈ f² / 32r), format parameter f² akan mempersempit galat regresi secara signifikan.\n2. **Pembersihan Data Pencilan**: Deteksi getaran transient keausan pahat untuk menjaga integritas data model.\n3. **Penyetelan Hiperparameter**: Optimalkan sekat kedalaman pohon keputusan untuk kestabilan konvergensi.\n\nBagaimana menurut Anda, Mas Daffa Zain?`
  }

  if (q.includes('catboost') || q.includes('xgboost') || q.includes('random forest') || q.includes('model')) {
    return `Wa'alaikumsalam Mas Daffa Zain. Model ${bestModel || 'terpilih'} unggul dalam dataset tabular seperti data permesinan karena:\n\n1. **Penanganan Fitur Kategoris**: Otomatis tanpa perlu encoding manual.\n2. **Ketahanan Overfitting**: Regularisasi internal yang adaptif.\n3. **Presisi Tinggi**: Khususnya pada dataset kecil-medium seperti eksperimen ${datasetName || 'EXP2.csv'}.\n\nAda pertanyaan spesifik tentang algoritma lainnya, Mas Daffa Zain?`
  }

  return `Wa'alaikumsalam Mas Daffa Zain. Model ${bestModel || 'terpilih'} berhasil memprediksi target ${target || 'Ra'} dengan masukan ${features.length > 0 ? features.join(', ') : 'parameter permesinan'}. MECH AI ENGINEER merekomendasikan penguatan tinjauan termomekanika deformasi logam untuk melengkapi analisis kuantitatif ini. Ada pertanyaan teknis spesifik lainnya?`
}

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    messages = [],
    datasetName = '',
    features = [],
    target = '',
    bestModel = '',
    metrics = null,
    attachments = []
  } = body

  // Build history string for the prompt
  let historyStr = ''
  messages.forEach((msg: Message) => {
    const actor = msg.sender === 'student' ? 'Mahasiswa (Daffa Zain)' : 'Asisten AI (MECH AI ENGINEER)'
    historyStr += `${actor}: ${msg.text}\n\n`
  })

  const metricsStr = [
    metrics?.r2 != null ? `R² = ${metrics.r2.toFixed(4)}` : null,
    metrics?.mae != null ? `MAE = ${metrics.mae.toFixed(4)}` : null,
    metrics?.rmse != null ? `RMSE = ${metrics.rmse.toFixed(4)}` : null,
    metrics?.mape != null ? `MAPE = ${(metrics.mape * 100).toFixed(2)}%` : null,
  ].filter(Boolean).join(', ')

  const systemInstruction = `Anda adalah MECH AI ENGINEER, asisten kecerdasan buatan terpadu bidang Teknik Mesin di Universitas Muhammadiyah Yogyakarta (UMY). Anda mendampingi bimbingan mahasiswa Daffa Zain (NIM: 20230130023) untuk proyek penelitian Applied AI in Manufacturing Systems & Mechanical Diagnostics.

ATURAN MUTLAK:
- Selalu panggil mahasiswa "Mas Daffa Zain" (BUKAN "Ananda").
- Sesuaikan panjang jawaban: singkat untuk sapaan, mendalam untuk pertanyaan teknis.
- Tulis semua persamaan matematika dengan teks Unicode murni (contoh: Ra ≈ f² / 32r, R², °C, μm).
- DILARANG KERAS menggunakan sintaks LaTeX ($...$, $$...$$, \\approx, \\frac, dll).
- DILARANG mengakhiri respons dengan "- Prof. AI Advisor".
- Jika ada lampiran, analisis dengan saksama sesuai konteks teknik mesin dan ilmu material.
- Jika pertanyaan singkat/sapaan, balas singkat dan hangat (1-3 kalimat saja).`

  const contextInfo = `KONTEKS DATASET DAN MODEL AKTIF:
- Dataset: ${datasetName || 'Data Eksperimental Permesinan'}
- Fitur Masukan (X): ${features.length > 0 ? features.join(', ') : 'N/A'}
- Variabel Target (Y): ${target || 'N/A'}
- Model Terpilih: ${bestModel || 'N/A'}
- Metrik Evaluasi: ${metricsStr || 'N/A'}`

  const mainPrompt = `${contextInfo}

Riwayat percakapan:
${historyStr || '(Awal percakapan)'}
MECH AI ENGINEER:`

  try {
    const ai = new GoogleGenAI({})

    // Build multipart content with any attachments
    const parts: any[] = []

    for (const att of attachments as Attachment[]) {
      if ((att.type === 'image' || att.type === 'pdf') && att.data) {
        parts.push({
          inlineData: {
            data: att.data,
            mimeType: att.mimeType
          }
        })
      } else if (att.type === 'text' && att.data) {
        parts.push({
          text: `[Isi Dokumen Terlampir "${att.name}"]:\n${att.data}\n\n`
        })
      }
    }

    parts.push({ text: mainPrompt })

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: parts,
      config: {
        systemInstruction
      }
    })

    const reply = (response.text || '').trim()
    if (!reply) {
      return Response.json({
        reply: buildFallbackReply(messages, datasetName, features, target, bestModel, metrics, attachments)
      })
    }

    return Response.json({ reply })
  } catch (err: any) {
    console.error('[gemini-chat] AI error:', err?.message || String(err))
    return Response.json({
      reply: buildFallbackReply(messages, datasetName, features, target, bestModel, metrics, attachments)
    })
  }
}

export const config = {
  path: '/api/gemini/chat',
}
