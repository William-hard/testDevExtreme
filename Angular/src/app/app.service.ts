import { Injectable } from '@angular/core';

export interface ExecutionItem {
  Id: number;

  Movement?: number;

  Lot: string;

  IsBatch: boolean;

  LotSelection: Lot[];

  Disabled: boolean;
}

export interface Lot {
  Id: number;
  LotNumber: string;
}

const customers: ExecutionItem[] = [
  {
    Id: 1,
    Movement: undefined,
    Lot: '',
    IsBatch: true,
    LotSelection: [{ Id: 1, LotNumber: 'test' }],
    Disabled: false,
  },
  {
    Id: 2,
    IsBatch: false,
    Movement: undefined,
    Lot: '',
    LotSelection: [{ Id: 1, LotNumber: 'lot 1' }, { Id: 2, LotNumber: 'lot 2' }],
    Disabled: false,
  },
  {
    Id: 3,
    IsBatch: true,
    Movement: undefined,
    Lot: '',
    LotSelection: [],
    Disabled: true,
  }];

@Injectable()
export class Service {
  getCustomers(): ExecutionItem[] {
    return customers;
  }
}
