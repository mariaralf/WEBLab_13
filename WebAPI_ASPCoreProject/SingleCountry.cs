namespace WebAPI_ASPCoreProject
{
    public class SingleCountry
    {
        //This class receives country info from JSON and turns it to C# class. Then this class will be processed and become part of CountryClicks class.


        //Name of country
        public string SingleCountryName { get; set; }

        //Name of verticals that suit this country
        public string[] AvailableVerticals { get; set; }

        //Name of regions that suit this country
        public string[] AvailableRegions { get; set; }

        //Number of clicks that THIS country provides
        public int SingleCountryClicks { get; set; }

        //Path to logo of THIS country
        public string SingleCountryLogo { get; set; }

    }
}
