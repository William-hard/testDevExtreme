using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_NET_Core.Models {
    static class SampleData {
        public static List<Customer> Customers = new List<Customer>
    {
        new Customer
        {
            ID = 1,
            CompanyName = "",
            Address = "702 SW 8th Street",
            City = "Bentonville",
            State = "Arkansas",
            Zipcode = 72716,
            Phone = "123456",
            Fax = "(800) 555-2171",
            Website = "http://www.nowebsitesupermart.com"
        },
        new Customer
        {
            ID = 2,
            CompanyName = "Electronics Depot",
            Address = "2455 Paces Ferry Road NW",
            City = "NYC",
            State = "Georgia",
            Zipcode = 30339,
            Phone = "(800) 595-3232",
            Fax = "(800) 595-3231",
            Website = "http://www.nowebsitedepot.com"
        }
    };
    }
}
