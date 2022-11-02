let url = 'http://localhost:3000/products?'
let basket = [

]
let overlay = document.querySelector('.overlay')
let addBtn = document.querySelector('.add-btn')
let formClose = document.querySelector('.form__close')
let productsRow = document.querySelector('.products__row')
let form = document.querySelector('.form')
let seeAll = document.querySelector('.products__see')
let formChange = document.querySelector('.form-change')
let productsItem = document.querySelectorAll('.products__item')
let basketcount = document.querySelector('.header__list-cart')

addBtn.addEventListener('click', function () {
    overlay.style.display = 'block'
    formChange.style.display = 'none'
})

formClose.addEventListener('click', function () {
    overlay.style.display = 'none'
})

overlay.addEventListener('click', function (e) {
    if (e.target.className.includes('overlay')) {
        overlay.style.display = 'none'
    }
})

let all = ''
let status = 'All'

const refreshForm = (e) => {
    e.target[0].value = ''
    e.target[1].value = ''
    e.target[2].value = ''
    e.target[3].value = ''
    e.target[4].value = ''
    overlay.style.display = 'none'
    getProducts()
}


function getProducts () {
    productsRow.innerHTML = ''
    fetch(url + `${all.length ? '' : '_limit=4&'}${status === 'All' ? '' : 'category=' + status }` )
        .then((res) => res.json())
        .then((res) => {
            res.forEach((item) => {
                productsRow.innerHTML += `
                    <div class="products__card">
                        <img src="${item.image}" alt="" class="products__card-img">
                        <h3 class="products__card-title">
                            ${item.title}
                        </h3>
                        <p class="products__card-price">
                           Price : $${item.price}
                        </p>    
                         <p class="products__card-price">
                           Memory : ${item.memory} GB
                        </p>  
                          <p class="products__card-price">
                            Category : ${item.category} 
                        </p>
                        <div class="products__card-btns">
                            <button class="products__card-btn products__card-basket" data-id="${item.id}">
                                Buy
                            </button>
                            <button data-id="${item.id}" class="products__card-btn products__card-change">
                                Change
                            </button> 
                            <button data-id="${item.id}" type="button" class="products__card-btn products__card-delete">
                                Delete
                            </button>
                        </div>
                    </div>
                `
            })

            let deleteBtns = document.querySelectorAll('.products__card-delete')

            Array.from(deleteBtns).forEach((btn) => {
                btn.addEventListener('click', () => {
                    fetch(url + `/${btn.dataset.id}`, {
                        method : 'DELETE'
                    }).then(() => {
                        getProducts()
                    }).catch(() => alert('Ошибка при удалении'))
                })
            })

            let changeBtn = document.querySelectorAll('.products__card-change')
            Array.from(changeBtn).forEach((change) => {
                change.addEventListener('click', function () {
                    overlay.style.display = 'block'
                    formChange.style.display = 'flex'
                    fetch(`http://localhost:3000/products/${change.dataset.id}`)
                        .then((res) => res.json())
                        .then((res) => {
                           formChange[0].value = res.title
                           formChange[1].value = res.price
                           formChange[2].value = res.memory
                           formChange[3].value = res.image
                           formChange[4].value = res.category

                        }).catch(() => alert('Ошибка при попытке изменения товара'))
                    formChange.addEventListener('submit', (e) => {
                        let product = {
                            title: e.target[0].value,
                            price: e.target[1].value,
                            memory: e.target[2].value,
                            image: e.target[3].value,
                            category: e.target[4].value
                        }

                        fetch(`http://localhost:3000/products/${change.dataset.id}`, {
                            method : 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(product)
                        }).then((res) => {
                          refreshForm(e)
                        }).catch(() => alert('Ошибка при добавлении'))
                    })
                })
            })


            let basketBtn = document.querySelectorAll('.products__card-basket')
            Array.from(basketBtn).forEach((btn)=>{
                btn.addEventListener('click', ()=>{
                    fetch(`http://localhost:3000/products/${btn.dataset.id}`)
                        .then((res) => res.json())
                        .then((res) => {
                            basket =[...basket, {
                                ...res,
                                count: 0
                                // count: `${res.id === res.id ? count++ : ''}`
                            }]
                            basketcount.textContent= basket.length
                            console.log(basket)

                        }).catch(() => alert('Ошибка при попытке изменения товара'))
                })
            })



        } ).catch((err) => alert(err) )


}
getProducts()

form.addEventListener('submit', (e) => {
    e.preventDefault()

    let product = {
        title: e.target[0].value,
        price: e.target[1].value,
        memory: e.target[2].value,
        image: e.target[3].value,
        category: e.target[4].value
    }

    fetch(url, {
        method : 'POST',
        headers: {
            'Content-Type' : 'Application/json'
        },
        body: JSON.stringify(product)
    }).then(() => {
        refreshForm(e)
    })
        .catch(() => alert('Ошибка при добавлении'))

})

seeAll.addEventListener('click', () => {
    if (seeAll.children[0].textContent === 'See All'){
        all = 'all'
        getProducts()
        seeAll.children[0].textContent = 'Hide All'
    } else {
        seeAll.children[0].textContent = 'See All'
        all = ''
        getProducts()
    }
})

Array.from(productsItem).forEach((item) => {
    item.addEventListener('click', () => {

        Array.from(productsItem).forEach((el) => {
            if (el.textContent === item.textContent){
                el.classList.add('products__item_active')
            } else {
                el.classList.remove('products__item_active')
            }
        })

        status = item.textContent
        getProducts()

    })
})



