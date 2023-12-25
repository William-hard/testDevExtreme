using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
using ASP_NET_Core.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ASP_NET_Core.Controllers {

    [Route("api/[controller]/[action]")]
    public class SampleDataController : Controller {
       
        [HttpGet]
        public object Get(DataSourceLoadOptions loadOptions) {
            return DataSourceLoader.Load(SampleData.Customers, loadOptions);
        }
        [HttpPut]
        public IActionResult Put(int key, string values)
        {

            var item = SampleData.Customers.First(e => e.ID == key);

            JsonConvert.PopulateObject(values, item);

            if (!TryValidateModel(item))
                return BadRequest(ModelState);

            return Ok(item);
        }
    }
}