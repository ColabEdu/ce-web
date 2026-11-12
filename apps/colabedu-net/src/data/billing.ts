// src/data/billing.ts
// Lector estático en tiempo de compilación (Build Time SSG) del manifiesto canónico de billing
// Fuente única de verdad: ce-svc-parent/ce-svc-billing-access/src/main/resources/billing-manifest.yaml

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export interface PricePoint {
  id: string;
  price: number; // en centavos (ej: 1999 = 19.99)
  period: number;
  period_unit: string;
}

export interface SitePrice {
  site: string; // 'es' | 'us'
  currency: string; // 'EUR' | 'USD'
  price_points: PricePoint[];
}

export interface BillingTier {
  id: string;
  name: string;
  audience: 'STUDENT' | 'TEACHER';
  description: string;
  monthly_evaluations: number;
  features: string[];
  popular: boolean;
  chargebee_item_id: string;
  prices: SitePrice[];
}

export interface BillingManifest {
  version: string;
  product_family: string;
  tiers: BillingTier[];
}

function loadBillingManifest(): BillingManifest {
  // Ruta canónica dentro del monorepo desde ce-web/apps/colabedu-net
  const manifestPath = path.resolve(
    process.cwd(),
    '../../../ce-svc-parent/ce-svc-billing-access/src/main/resources/billing-manifest.yaml'
  );

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Billing manifest not found at: ${manifestPath}`);
  }

  const fileContent = fs.readFileSync(manifestPath, 'utf-8');
  return parse(fileContent) as BillingManifest;
}

export const billingData = loadBillingManifest();

export function getTiersByAudience(audience: 'STUDENT' | 'TEACHER'): BillingTier[] {
  return billingData.tiers.filter((tier) => tier.audience === audience && tier.id !== 'topup_allaccess');
}

export function formatPrice(cents: number, currency: string): string {
  const amount = cents / 100;
  if (currency === 'EUR') {
    return `${amount.toFixed(2).replace('.', ',')} €`;
  }
  return `$${amount.toFixed(2)}`;
}

export function getTierPrice(
  tier: BillingTier,
  siteCode: 'es' | 'us',
  periodUnit: 'month' | 'year'
): { formatted: string; amountCents: number; currency: string } | null {
  const sitePrice = tier.prices.find((p) => p.site === siteCode);
  if (!sitePrice) return null;

  const point = sitePrice.price_points.find((pp) => pp.period_unit === periodUnit);
  if (!point) return null;

  return {
    formatted: formatPrice(point.price, sitePrice.currency),
    amountCents: point.price,
    currency: sitePrice.currency,
  };
}
