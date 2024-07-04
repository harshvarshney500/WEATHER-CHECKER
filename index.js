const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-serchWeather]");
const searchForm=document.querySelector("[data-searchForm]");
const userInfoContainer= document.querySelector(".user-info-container");
const grantAccessContainer=document.querySelector(".sub-container.grant-location-container");
const loadingScreeen=document.querySelector(".loading-container");
// initially varible need
let currentTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
grantAccessContainer.classList.add("active");

//  ek kaam  pendiing hai

function switchTab(clickedTab)
{
     if(clickedTab!=currentTab)
     {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        // it is used to check weather th the search tab is open or not 
        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            //main pehle search vale tab pe tha , ab your weather tab visible karna hai
            userInfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            getformSessionStorage(); 
        }
     }
}
userTab.addEventListener("click",()=>
{
    switchTab(userTab);
});


searchTab.addEventListener("click",()=>
{
    switchTab(searchTab);
});
// check if cordinates availabe or not 
function getformSessionStorage(){
    const localCordinate=sessionStorage.getItem("user-coordinates");
    if(!localCordinate)
    {
        //agar local coordinate nhi mile  
        grantAccessContainer.classList.add("active");
    }
    else
    {
        const coordinate=JSON.parse(localCordinate);
        fetchUserWeather(coordinate);
    }
}
async function fetchUserWeather(coordinates)
{
     const {lat,lon}=coordinates;
     //make grant container invisible
     grantAccessContainer.classList.remove("active");
     //make loder visible
     loadingScreeen.classList.add("active");
     //API call
     try{
        const response= await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            const data=await response.json();
            loadingScreeen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);//ye to data dalne ke liye hai
     }
     catch(err)
     {
        loadingScreeen.classList.remove("active");
     } 
}
function renderWeatherInfo(weatherInfo)
{
    //firstly we have to feecth the elememt
    const cityName=document.querySelector("[data-cityName]") ;
    const countryIcon=document.querySelector("[data-contryicon]");
    const desc=document.querySelector("[data-weatherDESc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloud=document.querySelector("[ data-clouds]");
    // fetch value weather info  
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloud.innerText = `${weatherInfo?.clouds?.all}%`;
  



    // weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    // temp.innerText = weatherInfo?.main?.temp.toFixed(2);
    // windspeed.innerText = weatherInfo?.wind?.speed;
    // humidity.innerText = weatherInfo?.main?.humidity;
    // cloud.innerText = weatherInfo?.clouds?.all;
}
function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        //h/w show alert 
    }
}
function showposition(position)
{
    const userCoordinate={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinate));
    fetchUserWeather(userCoordinate);
}
const grantAcessButton=document.querySelector("[data-grantAccess]")
grantAcessButton.addEventListener("click",getLocation);


const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>
{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName=="")
    {
        return;
    }
    else
    {
        fetchSearchWeatherInfo(cityName);
    }
})
async function fetchSearchWeatherInfo(city)
{
    loadingScreeen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          const data=await response.json();
          loadingScreeen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);

      
    }
    catch(e)
    {

    }
}























