using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace WebAPI_ASPCoreProject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClicksAPIController : ControllerBase
    {
        //Initializing lists of All countries and suitable countries. Firstly we get all countries and then depending whether their regions/verticals suit us - add them to SuitableCountriesList
        List<SingleCountry> SuitableCountriesList = new List<SingleCountry>();
        List<SingleCountry> AllCountries = new List<SingleCountry>();

        //Default logger
        private readonly ILogger<ClicksAPIController> _logger;

        public ClicksAPIController(ILogger<ClicksAPIController> logger)
        {
            _logger = logger;
        }

        //Receive start data from InputCountries.json
        public void GetCountriesFromJSON()
        {
            // Reading data from JSON file and writing it to the AllCountries list
            using (FileStream fs = new FileStream("InputCountries.json", FileMode.OpenOrCreate))
            {
                AllCountries = JsonSerializer.Deserialize<List<SingleCountry>>(fs);              
            }
        }


        [HttpGet(Name = "ClicksAPI")]
        [HttpGet("{number}")]
        public CountryClicks Get(string? vertical, string? region, int? budget)
        {
            //Default budget (if not set by user)
            if (budget == null) budget = 5000;

            //Logging debug data
            Console.WriteLine("Vertical - " + vertical + ", region - " + region + ", budget - " + budget.ToString());

            //Get all countries from JSON to AllCountires list
            GetCountriesFromJSON();

            //Initializing variables for checks and DataToReturn list that will contain data that will be returned.
            bool vertical_suits=false, region_suits = false;
            CountryClicks DataToReturn = new CountryClicks();
            DataToReturn.SuitableCountriesArr = new List<string> { };
            DataToReturn.IMG_LinkArr = new List<string> {  };


            //Go through all countries and check whether they suit vertical and region
            foreach (SingleCountry country in AllCountries)
            {
                //'Sanitize'
                vertical_suits = false;
                region_suits = false;

                foreach (string vert in country.AvailableVerticals)
                {
                    if (vert == vertical)
                    {
                        vertical_suits=true;
                    }
                }

                foreach (string reg in country.AvailableRegions)
                {
                    if (reg== region)
                    {
                        region_suits=true;
                    }
                }

                //If both region and vertical suit requirements:
                if (region_suits && vertical_suits)
                {
                    //Add this country to corresponding list
                    SuitableCountriesList.Add(country);
                    DataToReturn.SuitableCountriesArr.Add(country.SingleCountryName);
                    DataToReturn.IMG_LinkArr.Add(country.SingleCountryLogo);
                    DataToReturn.SumClicks += country.SingleCountryClicks;

                }
                
               
            }

            //Add 'budget' bonus to total number of clicks
            DataToReturn.SumClicks = Convert.ToInt32(DataToReturn.SumClicks + (budget/10));
           
            return DataToReturn;           
        }
    }
}