export function calculateCommission(total: number, rate: number = 0.15): number {
  return total * rate;
}

export function calculatePayoutNet(total: number, rate: number = 0.15): number {
  return total * (1 - rate);
}

export function calculateIncentiveContribution(commission: number, rate: number = 0.20): number {
  return commission * rate;
}
