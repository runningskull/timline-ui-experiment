// fair warning: this code is messy :)

var STRETCH = 1.75
  , WEEK = 13

function handle(fn, ctx){ return function(evt){ $(ctx || evt.target)[fn](evt) } }
function noopHandler(e){ debugger;e.preventDefault() }

$(function() {

  $('.add').on('mousedown', handle('startDrag'))

})

$.fn.startDrag = function(evt) {
  if (! $(evt.target).hasClass('add'))
    return;

  var onDrag = function(_evt) {
    function inBounds(mouse) {
      //console.log('inside', '[', bounds.top, ' - ', mouse.y, ' - ', bounds.bottom(), ']')
      return (mouse.y + (16 - mouseOffset.y) < bounds.bottom())
              && (mouse.y - mouseOffset.y > bounds.top)
    }

    _evt.preventDefault()

    if (! inBounds({x:_evt.pageX, y:_evt.pageY}))
      return;

    this.offset({top: _evt.pageY - mouseOffset.y})

    this.find('.num-weeks i').text('' + (1 + ~~((_evt.pageY - origMousePos.y)/WEEK)))

    $('.timeline').css({
      height: origTimelineHeight + ((_evt.pageY - origMousePos.y) / STRETCH)
    })
  }.bind(this)

  evt.preventDefault()

  var pos = this.offset()
    , origMousePos = {x:evt.pageX, y:evt.pageY}

    , $timeline = $('.timeline')
    , origTimelineHeight = $timeline.height()
    , timelineOffset = $timeline.offset()

    , bounds = { top: timelineOffset.top + 16
                ,bottom: function() {
                  return timelineOffset.top + $timeline.height() - 16
                 }
               }

    , mouseOffset = { x: evt.pageX - pos.left
                     ,y: evt.pageY - pos.top }

  this
    .data('dragging', true)
    .addClass('dragging')
    .on('click.dragging', noopHandler)
    .prepend('<span class="num-weeks"><i>1</i> weeks</span>')

  this.parents()
    .on('mousemove.dragging', onDrag)
    .on('mouseup.dragging', handle('stopDrag', this))
}

$.fn.stopDrag = function(evt) {
  evt.preventDefault()

  this
    .data('dragging', null)
    .removeClass('dragging')
    .off('.dragging')
    .parents()
      .off('.dragging')

  var $input = $('<input type="text" class="milestone" placeholder="Describe this milestone">')
  this.append($input)
  setTimeout($input.focus.bind($input), 10)
}



