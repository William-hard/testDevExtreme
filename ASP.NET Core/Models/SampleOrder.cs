using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_NET_Core.Models {
    public class Customer
    {
        
        public int ID { get; set; }

        [Required]
        public string CompanyName { get; set; }

        public string Address { get; set; }

        [StringLength(int.MaxValue, MinimumLength = 4, ErrorMessage = "City must have at least 2 symbols")]
        public string City { get; set; }

        public string State { get; set; }

        public int Zipcode { get; set; }

        [Required]
        [RegularExpression(@"^\(\d{3}\)\ \d{3}-\d{4}$", ErrorMessage = @"Your phone must have ""(555) 555-5555"" format!")]
        public string Phone { get; set; }

        public string Fax { get; set; }

        public string Website { get; set; }
    }
}
