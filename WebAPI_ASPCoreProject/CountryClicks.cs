namespace WebAPI_ASPCoreProject
{
    public class CountryClicks
    {
       public CountryClicks()
        {
            //Empty constructor
        }

        //List of countries names - received from InputCountries.json after it's processed into SingleCountry class.
       public List<string>? SuitableCountriesArr { get; set; }


       //List of pathes to countries logos.
       public List<string>?  IMG_LinkArr { get; set; }

        //Total sum of clicks that provide countries that suit needed conditions
       public int SumClicks { get; set; }


    }
}
