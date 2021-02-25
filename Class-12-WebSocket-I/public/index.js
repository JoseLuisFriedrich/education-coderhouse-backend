const socket = io()
let firstTime = true

$(document).on('submit', 'form', function (e) {
  e.preventDefault()

  $.post('/products/api', $(this).serialize(), () => {
  }).done((data) => {
    const title = document.querySelector('#title')
    const price = document.querySelector('#price')
    const thumb = document.querySelector('#thumbnail')
    // socket.emit('product', data)

    title.value = ''
    price.value = ''
    thumb.selectedIndex = 0
    title.focus()
  }).fail(() => {
    alert('Error')
  })
})

socket.on('broadcast', payload => {
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
