import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "id";

interface LecturerComment {
  name: string;
  quote: string;
  src: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultEnglish?: string) => string;
  lecturerComments: LecturerComment[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Complete Translation Dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Tabs
    "nav.brand": "MECH AI ENGINEERING",
    "nav.campus": "TEKNIK MESIN UMY",
    "nav.home": "Home",
    "nav.ingress": "Ingest Data",
    "nav.features": "Feature Matrix",
    "nav.train": "AutoML Train",
    "nav.education": "AI Education",
    "nav.about": "About Project",
    "nav.dashboard": "Performance",
    "nav.analytics": "Analytics",
    "nav.predict": "Predict",
    "nav.history": "History",
    "nav.workflow": "Workflow",
    "nav.ethics": "Ethics",
    "nav.twin": "Digital Twin",

    // Action buttons & state
    "btn.load": "Load Workbook",
    "btn.train": "Train AutoML",
    "btn.learn": "Learn AI Lab",
    "btn.start_predict": "Start Prediction",
    "btn.upload_dataset": "Upload Dataset",
    "btn.view_workflow": "View ML Workflow",
    "btn.clear_history": "Clear History",
    "btn.delete": "Delete",

    // Hero Section
    "hero.badge": "MULTI-ALGORITHM AutoML MACHINE LEARNING SYSTEM",
    "hero.title_part1": "AI-POWERED",
    "hero.title_part2": "ENGINEERING PREDICTION",
    "hero.subtitle": "MECH AI ENGINEER is a web-based machine learning platform designed to support engineering data analysis and prediction. Upload datasets, select input features and target outputs, train AI models, compare model performance, visualize evaluation results, and generate engineering predictions quickly, accurately, and systematically.",
    "hero.chip_header": "ALGORITHM IMPLEMENTATION & COGNITION SPACES",

    // Robot Background Section
    "background.badge": "Program Studi Teknik Mesin UMY • Akreditasi Unggul",
    "background.title": "ACADEMIC BACKGROUND OF MECHANICAL ENGINEERING UMY",
    "background.subtitle": "Breaking engineering boundaries by synergizing traditional mechanics, industrial automation, and smart data processing based on Artificial Intelligence.",
    "background.tab_profile": "Profile Summary",
    "background.tab_lab": "Laboratories",
    "background.tab_research": "Research Areas",
    "background.profile_title": "Bridging Experimental Theory with Modern Computational Science",
    "background.mission_tag": "Core Mission",
    "background.mission_title": "International Standards Curriculum",
    "background.mission_desc": "Adapting parameters periodically to nurture superior graduates specializing in mechanical design, ecofriendly energy conversion, innovative materials, and industrial robotics.",
    "background.ai_tag": "Digital Integration",
    "background.ai_title": "Artificial Intelligence Synergies",
    "background.ai_desc": "Through elective courses and direct research, students build smart predictive models mapping material mechanical stress and mechanical rotational vibration diagnostics.",
    "background.quote_desc": "\"Mechanical Engineering undergraduate studies are fully supported by high-spec laboratories inside the green and modern UMY Engineering Faculty Complex.\"",
    "background.system_status": "DATA ENGINE STATE",
    "background.status_active": "● ACTIVE ONLINE",
    "background.g6_lab_title": "State-of-the-Art Labs in G6 Building UMY",
    "background.research_title": "Harmonizing Structural Engineering and High-Performance Computation",
    "background.campus_location": "UMY Integrated Campus, Yogyakarta",
    "background.dept_footer": "ENGINEERING DEPARTMENT INFRASTRUCTURE • FT-UMY",
    "background.department_vision": "The Mechanical Engineering Department at UMY is committed to producing professionals with international competency, entrepreneurial spirit founded on noble Islamic values, and robust mastery of industry 4.0 digitalization.",

    // About/Academic Section
    "academic.research_badge": "Academic Research Workspace",
    "academic.title": "Integrated Scientific & Academic Center",
    "academic.subtitle": "Officially verified specifications, methodology workflows, and technical ethics charters governing the Mechanical Informatics AutoML regression system. Toggle across segments below to inspect.",
    "about.tab1": "Academic Portfolio",
    "about.tab2": "SOP Workflow Matrix",
    "about.tab3": "Ethics Charter",
    "about.cert_researcher": "Certified Researcher",
    "about.sub_campus": "Supervising Campus",
    "about.course_dept": "Course / Department",
    "about.academic_focus": "Academic Focus",
    "about.active_nodes": "Verified Academic Nodes",
    "about.thesis_title": "Web App Berbasis Machine Learning untuk Analisis dan Prediksi Parameter Teknik Mesin",
    "about.thesis_subtitle": "Coursework Thesis | UMY Mechanical Informatics Study",
    "about.map_title": "SUPERVISING CAMPUS COORDINATE",
    "about.map_label": "Gedung G6 Teknik Mesin UMY",
    "about.directions": "Directions (G6 Building)",
    "about.contact_title": "DEVELOPER INTERACTIVE CONNECT",
    "about.contact_desc": "Connect directly with Daffa Zain for code validation, academic review, and engineering enquiries:",
    "about.institutional_nodes": "UNIVERSITAS MUHAMMADIYAH NODES",
    "about.umy_website": "Official UMY Website",
    "about.krs_portal": "Academic KRS Portal",

    // Faculty Notes Section
    "faculty.badge": "FACULTY NOTES",
    "faculty.title": "Academic Comments from Mechanical Engineering UMY",
    "faculty.subtitle": "Academic-style comments about Artificial Intelligence, Machine Learning, and engineering data prediction.",
    "lecturer.comment": "LECTURER COMMENT",
    "lecturer.num": "LECTURER",
    "lecturer.title_badge": "FACULTY AGENT",
    "lecturer.tip": "CLICK ANY CARD TO FOCUS ACADEMIC STATEMENT",
    "lecturer.status": "ACADEMIC ADVISORY BOARD",
    "lecturer.dismiss": "DISMISS SPECS",

    // Course branding
    "footer.course": "BASICS OF ARTIFICIAL INTELLIGENCE",
    "footer.institution": "UNIVERSITAS MUHAMMADIYAH YOGYAKARTA",
    "footer.creator": "ZAINPROJECT",

    // Sub Navigation buttons
    "subnav.ingest": "Spreadsheet Ingest",
    "subnav.settings": "Feature Selection Settings",
    "subnav.automl": "Core AutoML Training",
    "subnav.dashboard_title": "Performance Dashboard",
    "subnav.analytics_title": "High-Rigor Visual Analytics",

    // Labs names
    "lab.comp": "Computer & Graphic Expert Lab",
    "lab.comp_desc": "CAD/CAM/CAE simulations and machine design optimization powered by HPC and AI integration.",
    "lab.cnc": "CNC & Manufacturing Automation Lab",
    "lab.cnc_desc": "Provides precision hands-on with CNC lathes, high-speed milling, and automated toolpath programming.",
    "lab.energy": "Energy Conversion & Fundamental Phenom Lab",
    "lab.energy_desc": "Studies fluid dynamics, convective heat transfer, turbines, and thermal combustion engines.",
    "lab.material": "Engineering Materials & Metallurgy Lab",
    "lab.material_desc": "Focuses on metal hardness, tensile strength, microstructural metallography, and heat treatment.",

    // Research pillars
    "riset.title1": "Mechanical Informatics",
    "riset.text1": "Integration of Machine Learning optimization algorithms (Extra Trees, CatBoost, XGBoost) to predict CNC cutter tool wear coefficients, metal corrosion rate indexes, and fluid system thermal efficiencies.",
    "riset.title2": "Advanced Manufacturing",
    "riset.text2": "In-depth study of autonomous control mechanisms, high-speed metal cutting parameters optimization, and integration of digital twin interfaces to advance national machine fabrication.",
    "riset.title3": "Sustainable Materials",
    "riset.text3": "Design, dynamic fatigue testing, and characterization of local green composite layers for automotive components, aerospace structures, and eco-friendly biomedical implants.",
    
    // Core capabilities
    "cap.title": "Integrated Machine Learning Core Capabilities",
    "cap.desc": "Every analytical coordinate is mapped of physical measurement, attribute matrix dependency, selection boundaries, and metric loss residual.",

    // Alerts and Wizard Step 4 keys
    "alert.step_locked": "Step is locked. Please complete the previous steps sequentially first.",
    "alert.load_workbook": "Please load a mechanical engineering workbook spreadsheet before proceeding.",
    "alert.define_features": "Define predictor features (X) and target variable (Y) before proceeding.",
    "alert.select_model": "Select at least one machine learning model before compiling.",
    "btn.open_evaluation": "Open Evaluation Panel",
    "warning.title": "Pre-compiler Diagnostic Notification"
  },
  id: {
    // Nav & Tabs
    "nav.brand": "REKAYASA MECH AI",
    "nav.brand_sub": "TEKNIK MESIN UMY",
    "nav.campus": "TEKNIK MESIN UMY",
    "nav.home": "Beranda",
    "nav.ingress": "Unggah Data",
    "nav.features": "Matriks Fitur",
    "nav.train": "Latih AutoML",
    "nav.education": "Edukasi AI",
    "nav.about": "Tentang Proyek",
    "nav.dashboard": "Performa",
    "nav.analytics": "Analisis",
    "nav.predict": "Prediksi",
    "nav.history": "Riwayat",
    "nav.workflow": "Alur Kerja",
    "nav.ethics": "Etika",
    "nav.twin": "Digital Twin",

    // Action buttons & state
    "btn.load": "Muat Spreadsheet",
    "btn.train": "Latih AutoML",
    "btn.learn": "Lab Virtual AI",
    "btn.start_predict": "Mulai Prediksi",
    "btn.upload_dataset": "Unggah Dataset",
    "btn.view_workflow": "Lihat Alur Kerja",
    "btn.clear_history": "Hapus Riwayat",
    "btn.delete": "Hapus",

    // Hero Section
    "hero.badge": "SISTEM PEMBELAJARAN MESIN AutoML MULTI-ALGORITMA",
    "hero.title_part1": "PREDIKSI TEKNIK",
    "hero.title_part2": "BERBASIS KECERDASAN BUATAN",
    "hero.subtitle": "MECH AI ENGINEER adalah platform machine learning berbasis web yang dirancang untuk mendukung analisis data dan prediksi teknik secara mendalam. Unggah dataset Anda, tentukan fitur masukan dan target keluaran, latih model AI pembanding, evaluasi performa model, visualisasikan metrik akurasi, dan hasilkan prediksi teknik secara cepat, akurat, dan sistematis.",
    "hero.chip_header": "ALGORITMA & RUANG KOMPUTASI YANG DIIMPLEMENTASIKAN",

    // Robot Background Section
    "background.badge": "Program Studi Teknik Mesin UMY • Akreditasi Unggul",
    "background.title": "LATAR BELAKANG AKADEMIK TEKNIK MESIN UMY",
    "background.subtitle": "Menerobos batas rekayasa teknik dengan mensinergikan ilmu mekanika tradisional, otomasi manufaktur industri, dan pemrosesan data cerdas berbasis kecerdasan buatan (Artificial Intelligence).",
    "background.tab_profile": "Profil Ringkas",
    "background.tab_lab": "Laboratorium",
    "background.tab_research": "Bidang Riset",
    "background.profile_title": "Menghubungkan Teori Eksperimen dengan Sains Komputasi Modern",
    "background.mission_tag": "Misi Utama",
    "background.mission_title": "Kurikulum Berstandar Internasional",
    "background.mission_desc": "Mengadaptasi sains teknik secara berkala untuk menempa lulusan unggul dalam spesialisasi desain mekanis, konversi energi ramah lingkungan, komposit inovatif, dan robotika manufaktur.",
    "background.ai_tag": "Integrasi Digital",
    "background.ai_title": "Sinergi Kecerdasan Buatan",
    "background.ai_desc": "Melalui kurikulum khusus dan tugas akhir rekayasa, mahasiswa dipersiapkan merancang model prediktif cerdas yang memetakan tegangan fisik material dan deteksi kerusakan rotor mesin.",
    "background.quote_desc": "\"Studi S1 Teknik Mesin UMY didukung penuh oleh infrastruktur laboratorium berspesifikasi tinggi di dalam kompleks Fakultas Teknik UMY yang asri dan modern.\"",
    "background.system_status": "STATUS MESIN DATA",
    "background.status_active": "● AKTIF ONLINE",
    "background.g6_lab_title": "Fasilitas Laboratorium Modern Gedung G6 UMY",
    "background.research_title": "Sinergi Konstruksi Fisik Teknik dan Komputasi Berperforma Tinggi",
    "background.campus_location": "Sinduadi/Kampus Terpadu UMY, Yogyakarta",
    "background.dept_footer": "INFRASTRUKTUR TEKNIK JURUSAN MESIN • FT-UMY",
    "background.department_vision": "Prodi Teknik Mesin UMY bertekad menghasilkan profesional yang memiliki kompetensi internasional, berjiwa wirausaha berlandaskan nilai-nilai luhur keislaman, serta menguasai digitalisasi industri 4.0 secara kokoh.",

    // About/Academic Section
    "academic.research_badge": "Ruang Kerja Penelitian Akademis",
    "academic.title": "Pusat Akademis & Ilmiah Terpadu",
    "academic.subtitle": "Spesifikasi resmi terverifikasi, metodologi kerja, dan piagam etika teknis yang mengatur sistem regresi AutoML Informatika Mesin. Pilih segmen di bawah untuk memeriksa.",
    "about.tab1": "Portofolio Akademis",
    "about.tab2": "Matriks Alur Kerja SOP",
    "about.tab3": "Piagam Etika",
    "about.cert_researcher": "Peneliti Bersertifikat",
    "about.sub_campus": "Kampus Pembimbing",
    "about.course_dept": "Mata Kuliah / Jurusan",
    "about.academic_focus": "Fokus Akademis",
    "about.active_nodes": "Node Akademis Terverifikasi",
    "about.thesis_title": "Aplikasi Web Berbasis Pemelajaran Mesin untuk Analisis dan Prediksi Parameter Teknik Mesin",
    "about.thesis_subtitle": "SOP Tugas Akhir | Studi Informatika Mesin UMY",
    "about.map_title": "KOORDINAT KAMPUS PEMBIMBING",
    "about.map_label": "Gedung G6 Teknik Mesin UMY",
    "about.directions": "Petunjuk Arah (Gedung G6)",
    "about.contact_title": "HUBUNGI PENGEMBANG SECARA INTERAKTIF",
    "about.contact_desc": "Hubungi langsung Daffa Zain untuk validasi kode, tinjauan akademis, dan pertanyaan teknik:",
    "about.institutional_nodes": "NODE UNIVERSITAS MUHAMMADIYAH",
    "about.umy_website": "Situs Resmi UMY",
    "about.krs_portal": "Portal KRS Akademik",

    // Faculty Notes Section
    "faculty.badge": "CATATAN AKADEMIS",
    "faculty.title": "Komentar Akademis dari Dosen Teknik Mesin UMY",
    "faculty.subtitle": "Catatan teoretis dan praktis mengenai penerapan Kecerdasan Buatan (AI) serta pemodelan data rekayasa teknik.",
    "lecturer.comment": "KOMENTAR DOSEN",
    "lecturer.num": "DOSEN",
    "lecturer.title_badge": "AGEN FAKULTAS",
    "lecturer.tip": "KLIK KARTU DOSEN UNTUK MEMFOKUSKAN PERNYATAAN AKADEMIK",
    "lecturer.status": "DEWAN PENASIHAT AKADEMIK",
    "lecturer.dismiss": "TUTUP PERNYATAAN",

    // Course branding
    "footer.course": "BASICS OF ARTIFICIAL INTELLIGENCE",
    "footer.institution": "UNIVERSITAS MUHAMMADIYAH YOGYAKARTA",
    "footer.creator": "ZAINPROJECT",

    // Sub Navigation buttons
    "subnav.ingest": "Asupan Data Spreadsheet",
    "subnav.settings": "Pengaturan Seleksi Fitur",
    "subnav.automl": "Pelatihan AutoML Utama",
    "subnav.dashboard_title": "Dasbor Kinerja Model",
    "subnav.analytics_title": "Analitik Visual Presisi",

    // Labs names
    "lab.comp": "Laboratorium Komputer & Gambar Keahlian",
    "lab.comp_desc": "Simulasi CAD/CAM/CAE dan optimasi desain mesin berbasis HPC serta integrasi algoritma kecerdasan buatan.",
    "lab.cnc": "Laboratorium CNC & Otomasi Manufaktur",
    "lab.cnc_desc": "Praktikum presisi mesin bubut CNC, milling berkecepatan tinggi, dan pemrograman program perkakas otomatis.",
    "lab.energy": "Laboratorium Konvensi Energi & Fenomena Dasar",
    "lab.energy_desc": "Eksperimen dinamika fluida, perpindahan panas konvektif, turbin, pompa, dan kalibrasi motor bakar.",
    "lab.material": "Laboratorium Material Teknik & Metalurgi",
    "lab.material_desc": "Fokus pada pengujian kekerasan logam, kekuatan tarik, pemeriksaan metalografi, dan perlakuan panas.",

    // Research pillars
    "riset.title1": "Informatika Mekanika",
    "riset.text1": "Integrasi algoritma optimasi machine learning (Extra Trees, CatBoost, XGBoost) guna memprediksi keausan pahat potong CNC, laju korosi logam, dan efisiensi termal sistem energi.",
    "riset.title2": "Advanced Manufacturing",
    "riset.text2": "Riset mendalam otomasi kendali otonom perkakas, optimasi pemesinan cutting kecepatan tinggi, dan integrasi kembaran digital (digital twin) untuk menunjang manufaktur mesin nasional.",
    "riset.title3": "Material Berkelanjutan",
    "riset.text3": "Desain, pengujian kekuatan lelah dinamis, dan karakterisasi material komposit serat alam hayati lokal untuk komponen otomotif, struktur dirgantara, dan implan biomedis ramah lingkungan.",
    
    // Core capabilities
    "cap.title": "Kemampuan Utama Pemelajaran Mesin Terintegrasi",
    "cap.desc": "Setiap koordinat analitis dipetakan secara matematis berdasarkan pengukuran fisik nyata, dependensi matriks atribut, batasan model, dan galat residual.",

    // Alerts and Wizard Step 4 keys
    "alert.step_locked": "Langkah terkunci. Silakan selesaikan langkah sebelumnya secara berurutan terlebih dahulu.",
    "alert.load_workbook": "Silakan muat spreadsheet lembar kerja teknik mesin sebelum melanjutkan.",
    "alert.define_features": "Tentukan fitur prediktor (X) dan variabel target (Y) sebelum melanjutkan.",
    "alert.select_model": "Pilih minimal satu model machine learning sebelum melakukan kompilasi.",
    "btn.open_evaluation": "Buka Panel Evaluasi",
    "warning.title": "Notifikasi Diagnostik Pra-Kompilasi"
  }
};

const LECTURER_COMMENTS_DATA = {
  id: [
    {
      name: "Sunardi, S.T., M.Eng., Ph.D.",
      quote: "Platform ini dapat menjadi contoh penerapan AI yang relevan dengan kebutuhan teknik mesin, terutama dalam analisis data proses dan prediksi performa.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576541/Sunardi_S.T._M.Eng._Ph.D._jgkcn2.jpg"
    },
    {
      name: "Dr. Ir. Mudjijana, M.Eng.",
      quote: "MECH AI ENGINEER dapat menjadi media pembelajaran yang baik untuk memahami hubungan antara data eksperimen teknik dan pemodelan prediktif berbasis machine learning.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576541/Dr._Ir._Mudjijana_M.Eng._wpzgsv.jpg"
    },
    {
      name: "Ir. Berli Paripurna Kamiel, S.T., M.Eng.Sc., Ph.D.",
      quote: "Penggunaan machine learning dalam analisis data teknik menjadi semakin penting untuk membantu mahasiswa memahami pola data eksperimen secara lebih terukur.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Ir._Berli_Paripurna_Kamiel_S.T._M.Eng.Sc._Ph.D._xp1kr9.jpg"
    },
    {
      name: "Rela Adi Himarosa, S.T., M.Eng.",
      quote: "Sistem prediksi berbasis dataset seperti ini dapat melatih mahasiswa untuk memahami pentingnya kualitas data, pemilihan fitur, dan interpretasi hasil model.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Rela_Adi_Himarosa_S.T._M.Eng._whlj47.jpg"
    },
    {
      name: "Ir. Aris Widyo Nugroho, S.T., M.T., Ph.D.",
      quote: "Website ini dapat menjadi sarana eksplorasi data teknik yang baik karena menyediakan model pembanding dan visualisasi hasil prediksi.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Ir._Aris_Widyo_Nugroho_S.T._M.T._Ph.D._e4dh2w.jpg"
    },
    {
      name: "Prof. Dr. Ir. Sukamta, S.T., M.T., IPU., ASEAN Eng.",
      quote: "Integrasi AI dalam bidang teknik mesin perlu diarahkan sebagai alat bantu analisis, bukan pengganti validasi teori dan eksperimen.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Prof._Dr._Ir._Sukamta_S.T._M.T._IPU._ASEAN_Eng._uc8qxx.jpg"
    },
    {
      name: "Prof. Drs. Sudarisman, M.S. Mechs., Ph.D.",
      quote: "Pendekatan berbasis data seperti ini dapat membantu mahasiswa memahami hubungan antara variabel teknik dan hasil pengujian secara lebih sistematis.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Prof._Drs._Sudarisman_M.S._Mechs._Ph.D._z4ww9z.jpg"
    },
    {
      name: "Dr. Ir. Cahyo Budiyantoro, S.T., M.Sc., IPM.",
      quote: "Platform ini relevan untuk pembelajaran teknik karena menggabungkan proses komputasi, pemodelan, visualisasi, dan evaluasi performa model.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Cahyo_Budiyantoro_S.T._M.Sc._IPM._pop5wv.jpg"
    },
    {
      name: "Ir. Muh. Budi Nur Rahman, S.T., M.Eng.",
      quote: "Penggunaan dataset teknik dalam sistem ini dapat memperkuat pemahaman mahasiswa terhadap proses analisis, evaluasi, dan optimasi parameter.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Ir._Muh._Budi_Nur_Rahman_S.T._M.Eng._vplyv8.jpg"
    },
    {
      name: "Fitroh Anugrah Kusuma Yudha, S.T., M.Eng.",
      quote: "MECH AI ENGINEER memberikan pengalaman belajar yang praktis karena mahasiswa dapat mengunggah dataset sendiri dan langsung melihat performa model prediksi.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Fitroh_Anugrah_Kusuma_Yudha_S.T._M.Eng._bxuicg.jpg"
    },
    {
      name: "Dr. Ir. Novi Caroko, S.T., M.Eng., IPP.",
      quote: "MECH AI ENGINEER dapat menjadi contoh penerapan machine learning yang mendukung analisis data teknik secara lebih sistematis and terukur.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Novi_Caroko_S.T._M.Eng._IPP._lqscv6.jpg"
    },
    {
      name: "Dr. Ir. Bambang Riyanta, S.T., M.T.",
      quote: "Platform ini membantu mahasiswa memahami proses prediksi teknik secara praktis, mulai dari pengolahan data, pemilihan model, evaluasi performa, hingga interpretasi hasil.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Bambang_Riyanta_S.T._M.T._yemv5y.jpg"
    },
    {
      name: "Dr. Muhammad Nadjib, S.T., M.Eng.",
      quote: "Sistem ini membantu mahasiswa memahami bahwa prediksi teknik harus dilihat dari akurasi model, kualitas dataset, dan kesesuaian interpretasi engineering.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Muhammad_Nadjib_S.T._M.Eng._xac4v1.jpg"
    },
    {
      name: "Dr. Ir. Totok Suwanda, S.T., M.T.",
      quote: "Penerapan machine learning seperti ini dapat memperkaya pembelajaran teknik mesin karena mahasiswa dapat melakukan eksperimen model secara interaktif.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Totok_Suwanda_S.T._M.T._c314as.jpg"
    },
    {
      name: "Dr. Ir. Harini Sosiati, M.Eng.",
      quote: "MECH AI ENGINEER dapat membantu mahasiswa menghubungkan data material, proses pengujian, dan hasil eksperimen melalui pendekatan prediktif.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Harini_Sosiati_M.Eng._ej7wtd.jpg"
    },
    {
      name: "Dr. Ir. Sudarja, S.T., M.T., IPM., ASEAN Eng.",
      quote: "Prediksi berbasis AI tetap perlu disertai pemahaman engineering judgment agar hasil model dapat dianalisis secara kritis dan bertanggung jawab.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Sudarja_S.T._M.T._IPM._ASEAN_Eng._z0yjsq.jpg"
    }
  ],
  en: [
    {
      name: "Sunardi, S.T., M.Eng., Ph.D.",
      quote: "This platform can serve as an example of AI applications relevant to mechanical engineering needs, particularly in process data analysis and performance prediction.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576541/Sunardi_S.T._M.Eng._Ph.D._jgkcn2.jpg"
    },
    {
      name: "Dr. Ir. Mudjijana, M.Eng.",
      quote: "MECH AI ENGINEER can be an excellent learning medium to understand the relationship between engineering experimental data and machine learning-based predictive modeling.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576541/Dr._Ir._Mudjijana_M.Eng._wpzgsv.jpg"
    },
    {
      name: "Ir. Berli Paripurna Kamiel, S.T., M.Eng.Sc., Ph.D.",
      quote: "The use of machine learning in engineering data analysis is increasingly crucial to help students comprehend patterns in experimental data more measurably.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Ir._Berli_Paripurna_Kamiel_S.T._M.Eng.Sc._Ph.D._xp1kr9.jpg"
    },
    {
      name: "Rela Adi Himarosa, S.T., M.Eng.",
      quote: "This dataset-powered prediction system can educate students to understand the importance of data quality, feature selection, and model result interpretation.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Rela_Adi_Himarosa_S.T._M.Eng._whlj47.jpg"
    },
    {
      name: "Ir. Aris Widyo Nugroho, S.T., M.T., Ph.D.",
      quote: "This website serves as an excellent technical data exploration tool as it provides comparison models and visualization of prediction results.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Ir._Aris_Widyo_Nugroho_S.T._M.T._Ph.D._e4dh2w.jpg"
    },
    {
      name: "Prof. Dr. Ir. Sukamta, S.T., M.T., IPU., ASEAN Eng.",
      quote: "The integration of AI in mechanical engineering must be directed as an analytical assistant tool, rather than a replacement for theoretical and experimental validation.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Prof._Dr._Ir._Sukamta_S.T._M.T._IPU._ASEAN_Eng._uc8qxx.jpg"
    },
    {
      name: "Prof. Drs. Sudarisman, M.S. Mechs., Ph.D.",
      quote: "Such a data-driven approach can help students systematically understand the correlations between engineering variables and testing outputs.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576543/Prof._Drs._Sudarisman_M.S._Mechs._Ph.D._z4ww9z.jpg"
    },
    {
      name: "Dr. Ir. Cahyo Budiyantoro, S.T., M.Sc., IPM.",
      quote: "This platform is highly relevant for engineering education as it combines computation, modeling, visualization, and model performance evaluation processes.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Cahyo_Budiyantoro_S.T._M.Sc._IPM._pop5wv.jpg"
    },
    {
      name: "Ir. Muh. Budi Nur Rahman, S.T., M.Eng.",
      quote: "Using engineering datasets in this system can reinforce student understanding of process analysis, evaluation, and parameter optimization.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Ir._Muh._Budi_Nur_Rahman_S.T._M.Eng._vplyv8.jpg"
    },
    {
      name: "Fitroh Anugrah Kusuma Yudha, S.T., M.Eng.",
      quote: "MECH AI ENGINEER delivers a hands-on learning experience where students can upload their own datasets and instantly view prediction model performance.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Fitroh_Anugrah_Kusuma_Yudha_S.T._M.Eng._bxuicg.jpg"
    },
    {
      name: "Dr. Ir. Novi Caroko, S.T., M.Eng., IPP.",
      quote: "MECH AI ENGINEER serves as a stellar example of machine learning implementation that supports engineering data analysis in a systematic and measurable manner.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Novi_Caroko_S.T._M.Eng._IPP._lqscv6.jpg"
    },
    {
      name: "Dr. Ir. Bambang Riyanta, S.T., M.T.",
      quote: "This platform assists students in practically understanding engineering prediction, from data preprocessing, model selection, and performance evaluation, to translation of results.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Bambang_Riyanta_S.T._M.T._yemv5y.jpg"
    },
    {
      name: "Dr. Muhammad Nadjib, S.T., M.Eng.",
      quote: "This system helps students understand that engineering predictions must be evaluated through model accuracy, dataset quality, and engineering interpretation alignment.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Muhammad_Nadjib_S.T._M.Eng._xac4v1.jpg"
    },
    {
      name: "Dr. Ir. Totok Suwanda, S.T., M.T.",
      quote: "This kind of machine learning integration can enrich mechanical engineering education by enabling students to perform interactive experiments on models.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Totok_Suwanda_S.T._M.T._c314as.jpg"
    },
    {
      name: "Dr. Ir. Harini Sosiati, M.Eng.",
      quote: "MECH AI ENGINEER helps students connect materials data, testing procedures, and experimental findings using a predictive paradigm.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Harini_Sosiati_M.Eng._ej7wtd.jpg"
    },
    {
      name: "Dr. Ir. Sudarja, S.T., M.T., IPM., ASEAN Eng.",
      quote: "AI-powered predictions must be accompanied by robust engineering judgment to ensure model outcomes are analyzed critically and responsibly.",
      src: "https://res.cloudinary.com/df0razmlr/image/upload/v1781576542/Dr._Ir._Sudarja_S.T._M.T._IPM._ASEAN_Eng._z0yjsq.jpg"
    }
  ]
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem("mechautoml_language");
      if (stored === "en" || stored === "id") return stored;
    } catch (e) {}
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("mechautoml_language", lang);
    } catch (e) {}
  };

  const t = (key: string, defaultEnglish?: string): string => {
    const translation = translations[language]?.[key];
    if (translation) return translation;
    
    // Fallback logic
    if (language === "en") {
      return defaultEnglish || key;
    } else {
      // Find translated key or map logically if missing in explicit dict
      const idStr = translations["id"]?.[key];
      if (idStr) return idStr;
      return defaultEnglish || key;
    }
  };

  const lecturerComments = LECTURER_COMMENTS_DATA[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, lecturerComments }}>
      {children}
    </LanguageContext.Provider>
  );
};
