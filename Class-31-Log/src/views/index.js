let currentUser = null
const socket = io()

// events
$(document).ready(() => init())

$(document).on('submit', '#info-form', e => testLongProcessGet(e))

$(document).on('submit', '#user-form', e => userGet(e))
$(document).on('click', '#user-isAdmin', () => userUpdateIsAdmin())
$(document).on('click', '#user-login-facebook', () => userLoginFacebook())

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
$(document).on('click', '#storage-clear', e => storageClear(e))

// io
socket.on('chat', messages => onChatMessages(messages))
socket.on('products', products => onProducts(products))

// init
const isUserValid = () => {
  let user = localStorage.getItem('user')

  if (user !== null) {
    user = JSON.parse(user)
    currentUser = user
  }

  const isValid = user !== null
  return isValid
}

const init = () => {
  $.ajax({
    url: `/api/info`,
    type: 'get',
    success: (info) => {
      get('#info-data').value = JSON.stringify(info, undefined, 4)
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })

  $.ajax({
    url: `/api/user/isAuthenticated`,
    type: 'get',
    success: (user) => {
      get('#user-isAdmin').checked = user.isAdmin

      currentUser = user
      localStorage.setItem('user', JSON.stringify(user))

      const template = Handlebars.compile($('#user-welcome').html())
      const domTemplate = template(user)

      $('#user-form').html(domTemplate)
      cartGet()
    },
    error: (xhr, _, thrownError) => {
      const userTemplate = $('#user-login').html()
      $('#user-form').html(userTemplate)
    }
  })
}

// test
const testLongProcessGet = (e) => {
  e.preventDefault()
  get('#info-data').value = 'Ejecucando subproceso en background...'
  $('#text-long-process-message').addClass('show')
  $('#test-long-process').hide()

  $.ajax({
    url: `/api/productMock/random/2000000`,
    type: 'get',
    success: (payload) => {
      get('#info-data').value = JSON.stringify(payload, undefined, 4)
      alert('Proceso no bloqueante finalizado: ' + JSON.stringify(payload))
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

// user
const userGet = (e) => {
  e.preventDefault()

  $.ajax({
    url: `/api/user/logout`,
    type: 'get',
    success: () => {
      localStorage.clear()
      const userTemplate = $('#user-login').html()

      $('#user-form').html(userTemplate)
      $('#cart').html('')
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const userUpdateIsAdmin = () => {
  if (!isUserValid()) {
    get('#user-isAdmin').checked = !get('#user-isAdmin').checked
    alert('Inicie sesión')
    return
  }

  const userId = currentUser.id
  const isAdmin = get('#user-isAdmin').checked

  $.ajax({
    url: `/api/user/${userId}/isAdmin`,
    type: 'patch',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ isAdmin }),
    success: () => {
      if (isUserValid()) {
        currentUser.isAdmin = isAdmin
        localStorage.setItem('user', JSON.stringify(currentUser))
      }
    },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const userLoginFacebook = () => {
  $('#user-login-facebook').prop('disabled', true)
  $('#user-login-facebook').prop('value', 'Espere por favor...')

  location.href = '/api/user/facebook/login'
}

// chat
const chatSendMessage = (e) => {
  e.preventDefault()

  if (!isUserValid()) {
    alert('Inicie sesión')
    return
  }

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
  // denormalize
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
  })
}

const productMockData = (e) => {
  e.preventDefault()

  if (!isUserValid()) {
    alert('Inicie sesión')
    return
  }

  $.ajax({
    url: '/api/productMock/4',
    type: 'get',
    success: (payload) => {
      $('#product-row').empty()
      onProducts(payload)
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
    success: () => {
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
  if (!isUserValid()) {
    alert('Inicie sesión')
    return
  }

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

const productGetByTitle = (e) => {
  const title = e.target.value
  const url = (title === '') ? `/api/products` : `/api/products/${title}/title`

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
    data: { [field]: e.target.value },
    error: (xhr, _, thrownError) => alert(`${xhr.status} -> ${thrownError}`)
  })
}

const productDelete = (e) => {
  if (!isUserValid()) {
    alert('Inicie sesión')
    return
  }

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
const cartGet = () => {
  $.ajax({
    url: `/api/cart`,
    type: 'get',
    success: (cart) => cartRefresh(cart)
  })
}
const cartRefresh = (payload) => {
  if (!payload.products.length) return

  get('#cart-id').value = payload.id

  const template = $('#template-cart-table').html()
  $('#cart').html(template)
  $('#cart-row').html('')

  payload.products.forEach(product => {
    const domTemplate = $('#template-cart-row').html()
    const template = Handlebars.compile(domTemplate)
    const dom = template(product)

    $('#cart-row').append(dom)
  })
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

const storageClear = () => {
  localStorage.clear()
}
