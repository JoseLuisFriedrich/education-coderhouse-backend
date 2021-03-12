const socket = io()

// User

$(document).ready(() => {
  $.ajax({
    url: '/user/api',
    type: 'get',
    success: (payload) => {
      get('#user-user').value = payload.id
      get('#user-isAdmin').checked = payload.isAdmin
      get('#chat-user').value = payload.username

      // Cart
      $.ajax({
        url: `/cart/api`,
        type: 'get',
        success: (payload) => {
          refreshCart(payload)
        }
      })
    },
    error: (xhr, ajaxOptions, thrownError) => {
      alert(`${xhr.status} -> ${thrownError}`)
    }
  })
})

$(document).on('click', '#user-isAdmin', function (e) {
  const user = get('#user-user').value
  const isAdmin = get('#user-isAdmin').checked

  $.ajax({
    url: `/user/api/${user}/isAdmin`,
    type: 'patch',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ isAdmin }),
    success: (payload) => {
      // console.log(payload)
    },
    error: (xhr, ajaxOptions, thrownError) => {
      alert(`${xhr.status} -> ${thrownError}`)
    }
  })
})

// Chat

$(document).on('submit', '#chatForm', function (e) {
  e.preventDefault()

  const user = get('#chat-user')
  const text = get('#chat-text')
  socket.emit('chat', { user: user.value, text: text.value })

  text.value = ''
  text.focus()
})

socket.on('chat', payload => {
  payload.forEach(message => {
    //row template
    const domTemplate = $('#template-chat-row').html()
    const template = Handlebars.compile(domTemplate)
    const dom = template(message)
    $('#chat-row').append(dom)
  })
})

// Product

let firstTimeProduct = true

$(document).on('submit', '#productForm', function (e) {
  e.preventDefault()

  $.ajax({
    url: '/products/api',
    type: 'post',
    data: $(this).serialize(),
    success: (payload) => {
      get('#price').value = ''
      get('#thumbnail').selectedIndex = 0

      const title = get('#title')
      title.value = ''
      title.focus()
    },
    error: (xhr, ajaxOptions, thrownError) => {
      alert(`${xhr.status} -> ${thrownError}`)
    }
  })
})

$(document).on('click', '#product-delete', function (e) {
  const id = Number($(e.target).closest('tr').find('td').html())

  $.ajax({
    url: `/products/api/${id}`,
    type: 'delete',
    success: (payload) => {
      //console.log(payload)
      $(e.target).closest('tr').remove()
    },
    error: (xhr, ajaxOptions, thrownError) => {
      alert(`${xhr.status} -> ${thrownError}`)
    }
  })
})

const refreshCart = (payload) => {
  if (!payload.products.length) return

  get('#cart-id').value = payload.id

  const template = $('#template-cart-table').html()
  $('#cart').replaceWith(template)
  $('#cart-row').html('')

  //row template
  payload.products.forEach(product => {
    //row template
    const domTemplate = $('#template-cart-row').html()
    const template = Handlebars.compile(domTemplate)
    const dom = template(product)

    $('#cart-row').append(dom)
  })

  // $('html, body').animate({
  //   scrollTop: $("#cartTitle").offset().top
  // }, 100);
}

$(document).on('click', '#product-cart', function (e) {
  const id = Number($(e.target).closest('tr').find('td').html())

  $.ajax({
    url: `/cart/api/${id}`,
    type: 'post',
    success: (payload) => {
      refreshCart(payload)
    },
    error: (xhr, ajaxOptions, thrownError) => {
      alert(`${xhr.status} -> ${thrownError}`)
    }
  })
})

socket.on('products', payload => {
  //table template
  if (firstTimeProduct) {
    firstTimeProduct = false
    const template = $('#template-product-table').html()
    $('#products').replaceWith(template)
  }

  //row template
  payload.forEach(product => {
    //row template
    const domTemplate = $('#template-product-row').html()
    const template = Handlebars.compile(domTemplate)
    const dom = template(product)

    $('#product-row').append(dom)
  })
})

// Cart

$(document).on('click', '#cart-delete', function (e) {
  const id = Number($(e.target).closest('tr').find('td').html())

  $.ajax({
    url: `/cart/api/${id}`,
    type: 'delete',
    success: (payload) => {
      //console.log(payload)
      $(e.target).closest('tr').remove()
    },
    error: (xhr, ajaxOptions, thrownError) => {
      alert(`${xhr.status} -> ${thrownError}`)
    }
  })
})
