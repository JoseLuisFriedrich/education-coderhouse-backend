let currentUser = null
const socket = io()

// events
$(document).ready(() => userGet())
$(document).on('click', '#user-isAdmin', () => userUpdateIsAdmin())

$(document).on('submit', '#chat-form', e => chatSendMessage(e))
$(document).on('click', '#chat-reset', e => chatDeleteAll(e))

$(document).on('click', '#product-cart', e => productAddToCart(e))
$(document).on('click', '#product-delete', e => productDelete(e))
$(document).on('keyup', '#product-filter-title', e => productGetByTitle(e))
$(document).on('change', '#product-filter-price', e => productGetByPriceRange(e))
$(document).on('input', '.product-update-title', e => productPatch(e))
$(document).on('input', '.product-update-price', e => productPatch(e))
$(document).on('submit', '#product-mock-form', e => productMockData(e))
$(document).on('submit', '#product-form', e => productAdd(e))

$(document).on('click', '#cart-delete', e => cartDelete(e))

// io
socket.on('chat', messages => onChatMessages(messages))
socket.on('products', products => onProducts(products))

// user
const userGet = () => {
  $.ajax({
    url: '/api/user',
    type: 'get',
    success: (user) => {
      get('#user-user').value = user.id
      get('#user-isAdmin').checked = user.isAdmin
      get('#chat-user').value = user.username
      currentUser = user

      // cart get
      $.ajax({
        url: `/api/cart`,
        type: 'get',
        success: (cart) => cartRefresh(cart)
      })
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const userUpdateIsAdmin = () => {
  const user = get('#user-user').value
  const isAdmin = get('#user-isAdmin').checked

  $.ajax({
    url: `/api/user/${user}/isAdmin`,
    type: 'patch',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ isAdmin }),
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

// chat
const chatSendMessage = (e) => {
  e.preventDefault()

  const text = get('#chat-text')

  socket.emit('chat', {
    text: text.value,
    user: currentUser
  })

  text.value = ''
  text.focus()
}

const chatDeleteAll = (e) => {
  $.ajax({
    url: '/api/chat',
    type: 'delete',
    success: () => {
      $('#chat-row').empty()
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

let isFirstMessage = true
const onChatMessages = (messages) => {
  // denormalize result
  const userSchema = new normalizr.schema.Entity('user')
  const messageSchema = new normalizr.schema.Entity('message', { user: userSchema }, { idAttribute: '_id' })
  const denormalizedMessages = normalizr.denormalize(messages.result, [messageSchema], messages.entities)

  // table template
  if (isFirstMessage) {
    isFirstMessage = false
    const template = $('#template-chat-table').html()
    $('#chat').replaceWith(template)
  }

  // row template
  denormalizedMessages.forEach(message => {
    const domTemplate = $('#template-chat-row').html()
    const template = Handlebars.compile(domTemplate)
    const dom = template(message)
    $('#chat-row').append(dom)
  })

  $('#chat-reset').addClass(denormalizedMessages.length > 0 ? 'show' : 'hide')
}

// products
let isFirstTimeProduct = true
const onProducts = (products) => {
  // table template
  if (isFirstTimeProduct) {
    isFirstTimeProduct = false
    const template = $('#template-product-table').html()
    $('#products').replaceWith(template)
  }

  // row template
  products.forEach(product => {
    const domTemplate = $('#template-product-row').html()
    const template = Handlebars.compile(domTemplate)
    const dom = template(product)

    $('#product-row').append(dom)

    // if (addToFilter) {
    //   // filter
    //   $('#product-filter-title').append(new Option(product.title, product.id))
    // }
  })
}

const productMockData = (e) => {
  e.preventDefault()

  $.ajax({
    url: '/api/productMock',
    type: 'get',
    data: { limit: 3 },
    success: (payload) => {
      $('#product-row').empty()
      onProducts(payload)

      // payload.forEach(product => {
      //   alert(product.id + product.title + product.price + product.thumbnail)
      //   // id: 1, jlf
      //   // title: 'string',
      //   // price: 22,
      //   // thumbnail: 'string',

      // })
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const productAdd = (e) => {
  e.preventDefault()

  $.ajax({
    url: '/api/products',
    type: 'post',
    data: $(e.currentTarget).serialize(),
    success: (payload) => {
      get('#price').value = ''
      get('#thumbnail').selectedIndex = 0

      const title = get('#title')
      title.value = ''
      title.focus()
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const productAddToCart = (e) => {
  const id = Number($(e.target).closest('tr').find('td').html())

  $.ajax({
    url: `/api/cart/${id}`,
    type: 'post',
    success: (payload) => {
      cartRefresh(payload)
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

// const productGetByTitle = (e) => {
//   const index = e.target.selectedIndex
//   const title = e.target[index].text
//   const url = index === 0 ? `/api/products` : `/api/products/${title}/title`

//   $.ajax({
//     url: url,
//     type: 'get',
//     dataType: 'json',
//     contentType: 'application/json',
//     // data: { title: title },
//     success: (payload) => {
//       $('#product-row').empty()

//       // onProducts(index === 0 ? payload : [payload])
//       onProducts(payload)
//     },
//     error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
//   })
// }

const productGetByTitle = (e) => {
  const title = e.target.value
  const url = (title === '') ? `/api/products` : `/api/products/${title}/title`

  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    contentType: 'application/json',
    // data: { title: title },
    success: (payload) => {
      $('#product-row').empty()

      // onProducts(index === 0 ? payload : [payload], false)
      onProducts(payload)
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const productGetByPriceRange = (e) => {
  const index = e.target.selectedIndex

  const from = index === 1 ? 0 : 50
  const to = index === 1 ? 50 : 999999
  const url = index === 0 ? `/api/products` : `/api/products/${from}/${to}/price`

  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    contentType: 'application/json',
    success: (payload) => {
      $('#product-row').empty()

      onProducts(payload)
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const productPatch = (e) => {
  if (e.target.value.length === 0) return

  const target = e.target.classList[0]
  const id = Number($(e.target).closest('tr').find('td').html())
  const field = target === 'product-update-title' ? 'title' : 'price'

  $.ajax({
    url: `/api/products/${id}/${field}`,
    type: 'patch',
    success: () => {
      //filter
      // if (field === 'title') {
      //   $(`#product-filter-title option[value="${id}"]`).text(e.target.value)
      // }
    },
    data: { [field]: e.target.value },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const productDelete = (e) => {
  const id = Number($(e.target).closest('tr').find('td').html())

  $.ajax({
    url: `/api/products/${id}`,
    type: 'delete',
    success: (payload) => {
      $(e.target).closest('tr').remove()
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

// cart
const cartRefresh = (payload) => {
  if (!payload.products.length) return

  get('#cart-id').value = payload.id

  const template = $('#template-cart-table').html()
  $('#cart').replaceWith(template)
  $('#cart-row').html('')

  payload.products.forEach(product => {
    const domTemplate = $('#template-cart-row').html()
    const template = Handlebars.compile(domTemplate)
    const dom = template(product)

    $('#cart-row').append(dom)
  })

  // $('html, body').animate({
  //   scrollTop: $("#cartTitle").offset().top
  // }, 100);
}

const cartDelete = (e) => {
  const id = Number($(e.target).closest('tr').find('td').html())

  $.ajax({
    url: `/api/cart/${id}`,
    type: 'delete',
    success: () => {
      $(e.target).closest('tr').remove()
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}
