import { Payment } from '../../types';
import { isPaidBooking } from './bookingUtils';
import { calculateCommission } from './commissionUtils';

export function calculateProviderSales(merchantName: string, payments: Payment[]): number {
  return payments
    .filter(pay => pay.merchantName === merchantName && isPaidBooking(pay.status))
    .reduce((acc, pay) => acc + pay.amount, 0);
}

export function calculateProviderCommission(sales: number): number {
  return calculateCommission(sales);
}
