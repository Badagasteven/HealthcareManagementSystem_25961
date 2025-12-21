// src/data/appEntities.js

// ✅ FULL Rwanda hospitals preload (available to all users)
export const hospitals = [
  // Kigali City
  { id: "H001", province: "Kigali City", district: "Nyarugenge", name: "CHUK (Univ. Teaching Hospital of Kigali)", category: "National Referral" },
  { id: "H002", province: "Kigali City", district: "Nyarugenge", name: "Muhima Hospital", category: "District (Maternity focus)" },
  { id: "H003", province: "Kigali City", district: "Nyarugenge", name: "Nyarugenge District Hospital", category: "District" },

  { id: "H004", province: "Kigali City", district: "Gasabo", name: "King Faisal Hospital", category: "National Referral" },
  { id: "H005", province: "Kigali City", district: "Gasabo", name: "Kibagabaga Hospital", category: "Level 2 Teaching" },
  { id: "H006", province: "Kigali City", district: "Gasabo", name: "Kacyiru Hospital", category: "District (Police Hospital)" },
  { id: "H007", province: "Kigali City", district: "Gasabo", name: "Ndera Neuropsychiatric Hospital", category: "Specialized Referral" },

  { id: "H008", province: "Kigali City", district: "Kicukiro", name: "Rwanda Military Hospital (Kanombe)", category: "National Referral" },
  { id: "H009", province: "Kigali City", district: "Kicukiro", name: "Masaka Hospital", category: "District" },

  // Eastern
  { id: "H010", province: "Eastern", district: "Rwamagana", name: "Rwamagana Hospital", category: "Provincial" },
  { id: "H011", province: "Eastern", district: "Bugesera", name: "Nyamata Hospital", category: "District" },
  { id: "H012", province: "Eastern", district: "Bugesera", name: "Rilima Orthopedic Hospital", category: "Specialized" },
  { id: "H013", province: "Eastern", district: "Gatsibo", name: "Kiziguro Hospital", category: "District" },
  { id: "H014", province: "Eastern", district: "Gatsibo", name: "Ngarama Hospital", category: "District" },
  { id: "H015", province: "Eastern", district: "Kayonza", name: "Gahini Hospital", category: "District" },
  { id: "H016", province: "Eastern", district: "Kayonza", name: "Rwinkwavu Hospital", category: "District" },
  { id: "H017", province: "Eastern", district: "Kirehe", name: "Kirehe Hospital", category: "District" },
  { id: "H018", province: "Eastern", district: "Ngoma", name: "Kibungo Hospital", category: "Provincial" },
  { id: "H019", province: "Eastern", district: "Nyagatare", name: "Nyagatare Hospital", category: "District" },
  { id: "H020", province: "Eastern", district: "Nyagatare", name: "Gatunda Hospital", category: "District" },

  // Northern
  { id: "H021", province: "Northern", district: "Gicumbi", name: "Byumba Hospital", category: "Provincial" },
  { id: "H022", province: "Northern", district: "Burera", name: "Butaro Hospital (Cancer Center)", category: "Level 2 Teaching" },
  { id: "H023", province: "Northern", district: "Gakenke", name: "Nemba Hospital", category: "District" },
  { id: "H024", province: "Northern", district: "Gakenke", name: "Ruli Hospital", category: "District" },
  { id: "H025", province: "Northern", district: "Gakenke", name: "Gatonde Hospital", category: "District" },
  { id: "H026", province: "Northern", district: "Musanze", name: "Ruhengeri Hospital", category: "Referral" },
  { id: "H027", province: "Northern", district: "Rulindo", name: "Kinihira Hospital", category: "Provincial" },
  { id: "H028", province: "Northern", district: "Rulindo", name: "Rutongo Hospital", category: "District" },

  // Southern
  { id: "H029", province: "Southern", district: "Nyanza", name: "Nyanza Hospital", category: "Provincial" },
  { id: "H030", province: "Southern", district: "Nyanza", name: "HVP Gatagara", category: "Specialized (Orthopedic)" },
  { id: "H031", province: "Southern", district: "Huye", name: "CHUB (Univ. Teaching Hospital of Butare)", category: "National Referral" },
  { id: "H032", province: "Southern", district: "Huye", name: "Kabutare Hospital", category: "District" },
  { id: "H033", province: "Southern", district: "Gisagara", name: "Gakoma Hospital", category: "District" },
  { id: "H034", province: "Southern", district: "Gisagara", name: "Kibilizi Hospital", category: "District" },
  { id: "H035", province: "Southern", district: "Kamonyi", name: "Remera-Rukoma Hospital", category: "District" },
  { id: "H036", province: "Southern", district: "Muhanga", name: "Kabgayi Hospital", category: "Level 2 Teaching" },
  { id: "H037", province: "Southern", district: "Muhanga", name: "Nyabikenke Hospital", category: "District" },
  { id: "H038", province: "Southern", district: "Nyamagabe", name: "Kigeme Hospital", category: "District" },
  { id: "H039", province: "Southern", district: "Nyamagabe", name: "Kaduha Hospital", category: "District" },
  { id: "H040", province: "Southern", district: "Nyaruguru", name: "Munini Hospital", category: "District" },
  { id: "H041", province: "Southern", district: "Ruhango", name: "Ruhango Hospital", category: "Provincial" },
  { id: "H042", province: "Southern", district: "Ruhango", name: "Gitwe Hospital", category: "District" },

  // Western
  { id: "H043", province: "Western", district: "Karongi", name: "Kibuye Hospital", category: "Referral" },
  { id: "H044", province: "Western", district: "Karongi", name: "Kirinda Hospital", category: "District" },
  { id: "H045", province: "Western", district: "Karongi", name: "Mugonero Hospital", category: "District" },
  { id: "H046", province: "Western", district: "Ngororero", name: "Kabaya Hospital", category: "District" },
  { id: "H047", province: "Western", district: "Ngororero", name: "Muhororo Hospital", category: "District" },
  { id: "H048", province: "Western", district: "Nyabihu", name: "Shyira Hospital", category: "District" },
  { id: "H049", province: "Western", district: "Nyamasheke", name: "Bushenge Hospital", category: "Provincial" },
  { id: "H050", province: "Western", district: "Nyamasheke", name: "Kibogora Hospital", category: "Level 2 Teaching" },
  { id: "H051", province: "Western", district: "Rubavu", name: "Gisenyi Hospital", category: "District" },
  { id: "H052", province: "Western", district: "Rusizi", name: "Gihundwe Hospital", category: "District" },
  { id: "H053", province: "Western", district: "Rusizi", name: "Mibilizi Hospital", category: "District" },
  { id: "H054", province: "Western", district: "Rutsiro", name: "Murunda Hospital", category: "District" },
];

// ✅ Services entity (fixes your error: Services.jsx imports `services`)
export const services = [
  { id: "S001", name: "General Consultation", category: "Consultation", priceRwf: 5000 },
  { id: "S002", name: "Pediatric Consultation", category: "Consultation", priceRwf: 7000 },
  { id: "S003", name: "Antenatal Care (ANC)", category: "Maternity", priceRwf: 3000 },
  { id: "S004", name: "Laboratory Tests (Basic)", category: "Laboratory", priceRwf: 8000 },
  { id: "S005", name: "X-Ray", category: "Imaging", priceRwf: 15000 },
  { id: "S006", name: "Ultrasound", category: "Imaging", priceRwf: 12000 },
  { id: "S007", name: "Vaccination", category: "Preventive", priceRwf: 2000 },
  { id: "S008", name: "Emergency Care", category: "Emergency", priceRwf: 10000 },
];

// Optional seed doctors (kept empty; your AppDataContext auto-seeds 2 per hospital if storage empty)
export const doctors = [];

// Basic seed locations (you can keep minimal)
export const locations = [
  { id: "L001", province: "Kigali City", district: "Gasabo", sector: "Kimironko", cell: "Bibare", village: "Bibare I" },
];
