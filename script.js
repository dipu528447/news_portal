// news category
try {
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => loadCategory(data.data.news_category));
}
catch (err) {
    console.log(err);
}
finally {
    document.getElementById('categorySection').innerText = "";
}

//data copy is for keep a copy of category so that we can avoid api call for reducing loading time
let dataCopy = []


function loadCategory(data) {
    let navUL = document.getElementById('categorySection');
    dataCopy = data;
    //sort(data);
    data.map(item => {
        let liItem = document.createElement("li");
        liItem.classList.add("nav-item");
        liItem.innerHTML = `<a class="nav-link" aria-current="page" href="#" id=${item.category_id} onClick="categoryClicked('${item.category_id}','${item.category_name}')">${item.category_name}</a>`
        navUL.appendChild(liItem);
    })
    //default loaded category
    categoryClicked('01', "Breaking News");
}
let gclickedId = '', gclickedItem = ''
document.getElementById('floatingSelectGrid').addEventListener("click", () => {
    console.log(gclickedId, gclickedItem);
    if (gclickedId !== '' && gclickedItem !== '') {
        categoryClicked(gclickedId, gclickedItem);
    }
})
// category click action
function categoryClicked(clickedId, clickedItem) {
    gclickedId = clickedId;
    gclickedItem = clickedItem;
    dataCopy.forEach(item => { document.getElementById(`${item.category_id}`).classList.remove("active") });

    document.getElementById(clickedId).classList.add("active");
    setTimeout(() => {
        document.getElementById("cards").innerHTML = `<div class="d-flex justify-content-center align-content-center my-5 py-5">
                                                    <div class="spinner-border" role="status">
                                                    <span class="visually-hidden"></span>
                                                    </div>
                                                </div>`
    }, 10);

    try {
        fetch(`https://openapi.programming-hero.com/api/news/category/${clickedId}`)
            .then(res => res.json())
            .then(data => {
                let itemCount = document.getElementById('itemCount');
                itemCount.innerText = `${data.data.length} items found for ${clickedItem} category `
                console.log(data.data);

                // sorting 

                if (data.data.length > 0 && document.getElementById("floatingSelectGrid").value == '1') {
                    data.data.sort((a, b) => b.total_view - a.total_view);
                }
                if (data.data.length > 0 && document.getElementById("floatingSelectGrid").value == '2') {
                    data.data.sort((a, b) => a.total_view - b.total_view);
                }
                loadCategoryContent(data.data);
            })
    }
    catch (err) {
        console.log(err);
    }
    finally {
        document.getElementById("cards").innerText = "";
    }

}

function loadCategoryContent(content) {
    //console.log(content);
    let cards = document.getElementById("cards");
    cards.innerHTML = '';
    content.map(item => {
        let card = document.createElement("div");
        card.setAttribute("class", "card mb-3");
        card.setAttribute("style", "'max-width:1140px;'");
        card.innerHTML = `<div class="row g-0 p-3">
                            <div class="col-md-4">
                                <img src="${item.image_url}" class="img-fluid rounded-start h-100" id="cartImage" alt="Picture is not found">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.details.length > 200 ? item.details.substring(0, 200) + `...` : item.details}</p>
                                    <div class="c-footer d-flex justify-content-between">
                                        <div class="d-flex col-3">
                                            <div class="reportImage col-5">
                                                <img src="${item.author.img}" alt="" class="rounded-circle w-50 border">
                                            </div>
                                            <div class="col-7">
                                                <p class="card-text">
                                                    <small class="text-muted">${item.author.name === null ? "Not Available" : item.author.name}</small>
                                                    <br>
                                                    <small class="text-muted">${item.author.published_date ? item.author.published_date.slice(0, 10) : "Date Not Found"}</small>
                                                </p>
                                            </div>
                                        </div>
                                        <p class="card-text">
                                            <img src="image/visibility_FILL0_wght300_GRAD0_opsz24.svg" alt="">
                                            <small class="text-muted">${item.total_view === null ? "0" : item.total_view} Views</small>
                                        </p>
                                        
                                        <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="showDetailsNews('${item._id}')">
                                            <img src="image/arrow_forward_FILL0_wght300_GRAD0_opsz24.svg" alt="">
                                        </button>
                                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title logo" id="exampleModalLabel"></h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                            aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body logo-other-part fw-bolder">
                                                        <div class="row">
                                                            <div class="img-fluid" id="contentImage">

                                                            </div>
                                                        </div>
                                                        <div class="row mt-3">
                                                            <div  id="contentDetails">

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <div class="row d-flex justify-content-start">
                                                            <p>Reporter Details</p>
                                                            <div class="col-md-2" id="authorImage">

                                                            </div>
                                                            <div class="col-md-2" id="authorName">

                                                            </div>
                                                            
                                                            <div class="col-md-2" id="views">

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
        cards.appendChild(card);
    });
}
// load detail news
function showDetailsNews(itemId) {
    fetch(`https://openapi.programming-hero.com/api/news/${itemId}`)
        .then(res => res.json())
        .then(data => loadModalWithDetailsNews(data.data[0]));
}

// show detail news
function loadModalWithDetailsNews(detailNews) {
    console.log(detailNews);
    document.getElementById("exampleModalLabel").innerText = detailNews.title;
    document.getElementById("contentImage").innerHTML = `<img src=${detailNews.image_url} class="img-fluid" alt="pic not found">`
    document.getElementById("contentDetails").innerText = detailNews.details;
    document.getElementById("authorImage").innerHTML = `<img src=${detailNews.author.img} class="w-25 rounded-circle" alt="pic not found">`
    document.getElementById("authorName").innerText = detailNews.author.name === null ? "Author Name is not Available" : detailNews.author.name
    document.getElementById("views").innerText = `Views: ${detailNews.total_view === null ? "No views yet" : detailNews.total_view}`
}