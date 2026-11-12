// src/data/grants.ts
// Registro declarativo de convenios institucionales, becas y entidades mecenas (Institutional Grants)
// Sincronizable con Redis/PostgreSQL vía ce-svc-billing-access (InstitutionalGrant model)

export interface InstitutionalGrantDemo {
  id: string;
  name: string;
  funderName: string;
  type: 'B2G_GOVERNMENT' | 'PHILANTHROPIC_FOUNDATION' | 'CORPORATE_CSR' | 'DISTRICT_CONSORTIUM';
  regionBadge: string;
  country: 'ES' | 'US' | 'LATAM';
  status: 'ACTIVE_DEMO' | 'OPEN_APPLY' | 'PILOT';
  tierProvided: string;
  scopeDescription: string;
  allowedDomains: string[];
  maxBeneficiaries: number;
  currentBeneficiaries: number;
  highlightedSubject: string;
}

export const sponsoredGrantsCatalog: InstitutionalGrantDemo[] = [
  {
    id: "grant-cam-2026",
    name: "Convenio Comunidad de Madrid B2G",
    funderName: "Consejería de Educación (Madrid)",
    type: "B2G_GOVERNMENT",
    regionBadge: "Madrid, ES",
    country: "ES",
    status: "ACTIVE_DEMO",
    tierProvided: "Academia Base (student_core)",
    scopeDescription: "Cobertura completa para 2º de Bachillerato en preparación de PAU / EvAU (Lengua Castellana, Matemáticas II e Historia).",
    allowedDomains: ["@educa.madrid.org", "@madrid.org"],
    maxBeneficiaries: 5000,
    currentBeneficiaries: 1840,
    highlightedSubject: "Preparación PAU 2026",
  },
  {
    id: "grant-andalucia-edtech",
    name: "Plan de Refuerzo Digital Andalucía",
    funderName: "Junta de Andalucía · Fondos Europeos",
    type: "B2G_GOVERNMENT",
    regionBadge: "Andalucía, ES",
    country: "ES",
    status: "ACTIVE_DEMO",
    tierProvided: "Academia Base (student_core)",
    scopeDescription: "Evaluación formativa y tutor socrático para centros públicos de ESO y Bachillerato en materias STEM.",
    allowedDomains: ["@g.educaand.es"],
    maxBeneficiaries: 3500,
    currentBeneficiaries: 1210,
    highlightedSubject: "Refuerzo STEM & Lengua",
  },
  {
    id: "grant-hewlett-stem",
    name: "Global Open Ed Foundation Grant",
    funderName: "Open Education Philanthropy Fund",
    type: "PHILANTHROPIC_FOUNDATION",
    regionBadge: "Internacional",
    country: "US",
    status: "OPEN_APPLY",
    tierProvided: "Academia Élite & Oral (student_ap_allaccess)",
    scopeDescription: "Fondo de mecenazgo para estudiantes de centros de alta complejidad. Financia Voice Lab Oral (Speaking) y supercómputo sin límite.",
    allowedDomains: ["@colabedu.org"],
    maxBeneficiaries: 2000,
    currentBeneficiaries: 890,
    highlightedSubject: "Speaking AP / IB & Equidad",
  },
  {
    id: "grant-lausd-ap-access",
    name: "California District AP Access Partnership",
    funderName: "Consorcio Escolar California / LAUSD Pilot",
    type: "DISTRICT_CONSORTIUM",
    regionBadge: "California, US",
    country: "US",
    status: "PILOT",
    tierProvided: "Academia Élite & Oral (student_ap_allaccess)",
    scopeDescription: "Preparación intensiva para exámenes AP Spanish Language & Literature y apoyo curricular en ciencias.",
    allowedDomains: ["@lausd.net", "@sfusd.edu"],
    maxBeneficiaries: 1500,
    currentBeneficiaries: 630,
    highlightedSubject: "College Board AP Spanish",
  }
];

export function getGrantsByCountry(country?: 'ES' | 'US' | 'LATAM'): InstitutionalGrantDemo[] {
  if (!country) return sponsoredGrantsCatalog;
  return sponsoredGrantsCatalog.filter(g => g.country === country);
}
