import { Injectable } from '@angular/core';

export interface ExecutionItem {
  Id: number;

  Movement?: number;

  Lot?: string;

  IsBatch: boolean;
}

const customers: ExecutionItem[] = [{
  Id: 1,
  Movement: undefined,
  Lot: undefined,
  IsBatch: true,
}, {
  Id: 1,
  Movement: undefined,
  Lot: undefined,
  IsBatch: false,
}];

@Injectable()
export class Service {
  getCustomers(): ExecutionItem[] {
    return customers;
  }
}
