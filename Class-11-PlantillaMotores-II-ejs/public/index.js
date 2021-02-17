$(document).on('submit', 'form', function (e) {
  e.preventDefault()

  $.post('/products/api', $(this).serialize(), data => {
  }).done(() => {
    window.location.href = '/products/view'
  }).fail(() => {
    alert('Error')
  })
})
