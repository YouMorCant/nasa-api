//Declare DOMS
const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function updateDOM(){
    resultsArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
       
        // Link
        const link =document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        //Add to Favourite
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        saveText.textContent = 'Add to Favourites';
        saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        
        //Card Desc
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;

        //Footer Cotainer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        //Date
        const date = document.createElement('strong');
        date.textContent = result.date;

        //Copyright
        const copyrightResult = result.copyright === undefined ? '' : ` © ${result.copyright}`;
        const copyright = document.createElement('span');
        copyright.textContent = `${copyrightResult}`;

        //Append
        footer.append(date,copyright);
        cardBody.append(cardTitle,saveText,cardText,footer);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);
    });
}

//Get 10 images from NASA APi
async function getNasaPictures(){
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        console.log(resultsArray);
        updateDOM();
    }catch (error) {
        // Catch error here
    }
}

//update favourites array in local storage
function updateFavourites(){
    localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
}

//Add result to favourites
function saveFavourite(itemUrl) {
    //Loop through result array to select favourite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;
            console.log(favourites);

            // const saveConfirmedText = favourites[itemUrl] ? 'Already in Favourites' : 'ADDED!';
            // saveConfirmed.textContent= saveConfirmedText;

            //Show Save Confirmation for 2 secs
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);

            //Set Favourites in local storage
            updateFavourites();
        }
    });
}

//On Load
getNasaPictures();