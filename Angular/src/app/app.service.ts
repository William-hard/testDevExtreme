import { Injectable } from '@angular/core';

export class Customer {
  ID: number | undefined;

  CompanyName: string | undefined;

  Address: string | undefined;

  City: string | undefined;

  State: string | undefined;

  Zipcode: number | undefined;

  Phone: string | undefined;

  Fax: string | undefined;

  Website: string | undefined;
}

const customers: Customer[] = [{
  ID: 1,
  CompanyName: '',
  Address: '702 SW 8th Street',
  City: 'Bentonville',
  State: 'Arkansas',
  Zipcode: 72716,
  Phone: '123456',
  Fax: '(800) 555-2171',
  Website: 'http://www.nowebsitesupermart.com',
}, {
  ID: 2,
  CompanyName: 'Electronics Depot',
  Address: '2455 Paces Ferry Road NW',
  City: 'NYC',
  State: 'Georgia',
  Zipcode: 30339,
  Phone: '(800) 595-3232',
  Fax: '(800) 595-3231',
  Website: 'http://www.nowebsitedepot.com',
}];

@Injectable()
export class Service {
  getCustomers(): Customer[] {
    return customers;
  }
}
