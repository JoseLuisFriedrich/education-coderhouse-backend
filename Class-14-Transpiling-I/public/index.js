const socket = io()

// Product

let firstTime = true

$(document).on('submit', '#productForm', function (e) {
  e.preventDefault()

  $.post('/products/api', $(this).serialize(), () => {
  }).done((data) => {
    const title = document.querySelector('#title')
    const price = document.querySelector('#price')
    const thumb = document.querySelector('#thumbnail')

    title.value = ''
    price.value = ''
    thumb.selectedIndex = 0

    title.focus()
  }).fail(() => {
    alert('Error')
  })
})

socket.on('product', payload => {
  //table template
  if (firstTime) {
    firstTime = false
    const template = $('#template-product-table').html()
    $('#products').replaceWith(template)
  }

  //row template
  const domTemplate = $('#template-product-row').html()
  const template = Handlebars.compile(domTemplate)
  const dom = template(payload)

  $('#product-row').append(dom)
})

// Chat

$(document).on('submit', '#chatForm', function (e) {
  e.preventDefault()

  const user = document.querySelector('#user')
  const text = document.querySelector('#text')
  socket.emit('chat', { user: user.value, text: text.value })

  // user.value = ''
  text.value = ''

  text.focus()
})

socket.on('chat', payload => {
  //row template
  payload.forEach(message => {
    const domTemplate = $('#template-chat-row').html()
    const template = Handlebars.compile(domTemplate)
    const dom = template(message)
    $('#chat-row').append(dom)
  })
})
