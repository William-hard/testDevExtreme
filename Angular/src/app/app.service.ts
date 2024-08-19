import { Injectable } from "@angular/core";

export interface ExecutionItem {
  Id: number;

  Movement?: number;

  Lot?: string;

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
    Lot: undefined,
    IsBatch: true,
    LotSelection: [{ Id: 1, LotNumber: 'test' }],
    Disabled: false,
  },
  {
    Id: 2,
    IsBatch: false,
    Movement: undefined,
    Lot: undefined,
    LotSelection: [{ Id: 1, LotNumber: 'test' }, { Id: 2, LotNumber: 'tst2' }],
    Disabled: false,
  },
  {
    Id: 3,
    IsBatch: true,
    Movement: 3,
    Lot: 'lotSet',
    LotSelection: [{ Id: 1, LotNumber: 'test' }, { Id: 2, LotNumber: 'tst2' }],
    Disabled: true,
  }];

@Injectable()
export class Service {
  getCustomers(): ExecutionItem[] {
    return customers;
  }
}
