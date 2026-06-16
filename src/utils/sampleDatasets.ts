export interface SampleDatasetEntry {
  name: string;
  description: string;
  targetCol: string;
  inputCols: string[];
  rows: any[];
}

export const sampleDatasets: SampleDatasetEntry[] = [
  {
    name: "CNC Milling Machine Tool Wear.csv",
    description: "Predicts machining tool wear depth in micrometers based on active cutting speeds, feed rates, structural cutting depths, and operational tool ages.",
    targetCol: "tool_wear_micrometers",
    inputCols: ["spindle_speed_rpm", "feed_rate_mmpmin", "depth_of_cut_mm", "tool_age_min"],
    rows: [
      { spindle_speed_rpm: 1200, feed_rate_mmpmin: 80, depth_of_cut_mm: 1.5, tool_age_min: 10, tool_wear_micrometers: 22.4 },
      { spindle_speed_rpm: 1250, feed_rate_mmpmin: 85, depth_of_cut_mm: 1.5, tool_age_min: 20, tool_wear_micrometers: 31.8 },
      { spindle_speed_rpm: 1300, feed_rate_mmpmin: 90, depth_of_cut_mm: 1.5, tool_age_min: 30, tool_wear_micrometers: 45.2 },
      { spindle_speed_rpm: 1400, feed_rate_mmpmin: 100, depth_of_cut_mm: 1.2, tool_age_min: 40, tool_wear_micrometers: 55.1 },
      { spindle_speed_rpm: 1500, feed_rate_mmpmin: 110, depth_of_cut_mm: 1.0, tool_age_min: 50, tool_wear_micrometers: 62.3 },
      { spindle_speed_rpm: 1100, feed_rate_mmpmin: 75, depth_of_cut_mm: 2.0, tool_age_min: 5, tool_wear_micrometers: 18.5 },
      { spindle_speed_rpm: 1200, feed_rate_mmpmin: 80, depth_of_cut_mm: 1.8, tool_age_min: 25, tool_wear_micrometers: 38.2 },
      { spindle_speed_rpm: 1350, feed_rate_mmpmin: 95, depth_of_cut_mm: 1.2, tool_age_min: 35, tool_wear_micrometers: 49.3 },
      { spindle_speed_rpm: 1450, feed_rate_mmpmin: 105, depth_of_cut_mm: 1.0, tool_age_min: 45, tool_wear_micrometers: 58.7 },
      { spindle_speed_rpm: 1600, feed_rate_mmpmin: 120, depth_of_cut_mm: 0.8, tool_age_min: 60, tool_wear_micrometers: 74.2 },
      { spindle_speed_rpm: 1050, feed_rate_mmpmin: 70, depth_of_cut_mm: 2.2, tool_age_min: 15, tool_wear_micrometers: 29.1 },
      { spindle_speed_rpm: 1220, feed_rate_mmpmin: 82, depth_of_cut_mm: 1.5, tool_age_min: 28, tool_wear_micrometers: 41.5 },
      { spindle_speed_rpm: 1280, feed_rate_mmpmin: 88, depth_of_cut_mm: 1.6, tool_age_min: 32, tool_wear_micrometers: 47.9 },
      { spindle_speed_rpm: 1380, feed_rate_mmpmin: 98, depth_of_cut_mm: 1.1, tool_age_min: 42, tool_wear_micrometers: 56.4 },
      { spindle_speed_rpm: 1480, feed_rate_mmpmin: 108, depth_of_cut_mm: 0.9, tool_age_min: 48, tool_wear_micrometers: 61.2 },
      { spindle_speed_rpm: 1150, feed_rate_mmpmin: 78, depth_of_cut_mm: 2.0, tool_age_min: 12, tool_wear_micrometers: 25.6 },
      { spindle_speed_rpm: 1210, feed_rate_mmpmin: 81, depth_of_cut_mm: 1.7, tool_age_min: 22, tool_wear_micrometers: 34.1 },
      { spindle_speed_rpm: 1320, feed_rate_mmpmin: 92, depth_of_cut_mm: 1.4, tool_age_min: 38, tool_wear_micrometers: 52.8 },
      { spindle_speed_rpm: 1420, feed_rate_mmpmin: 102, depth_of_cut_mm: 1.1, tool_age_min: 52, tool_wear_micrometers: 66.5 },
      { spindle_speed_rpm: 1550, feed_rate_mmpmin: 115, depth_of_cut_mm: 0.7, tool_age_min: 58, tool_wear_micrometers: 70.9 },
      { spindle_speed_rpm: 1180, feed_rate_mmpmin: 79, depth_of_cut_mm: 1.5, tool_age_min: 8, tool_wear_micrometers: 19.9 },
      { spindle_speed_rpm: 1270, feed_rate_mmpmin: 87, depth_of_cut_mm: 1.5, tool_age_min: 18, tool_wear_micrometers: 29.4 },
      { spindle_speed_rpm: 1310, feed_rate_mmpmin: 91, depth_of_cut_mm: 1.5, tool_age_min: 26, tool_wear_micrometers: 39.1 },
      { spindle_speed_rpm: 1390, feed_rate_mmpmin: 99, depth_of_cut_mm: 1.3, tool_age_min: 36, tool_wear_micrometers: 50.4 },
      { spindle_speed_rpm: 1490, feed_rate_mmpmin: 109, depth_of_cut_mm: 0.9, tool_age_min: 46, tool_wear_micrometers: 59.9 },
      { spindle_speed_rpm: 1120, feed_rate_mmpmin: 76, depth_of_cut_mm: 2.1, tool_age_min: 11, tool_wear_micrometers: 26.8 },
      { spindle_speed_rpm: 1240, feed_rate_mmpmin: 84, depth_of_cut_mm: 1.6, tool_age_min: 21, tool_wear_micrometers: 33.2 },
      { spindle_speed_rpm: 1340, feed_rate_mmpmin: 94, depth_of_cut_mm: 1.3, tool_age_min: 31, tool_wear_micrometers: 46.5 },
      { spindle_speed_rpm: 1440, feed_rate_mmpmin: 104, depth_of_cut_mm: 1.0, tool_age_min: 41, tool_wear_micrometers: 54.3 },
      { spindle_speed_rpm: 1520, feed_rate_mmpmin: 112, depth_of_cut_mm: 0.8, tool_age_min: 51, tool_wear_micrometers: 63.8 }
    ]
  },
  {
    name: "Steel Heat Treatment Hardness.csv",
    description: "Determines final steel Rockwell Hardness (HRC) modeled as a regression function of chemical Carbon percentages, quenching cooling speeds, austenitizing soak temperatures, and final temper temperatures.",
    targetCol: "rockwell_hardness_hrc",
    inputCols: ["carbon_percent", "cooling_rate_cps", "austenitizing_temp_c", "tempering_temp_c"],
    rows: [
      { carbon_percent: 0.35, cooling_rate_cps: 50, austenitizing_temp_c: 840, tempering_temp_c: 200, rockwell_hardness_hrc: 52.3 },
      { carbon_percent: 0.35, cooling_rate_cps: 50, austenitizing_temp_c: 840, tempering_temp_c: 350, rockwell_hardness_hrc: 45.1 },
      { carbon_percent: 0.35, cooling_rate_cps: 50, austenitizing_temp_c: 840, tempering_temp_c: 500, rockwell_hardness_hrc: 36.4 },
      { carbon_percent: 0.45, cooling_rate_cps: 60, austenitizing_temp_c: 850, tempering_temp_c: 200, rockwell_hardness_hrc: 58.2 },
      { carbon_percent: 0.45, cooling_rate_cps: 60, austenitizing_temp_c: 850, tempering_temp_c: 350, rockwell_hardness_hrc: 51.5 },
      { carbon_percent: 0.45, cooling_rate_cps: 60, austenitizing_temp_c: 850, tempering_temp_c: 500, rockwell_hardness_hrc: 41.9 },
      { carbon_percent: 0.55, cooling_rate_cps: 70, austenitizing_temp_c: 860, tempering_temp_c: 200, rockwell_hardness_hrc: 63.0 },
      { carbon_percent: 0.55, cooling_rate_cps: 70, austenitizing_temp_c: 860, tempering_temp_c: 350, rockwell_hardness_hrc: 55.4 },
      { carbon_percent: 0.55, cooling_rate_cps: 70, austenitizing_temp_c: 860, tempering_temp_c: 500, rockwell_hardness_hrc: 43.8 },
      { carbon_percent: 0.30, cooling_rate_cps: 40, austenitizing_temp_c: 830, tempering_temp_c: 200, rockwell_hardness_hrc: 48.5 },
      { carbon_percent: 0.30, cooling_rate_cps: 40, austenitizing_temp_c: 830, tempering_temp_c: 400, rockwell_hardness_hrc: 39.2 },
      { carbon_percent: 0.50, cooling_rate_cps: 65, austenitizing_temp_c: 855, tempering_temp_c: 220, rockwell_hardness_hrc: 59.8 },
      { carbon_percent: 0.50, cooling_rate_cps: 65, austenitizing_temp_c: 855, tempering_temp_c: 380, rockwell_hardness_hrc: 50.1 },
      { carbon_percent: 0.50, cooling_rate_cps: 65, austenitizing_temp_c: 855, tempering_temp_c: 480, rockwell_hardness_hrc: 44.5 },
      { carbon_percent: 0.40, cooling_rate_cps: 55, austenitizing_temp_c: 845, tempering_temp_c: 250, rockwell_hardness_hrc: 53.6 },
      { carbon_percent: 0.40, cooling_rate_cps: 55, austenitizing_temp_c: 845, tempering_temp_c: 420, rockwell_hardness_hrc: 43.1 },
      { carbon_percent: 0.60, cooling_rate_cps: 80, austenitizing_temp_c: 870, tempering_temp_c: 200, rockwell_hardness_hrc: 65.4 },
      { carbon_percent: 0.60, cooling_rate_cps: 80, austenitizing_temp_c: 870, tempering_temp_c: 350, rockwell_hardness_hrc: 57.9 },
      { carbon_percent: 0.60, cooling_rate_cps: 80, austenitizing_temp_c: 870, tempering_temp_c: 550, rockwell_hardness_hrc: 45.2 },
      { carbon_percent: 0.38, cooling_rate_cps: 48, austenitizing_temp_c: 840, tempering_temp_c: 180, rockwell_hardness_hrc: 54.0 },
      { carbon_percent: 0.38, cooling_rate_cps: 48, austenitizing_temp_c: 840, tempering_temp_c: 320, rockwell_hardness_hrc: 47.3 },
      { carbon_percent: 0.38, cooling_rate_cps: 48, austenitizing_temp_c: 840, tempering_temp_c: 480, rockwell_hardness_hrc: 39.8 },
      { carbon_percent: 0.48, cooling_rate_cps: 62, austenitizing_temp_c: 850, tempering_temp_c: 200, rockwell_hardness_hrc: 59.2 },
      { carbon_percent: 0.48, cooling_rate_cps: 62, austenitizing_temp_c: 850, tempering_temp_c: 340, rockwell_hardness_hrc: 52.7 },
      { carbon_percent: 0.48, cooling_rate_cps: 62, austenitizing_temp_c: 850, tempering_temp_c: 490, rockwell_hardness_hrc: 43.6 },
      { carbon_percent: 0.52, cooling_rate_cps: 68, austenitizing_temp_c: 860, tempering_temp_c: 210, rockwell_hardness_hrc: 61.1 },
      { carbon_percent: 0.52, cooling_rate_cps: 68, austenitizing_temp_c: 860, tempering_temp_c: 360, rockwell_hardness_hrc: 54.0 },
      { carbon_percent: 0.52, cooling_rate_cps: 68, austenitizing_temp_c: 860, tempering_temp_c: 510, rockwell_hardness_hrc: 43.1 },
      { carbon_percent: 0.42, cooling_rate_cps: 58, austenitizing_temp_c: 848, tempering_temp_c: 220, rockwell_hardness_hrc: 55.9 },
      { carbon_percent: 0.42, cooling_rate_cps: 58, austenitizing_temp_c: 848, tempering_temp_c: 430, rockwell_hardness_hrc: 43.9 }
    ]
  }
];
