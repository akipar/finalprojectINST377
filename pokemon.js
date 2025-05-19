const apiKey = '011257bd-2e5c-4dda-b8fe-1e7a4fa5e55b';

window.addEventListener('DOMContentLoaded', async ()=> {
    try{
        const res=await fetch('/Final', {method:'POST'});
        const data = await res.json();
        document.getElementById('visitCount').textContent = `You are visitor #${data.count}!`;
    } catch (err) {
        console.error('Visiter counter failed:', err);
    }
});

async function RandomCard() {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
        headers:{'X-Api-Key': apiKey},
        params: {
            pageSize:10,
            page: Math.floor(Math.random() * 100) +1
        }
    });
    return response.data.data;
}

function cardInfo(card) {
    const infoBox = document.getElementById('cardInfo');
    infoBox.innerHTML = `
        <h3>${card.name}</h3>
        <p><strong>Artist:</strong> ${card.artist || 'Unknown'}</p>
        <p><strong>Set:</strong> ${card.set?.name || 'Unknown'}</p>
      `;
}

async function Makeswiper() {
    const cards = await RandomCard();
    const wrapper = document.getElementById('swiper-wrapper');

    cards.forEach(card => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
        <img src="${card.images.small}" alt="${card.name}">`;
        slide.addEventListener('click', ()=> cardInfo(card));
        wrapper.appendChild(slide);
    });

    new Swiper('.swiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 5,
        spaceBetween: 15,
    });
}


async function searchCards(keyword = null) {   
    const inputElement = document.getElementById('searchInput');
    if (!inputElement) return;

    const query = (keyword ||inputElement.value).trim().toLowerCase();
    if (!query) return;

    const resultPage = document.getElementById('results');
    resultPage.innerHTML = '<p>Searching right now!</p>';

    try {
        const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
            headers: {'X-Api-Key':apiKey},
            params: {q:`name:"${query}" OR artist:"${query}"`}
        });

        const cards = response.data.data;
        console.log(cards);
        displayResults(cards);

        // const filtered = cards.filter(card =>
        // (card.name && card.name.toLowerCase().includes(query)) ||
        // (card.artist && card.artist.toLowerCase().includes(query))
        // );

        // displayResults(filtered);
    } catch (error) {
        document.getElementById('results').innerHTML = '<p>Error fetching cards..Try again!</p>';
        console.error(error);
    }
}

function displayResults(cards) {
    const container = document.getElementById('results');
    container.innerHTML = '';

    if (cards.length === 0) {
        container.innerHTML = '<p>No cards found.</p>';
        return;
    }

    const gliderContainer = document.createElement('div');
    gliderContainer.className = 'glider-contain';
    gliderContainer.innerHTML = '<p>Click on the Artist name or Pokemon name to do a search on them again!</p><div class="glider"></div><button aria-label="Previous" class="glider-prev">«</button><button aria-label="Next" class="glider-next">»</button><div role="tablist" class="dots"></div>';
    container.appendChild(gliderContainer);
    
    const gliderInner = gliderContainer.querySelector('.glider');
    
    cards.forEach(card => {
        const div = document.createElement('div');
        div.className = 'card';

        const artist = card.artist || 'Unknown';
        const name = card.name;
        const setName = card.set?.name || 'Unknown';

        div.innerHTML = `
          <img src="${card.images.small}" alt="${name}">
          <h3><a onclick="searchCards('${name.toLowerCase()}')"> ${name}</a></h3>
          <p><strong>Artist:</strong> <a onclick="searchCards('${artist.toLowerCase()}')"> ${artist}</a></p>
          <p><strong>Set:</strong> ${setName}</p>
        `;
        gliderInner.appendChild(div);
    });

    requestAnimationFrame(() => {
        new Glider(gliderInner, {
            slidesToShow: 3,
            slidesToScroll: 1,
            draggable: true,
            dots: gliderContainer.querySelector('.dots'),
            arrows: {
                prev: gliderContainer.querySelector('.glider-prev'),
                next: gliderContainer.querySelector('.glider-next')
            } 
        });
    });
}